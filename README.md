# 📘 AI-Powered Document Hub  

A **full-stack MERN + AI application** that empowers teams to:  
- Create and manage documents with **AI-generated summaries and tags**.  
- Perform **semantic search** across all docs using embeddings.  
- Ask **Q/A with Gemini AI** powered by stored documents.  
- Securely authenticate with **JWT + cookies**.  
- Edit/Delete docs (with role-based access control).  
- Enjoy a **crazy-cool, responsive UI** with Tailwind CSS.  

---

## 🌐 Live Demo

- **Frontend**: [https://ai-powered-docs-hub-frontend.onrender.com](https://ai-powered-docs-hub-frontend.onrender.com)  
- **Backend**: [https://ai-powered-docs-hub-backend.onrender.com](https://ai-powered-docs-hub-backend.onrender.com)

---

## 🚀 Features  

### 🔹 Authentication & User Management  
- Signup/Login with **Email + OTP** or Google.  
- **JWT authentication** stored in HTTP-only cookies.  
- Role-based access (**Admin / User**).  

### 🔹 Document Management  
- Create, view, edit, and delete documents.  
- Each doc shows: **title, summary, tags, and author**.  
- **AI actions per doc:**  
  - ✨ *Regenerate Summary with Gemini*  
  - 🏷 *Regenerate Tags with Gemini*  

### 🔹 Semantic Search  
- Search across all docs by **meaning**, not just keywords.  
- Embeddings + cosine similarity for ranking.  
- Smooth loading animations and modern UI.  

### 🔹 Team Q/A  
- Ask a question → Gemini answers from top-ranked docs.  
- Shows context & sources for transparency.  
 

### 🔹 Responsive Crazy UI  
- Tailwind-powered gradients, blur effects, and animations.  
- Works across **desktop, tablet, and mobile**.  

---

## 🛠️ Tech Stack  

**Frontend:**  
- ⚛️ React.js (Vite)  
- 📡 Axios  
- 🌐 React Router  
- 🎨 Tailwind CSS + Animations  

**Backend:**  
- 🟢 Node.js + Express.js  
- 🍃 MongoDB + Mongoose  
- 🤖 Gemini API (AI Summarization, Tags, Q/A)  
- 🔑 JWT Authentication  

---

## 📦 Installation  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/your-username/ai-docs-hub.git
cd ai-docs-hub
```

### 2️⃣ Install dependencies  

#### Backend  
```bash
cd backend
npm install
```

#### Frontend  
```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables  

Create a `.env` file inside the **backend** folder:  

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## ▶️ Running the App  

### Start the backend  
```bash
cd backend
npm start
```

### Start the frontend  
```bash
cd frontend
npm run dev
```

---

## 🔗 API Endpoints  

### **Auth Routes**  
- `POST /api/auth/signup` → Signup with email  
- `POST /api/auth/login` → Login with OTP  
- `GET /api/auth/currentUser` → Get logged-in user  
- `POST /api/auth/logout` → Logout  

### **Docs Routes**  
- `POST /api/docs/addDoc` → Add doc (auto summary + tags)  
- `GET /api/docs/allDocs` → Get all docs  
- `GET /api/docs/getDoc/:id` → Get single doc  
- `PUT /api/docs/editDoc/:id` → Edit doc  
- `DELETE /api/docs/deleteDoc/:id` → Delete doc  
- `PUT /api/docs/regenerateSummary/:id` → Regenerate summary  
- `PUT /api/docs/regenerateTags/:id` → Regenerate tags  

### **AI Routes**  
- `POST /api/docs/semanticSearch` → Semantic search docs  
- `POST /api/docs/teamQA` → Ask Q/A from stored docs  

---

## ✅ Tasks Completed  

✔ JWT + Cookies Authentication  
✔ Create / Edit / Delete Docs  
✔ Auto Summary + Tags (Gemini)  
✔ Semantic Search  
✔ Team Q/A with Gemini   
✔ Crazy Tailwind UI  


