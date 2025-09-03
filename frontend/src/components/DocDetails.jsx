import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserDataContext } from "../Context/UserContext";

export default function DocDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [user, setUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { userData, setUserData, serverUrl } = useContext(UserDataContext);

  // Fetch doc by ID
  const fetchDoc = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/docs/getDoc/${id}`, //  make sure backend route matches
        { withCredentials: true }
      );
      setDoc(res.data.doc);
    } catch (err) {
      console.error("Error fetching doc:", err);
    }
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/auth/CurrentUser`,
        { withCredentials: true }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  useEffect(() => {
    fetchDoc();
    fetchCurrentUser();
  }, [id]);

  // Open edit modal
  const openEditModal = () => {
    if (!doc) return;
    setEditForm({ title: doc.title || "", content: doc.content || "" });
    setIsModalOpen(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await axios.put(
        `${serverUrl}/api/docs/editDoc/${id}`, //  check backend
        { title: editForm.title, content: editForm.content },
        { withCredentials: true }
      );

      // If backend sends updated doc → update state
      if (res.data.doc) {
        setDoc(res.data.doc);
      } else {
        // Otherwise refetch
        await fetchDoc();
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating doc:", err.response?.data || err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this doc?")) return;
    try {
      const result = await axios.delete(
        `${serverUrl}/api/docs/deleteDoc/${id}`,
        {
          withCredentials: true,
        }
      );

      navigate(-1); // go back to previous page
    } catch (err) {
      console.error("Error deleting doc:", err.message);
    }
  };

  if (!doc) return <p className="text-center text-gray-500">Loading...</p>;
    console.log("Current User:", user);
  const canEditOrDelete =
    user && (user.role.includes("admin") || user._id.toString() === doc.createdBy.toString());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-3xl border-4 border-transparent bg-gradient-to-r from-pink-500 to-indigo-500 opacity-20 blur-lg pointer-events-none"></div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 drop-shadow-md">
          {doc.title}
        </h1>

        {/* Content */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {doc.content}
        </p>

        {/* Summary */}
        {doc.summary && (
          <div className="bg-gray-100 rounded-xl p-4 shadow-inner mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📝 Summary
            </h3>
            <p className="text-gray-600">{doc.summary}</p>
          </div>
        )}

        {/* Tags */}
        {doc.tags?.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {doc.tags.map((tag, i) => (
              <span
                key={i}
                className={`px-4 py-1 rounded-full text-sm font-semibold shadow-md text-white
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
        )}

        {/* Edit/Delete buttons */}
        {canEditOrDelete && (
          <div className="flex gap-4">
            <button
              onClick={openEditModal}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:scale-105 transform transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow-lg hover:scale-105 transform transition"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-purple-100 via-white to-pink-100 p-8 rounded-3xl shadow-2xl w-96 relative border border-white/40 animate-fadeIn">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center drop-shadow-md">
              ✏️ Edit Document
            </h2>

            {/* Title Input */}
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleChange}
              placeholder="Enter document title"
              className="w-full mb-4 px-4 py-2 border-2 border-purple-300 rounded-xl 
                 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none
                 bg-white/70 backdrop-blur-sm text-gray-800 shadow-inner"
            />

            {/* Content Input */}
            <textarea
              name="content"
              value={editForm.content}
              onChange={handleChange}
              placeholder="Enter document content"
              className="w-full mb-4 px-4 py-2 border-2 border-pink-300 rounded-xl 
                 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none
                 bg-white/70 backdrop-blur-sm text-gray-800 shadow-inner"
              rows="5"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 text-gray-800 font-semibold shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-5 py-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white 
                   rounded-xl shadow-lg hover:scale-105 transform transition disabled:opacity-50 font-bold"
              >
                {isUpdating ? "⏳ Updating..." : "✅ Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
