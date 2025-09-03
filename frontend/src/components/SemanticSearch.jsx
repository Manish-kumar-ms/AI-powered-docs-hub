import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";
import { useContext } from "react";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
      const { userData, setUserData, serverUrl } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSemanticSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await axios.post(
        `${serverUrl}/api/docs/semanticSearch`,
        { query },
        { withCredentials: true }
      );
      setResults(res.data.docs || []);
    } catch (err) {
      console.error("Semantic search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-6 animate-pulse">
          🔮 Semantic Search
        </h1>

        {/* Input + Button */}
        <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/30 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="✨ Ask me anything... (AI-powered search)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-4 py-2 bg-transparent outline-none text-white placeholder-white/70 text-lg"
          />
          <button
            onClick={handleSemanticSearch}
            className="px-6 py-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-110 transform transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <span className="ml-4 text-white text-xl font-bold animate-pulse">
            Searching magically...
          </span>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/docs/${doc._id}`)}
              className="cursor-pointer bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:scale-105 hover:shadow-2xl transition transform duration-300 border border-white/40"
            >
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                {doc.title}
              </h2>

              {/* Content preview */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {doc.content}
              </p>

              {/* Summary */}
              {doc.summary && (
                <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg p-2 mb-3 text-sm text-gray-700 shadow-inner line-clamp-2">
                  ✨ {doc.summary}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm text-white
                      ${
                        [
                          "bg-gradient-to-r from-pink-500 to-red-500",
                          "bg-gradient-to-r from-purple-500 to-indigo-500",
                          "bg-gradient-to-r from-green-400 to-emerald-500",
                          "bg-gradient-to-r from-orange-400 to-yellow-500",
                          "bg-gradient-to-r from-blue-400 to-cyan-500",
                        ][i % 5]
                      }
                    `}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && query && (
        <p className="text-center text-white text-lg font-medium mt-12">
           No documents found for "<span className="font-bold">{query}</span>"
        </p>
      )}
    </div>
  );
}
