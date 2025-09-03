import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
const [actionLoading, setActionLoading] = useState({ id: null, type: null });
  const { userData, setUserData, serverUrl } = useContext(UserDataContext);
  const navigate = useNavigate();

  // 🔑 Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // 📄 Fetch all docs
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/docs/allDocs`, {
          withCredentials: true,
        });
        setDocs(res.data.docs || []);
        setFilteredDocs(res.data.docs || []);
      } catch (err) {
        console.error("Error fetching docs", err);
      }
    };
    fetchDocs();
  }, []);

  // 🔍 Filter docs on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDocs(docs);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          doc.content.toLowerCase().includes(q) ||
          (doc.summary && doc.summary.toLowerCase().includes(q))
      );
      setFilteredDocs(filtered);
    }
  }, [searchQuery, docs]);

  // 🆕 Create new doc
  const handleCreateDoc = async () => {
    if (!newDoc.title.trim() || !newDoc.content.trim()) {
      alert("Please provide both title and content");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/docs/addDoc`, newDoc, {
        withCredentials: true,
      });
      setDocs([res.data.doc, ...docs]);
      setFilteredDocs([res.data.doc, ...docs]);
      setNewDoc({ title: "", content: "" });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating doc:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

// Regenerate Summary
const handleRegenerateSummary = async (id) => {
  setActionLoading({ id, type: "summary" });
  try {
    const res = await axios.put(`${serverUrl}/api/docs/regenerateSummary/${id}`, {}, { withCredentials: true });
    setDocs((prev) =>
      prev.map((d) => (d._id === id ? { ...d, summary: res.data.summary } : d))
    );
    setFilteredDocs((prev) =>
      prev.map((d) => (d._id === id ? { ...d, summary: res.data.summary } : d))
    );
  } catch (err) {
    console.error("Error regenerating summary", err);
  } finally {
    setActionLoading({ id: null, type: null });
  }
};

// Regenerate Tags
const handleRegenerateTags = async (id) => {
  setActionLoading({ id, type: "tags" });
  try {
    const res = await axios.put(`${serverUrl}/api/docs/regenerateTags/${id}`, {}, { withCredentials: true });
    setDocs((prev) =>
      prev.map((d) => (d._id === id ? { ...d, tags: res.data.tags } : d))
    );
    setFilteredDocs((prev) =>
      prev.map((d) => (d._id === id ? { ...d, tags: res.data.tags } : d))
    );
  } catch (err) {
    console.error("Error regenerating tags", err);
  } finally {
    setActionLoading({ id: null, type: null });
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-10 px-6">
      {/* 🚀 Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-6 py-3 text-lg font-bold text-white 
                   rounded-full bg-gradient-to-r from-red-500 via-pink-600 to-purple-700 
                   shadow-2xl hover:scale-125 transform transition-all duration-500 
                   animate-pulse overflow-hidden"
      >
        <span className="relative z-10">🚪 Logout</span>
        <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-red-400 to-orange-500 opacity-30 blur-xl animate-ping"></span>
      </button>

      {/* Header + Search + Create */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-6 animate-pulse">
          📄 All Documents
        </h1>

        {/* Search Bar */}
        <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/30 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="🔍 Search by title, content, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 bg-transparent outline-none text-white placeholder-white/70 text-lg"
          />
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:scale-105 transform transition"
          >
            ✖
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-6 flex-wrap">
          <button
            onClick={() => navigate("/semantic-search")}
            className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white rounded-full shadow-xl hover:scale-110 transform transition-all duration-300 animate-bounce"
          >
            🔮 Try Semantic Search
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white rounded-full shadow-xl hover:scale-110 transform transition-all duration-300"
          >
            ➕ Create Doc
          </button>

          <button
            onClick={() => navigate("/qa")}
            className="relative px-8 py-3 text-lg font-extrabold text-white rounded-full 
               bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 
               shadow-2xl hover:scale-125 transform transition-all duration-500 
               animate-pulse overflow-hidden"
          >
            <span className="relative z-10">❓ Q/A with Gemini</span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-orange-500 opacity-30 blur-xl animate-ping"></span>
          </button>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc._id}
            onClick={() => navigate(`/docs/${doc._id}`)}
            className="cursor-pointer bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:scale-105 hover:shadow-2xl transition transform duration-300 border border-white/40"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
              {doc.title}
            </h2>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {doc.content}
            </p>

            {doc.summary && (
              <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg p-2 mb-3 text-sm text-gray-700 shadow-inner line-clamp-2">
                ✨ {doc.summary}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
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

            {/*  New Buttons */}
            {/* New Buttons */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerateSummary(doc._id);
                }}
                disabled={
                  actionLoading.id === doc._id &&
                  actionLoading.type === "summary"
                }
                className="flex-1 px-3 py-2 text-sm font-bold text-white rounded-lg 
      bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 
      shadow-md hover:scale-105 transform transition disabled:opacity-50"
              >
                {actionLoading.id === doc._id &&
                actionLoading.type === "summary"
                  ? "⏳ Summarizing..."
                  : "📝 Summarize"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerateTags(doc._id);
                }}
                disabled={
                  actionLoading.id === doc._id && actionLoading.type === "tags"
                }
                className="flex-1 px-3 py-2 text-sm font-bold text-white rounded-lg 
      bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 
      shadow-md hover:scale-105 transform transition disabled:opacity-50"
              >
                {actionLoading.id === doc._id && actionLoading.type === "tags"
                  ? "⏳ Tagging..."
                  : "🏷 Generate Tags"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 📝 Create Doc Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-purple-100 via-white to-pink-100 p-8 rounded-3xl shadow-2xl w-96 relative border border-white/40 animate-fadeIn">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center drop-shadow-md">
              📝 Create New Document
            </h2>

            <input
              type="text"
              placeholder="Enter title"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full mb-4 px-4 py-2 border-2 border-purple-300 rounded-xl 
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none
                   bg-white/70 backdrop-blur-sm text-gray-800 shadow-inner"
            />

            <textarea
              placeholder="Enter content"
              value={newDoc.content}
              onChange={(e) =>
                setNewDoc({ ...newDoc, content: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border-2 border-pink-300 rounded-xl 
                   focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none
                   bg-white/70 backdrop-blur-sm text-gray-800 shadow-inner"
              rows="5"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 text-gray-800 font-semibold shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDoc}
                disabled={loading}
                className="px-5 py-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white 
                     rounded-xl shadow-lg hover:scale-105 transform transition disabled:opacity-50 font-bold"
              >
                {loading ? "⏳ Creating..." : "✅ Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
