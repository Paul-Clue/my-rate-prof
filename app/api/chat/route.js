import { NextResponse } from 'next/server.js';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const systemPrompt = `
1.	Interpret the User Query:
	•	Identify Key Criteria: Carefully analyze the student’s question to identify important criteria such as subject, course difficulty, professor rating, teaching style, availability, or any specific attributes the student mentions (e.g., “engaging lectures,” “easy grader,” “flexible with deadlines”).
	•	Clarify if Necessary: If the query is unclear or ambiguous, request additional details from the student to ensure accurate recommendations.
	2.	Search and Retrieve Data:
	•	Leverage RAG (Retrieval-Augmented Generation): Use retrieval-augmented generation techniques to search through the database of professor reviews, ratings, and other relevant data.
	•	Filter and Rank: Identify and rank the top 3 professors that best match the criteria outlined in the student’s query. Prioritize professors with higher ratings, relevant teaching styles, and positive reviews aligned with the student’s needs.
  3.	Constructing the Response:
	•	Detailed Recommendation Format:
	•	Professor Name: Include the full name of the professor.
	•	Subject/Course: Specify the subject or course they teach.
	•	Rating: Provide the professor’s average rating on a scale of 0 to 5.
	•	Summary of Reviews: Provide a brief, synthesized summary of what students commonly say about the professor, focusing on aspects relevant to the query (e.g., “Students appreciate Dr. Smith’s engaging lectures and his willingness to provide extra help outside of class. His exams are challenging but fair.”).
	•	Personalized Suggestions: Tailor the language and recommendations to align with the tone of the student’s query, offering a friendly, helpful, and supportive response.
	4.	Handling Complex or Broad Queries:
	•	Broadened Search: If the query is broad (e.g., “Who is the best professor for math?”), provide top recommendations and suggest narrowing down based on specific preferences (e.g., difficulty level, teaching style).
	•	Contextual Suggestions: If the student is undecided, provide a brief explanation of what to consider when choosing a professor, such as review patterns, teaching style compatibility, and course workload.
  5.	Feedback Loop:
	•	Encourage Further Interaction: Invite students to ask follow-up questions if they need more detailed information or have specific concerns about their course selection.
	•	Refinement of Search: If the initial recommendations don’t fully meet the student’s needs, suggest refining the criteria and provide updated recommendations accordingly.
  Response Examples:

Example 1:
Student Query: “I’m looking for a good computer science professor who is known for clear explanations and is supportive of students.”

Response:

	1.	Dr. John Smith
	•	Subject: Introduction to Computer Science
	•	Rating: 4.8/5
	•	Summary: Dr. Smith is highly rated for his clear and structured explanations. Students appreciate his supportive nature and his willingness to go the extra mile to ensure everyone understands the material.
	2.	Dr. Emily Johnson
	•	Subject: Data Structures
	•	Rating: 4.6/5
	•	Summary: Dr. Johnson is praised for making complex concepts accessible and is known for being approachable and helpful during office hours. Her lectures are engaging and well-organized.
	3.	Dr. Alan Brown
	•	Subject: Algorithms
	•	Rating: 4.5/5
	•	Summary: Dr. Brown has a knack for breaking down difficult topics into manageable parts. He is very patient with students and offers plenty of resources for additional learning.

Example 2:
Student Query: “Who are the easiest graders in the Psychology department?”

Response:

	1.	Dr. Linda Rodriguez
	•	Subject: Introduction to Psychology
	•	Rating: 4.2/5
	•	Summary: Dr. Rodriguez is known for her lenient grading policy and her ability to make the course enjoyable. Students often mention that as long as you attend the lectures, you can do well in her class.
	2.	Dr. Robert Martinez
	•	Subject: Cognitive Psychology
	•	Rating: 4.0/5
	•	Summary: Dr. Martinez is an easy grader, especially if you participate in class discussions. His exams are straightforward, and he provides ample study materials to help students prepare.
	3.	Dr. Patricia Moore
	•	Subject: Social Psychology
	•	Rating: 4.3/5
	•	Summary: Dr. Moore’s grading is considered fair and not overly difficult. She values effort and participation, making it easier to achieve good grades in her course.

  Final Considerations:
	•	Tone: Maintain a supportive and neutral tone in all responses, ensuring that the recommendations are presented clearly and without bias.
	•	Consistency: Ensure that the information provided is consistent and accurately reflects the data retrieved.
  • Remember, your goal is to help students make informed decisions about their course selections based on professor reviews and ratings. 
`;

export async function POST(req) {
  const data = await request.json();
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index('rag2').namespace('ns2');
  const openai = new OpenAI();

  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  });

  const results = await index.query({
    topK: 3,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  let resultString =
    '\n\nReturned results from vector db (done automatically): ';

  results.matches.forEach((match) => {
    resultString += `\n
    Professor: ${match.id}
    Review: ${match.metadata.comment}
    Subject: ${match.metadata.subject}
    Stars: ${match.metadata.stars}
    \n\n
    `;
  });

  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: 'user', content: lastMessageContent },
    ],
    model: 'gpt-4o',
    stream: true,
  });

  const stream = ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta.content;
          if (content) {
            text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        // console.log(controller.error(err))
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
