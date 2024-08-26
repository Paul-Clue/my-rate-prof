import Image from "next/image";
import { useState } from 'react';


export default function Home() {
  const [messages, setMessages] = useState([
    {
      "role": "assistant",
      "content": "Hi! I'm the rate my Professor support assistant. How can I help you today?"
    }
  ])
  return (
    <>

    </>
  );
}
