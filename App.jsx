import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [answer, setAnswer] = useState('');

  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  const handleQuestion = async () => {
    const response = await fetch('http://127.0.0.1:8000/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });
    const data = await response.json();
    setAnswer(data.answer);
  };

  const handleSummarize = async () => {
    const response = await fetch('http://127.0.0.1:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setSummary(data.summary);
  };

  return (
    <div className="App">
      <h1>🧠 NLP QA + Summarization Tool</h1>

      <div className="qa-section">
        <h2>Question Answering</h2>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter context..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        ></textarea>
        <br />
        <input
          type="text"
          placeholder="Enter question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br />
        <button onClick={handleQuestion}>Get Answer</button>
        <p><strong>Answer:</strong> {answer}</p>
      </div>

      <hr />

      <div className="summarize-section">
        <h2>Text Summarization</h2>
        <textarea
          rows="6"
          cols="50"
          placeholder="Enter text to summarize..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <br />
        <button onClick={handleSummarize}>Summarize</button>
        <p><strong>Summary:</strong> {summary}</p>
      </div>
    </div>
  );
}

export default App;
