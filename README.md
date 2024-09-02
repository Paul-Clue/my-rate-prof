# Rate My Professor Assistant

This is a Next.js application that serves as a support assistant for helping students find classes and professors that are suited to their needs. The application allows users to interact with an AI assistant to get recommendations for professors and classes based on their preferences.

## Features

- Interactive chat interface with an AI assistant.
- Responsive design that works on various screen sizes.
- User-friendly layout with clear message formatting.
- Image display for visual context.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Paul-Clue/my-rate-prof
   ```

2. Navigate to the project directory:

   ```bash
   cd rate-my-professor-assistant
   ```

3. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

To start the development server, run:
  ```bash
  npm run dev
  ```

  
Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Usage

- Type your message in the input field and click "Send" to interact with the assistant.
- The assistant will respond with recommendations and information based on your queries.

## Customization

You can customize the following aspects of the application:

- **Styling**: Modify the styles in the `app/page.js` file to change the appearance of the chat interface.
- **AI Responses**: Update the logic in the API route (`/api/chat`) to customize how the assistant responds to user queries.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the framework.
- [Material-UI](https://mui.com/) for the UI components.
- [OpenAI](https://openai.com/) for the AI model used in the assistant.
