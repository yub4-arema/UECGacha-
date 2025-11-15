'use client'
import { useState } from "react"

import TalkAi from "@/functions/talk"
export default function () {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("") ;
  return (
    <>
    <input
      type="text"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
    />
    <button
      onClick={async () => {
        const res = await TalkAi(question);
        if (res.text){
        setResponse(res.text);
        }
      }}
    >Ask AI</button>
    <div>{response}</div>
    </>
    );
}
