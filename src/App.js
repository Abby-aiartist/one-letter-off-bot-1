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
  const [showInstructions, setShowInstructions] = useState(false);

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
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb", padding: "2rem" }}>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "2rem", maxWidth: "500px", margin: "0 auto", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem" }}>One Letter Off: Bot Mode</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Current Word: <strong>{currentWord}</strong></p>
        {isPlayerTurn ? (
          <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={input}
              maxLength={4}
              onChange={(e) => setInput(e.target.value)}
              style={{ border: "1px solid #ccc", padding: "0.5rem", borderRadius: "6px", marginRight: "0.5rem" }}
            />
            <button type="submit" style={{ backgroundColor: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "6px", border: "none" }}>
              Submit
            </button>
          </form>
        ) : (
          <p style={{ fontStyle: "italic", color: "#6b7280" }}>Bot's turn...</p>
        )}
        <p style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "1rem" }}>{message}</p>
        <p style={{ fontSize: "1rem" }}>Score: {score}</p>
        <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
          <h2 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>History:</h2>
          <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
            {history.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            style={{ backgroundColor: "#e5e7eb", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer" }}
          >
            {showInstructions ? "Hide" : "Show"} Instructions
          </button>
          {showInstructions && (
            <div style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#374151", backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "8px" }}>
              <p><strong>How to Play:</strong></p>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>You start with a 4-letter word.</li>
                <li>Change only <strong>one letter</strong> to make a valid new word.</li>
                <li>The bot will play its move. Then it's your turn again!</li>
                <li>No repeating words.</li>
                <li>Get stuck? The bot wins. Outplay the bot to win!</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
