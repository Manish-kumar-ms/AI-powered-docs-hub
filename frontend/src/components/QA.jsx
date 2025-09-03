import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserDataContext } from "../Context/UserContext";

export default function QA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
    const { userData, setUserData, serverUrl } = useContext(UserDataContext);
  

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post(
        `${serverUrl}/api/docs/teamQA`,
        { question },
        { withCredentials: true } 
      );
      setAnswer(res.data.answer || "No answer found.");
    } catch (err) {
      console.error("Q/A error:", err);
      setAnswer("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-6 animate-pulse">
          ❓ Ask Gemini Anything
        </h1>
        <p className="text-lg text-white/90 mb-10">
          Type your question and Gemini will answer using your stored documents as context.
        </p>

        {/* Input + Button */}
        <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/30 mb-8">
          <input
            type="text"
            placeholder="🔍 Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-grow px-4 py-2 bg-transparent outline-none text-white placeholder-white/70 text-lg"
          />
          <button
            onClick={handleAsk}
            className="px-6 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-white rounded-full shadow-lg hover:scale-110 transform transition"
          >
            Ask
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin"></div>
            <span className="ml-4 text-white text-xl font-bold animate-pulse">
              Thinking...
            </span>
          </div>
        )}

        {/* Answer */}
        {!loading && answer && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mt-8 border border-white/40 text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 Gemini’s Answer</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
