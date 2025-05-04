import React, { useState } from "react";

const validWords = ["game", "gate", "mate", "make", "mask", "task", "bask", "back", "pack", "puck", "luck", "lick", "like"];

function isOneLetterOff(word1, word2) {
  if (word1.length !== 4 || word2.length !== 4) return false;
  let diff = 0;
  for (let i = 0; i < 4; i++) {
    if (word1[i] !== word2[i]) diff++;
  }
  return diff === 1;
}

function getBotMove(currentWord, usedWords) {
  return validWords.find(
    (word) => !usedWords.includes(word) && isOneLetterOff(currentWord, word)
  );
}

export default function OneLetterOffGame() {
  const [currentWord, setCurrentWord] = useState("game");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(["game"]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    const newWord = input.toLowerCase();

    if (!/^[a-z]{4}$/.test(newWord)) {
      setMessage("Enter a valid 4-letter word.");
    } else if (!validWords.includes(newWord)) {
      setMessage("Not a valid word.");
    } else if (!isOneLetterOff(currentWord, newWord)) {
      setMessage("Word must differ by only one letter.");
    } else if (history.includes(newWord)) {
      setMessage("Word already used.");
    } else {
      const updatedHistory = [...history, newWord];
      setScore(score + 1);
      setCurrentWord(newWord);
      setHistory(updatedHistory);
      setMessage("Great move! Bot is thinking...");
      setInput("");
      setIsPlayerTurn(false);

      setTimeout(() => {
        const botWord = getBotMove(newWord, updatedHistory);
        if (botWord) {
          setMessage(`Bot played: ${botWord}`);
          setCurrentWord(botWord);
          setHistory([...updatedHistory, botWord]);
          setScore((s) => s + 1);
          setIsPlayerTurn(true);
        } else {
          setMessage("Bot gave up. You win!");
        }
      }, 1000);
    }
    setInput("");
  }

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">One Letter Off: Bot Mode</h1>
      <p className="text-xl mb-2">Current Word: <strong>{currentWord}</strong></p>
      {isPlayerTurn ? (
        <form onSubmit={handleSubmit} className="mb-2">
          <input
            type="text"
            value={input}
            maxLength={4}
            onChange={(e) => setInput(e.target.value)}
            className="border px-2 py-1 mr-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
            Submit
          </button>
        </form>
      ) : (
        <p className="italic text-gray-500">Bot's turn...</p>
      )}
      <p className="mb-2 text-sm text-gray-700">{message}</p>
      <p className="text-lg">Score: {score}</p>
      <div className="mt-4 text-left">
        <h2 className="font-semibold">History:</h2>
        <ul className="list-disc pl-5">
          {history.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}