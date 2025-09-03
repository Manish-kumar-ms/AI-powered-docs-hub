import {
  generateEmbedding,
  generateResponse,
  generateSummary,
  generateTags,
} from "../Config/Gemini.js";
import DocModel from "../Models/DocModel.js";
import UserModel from "../Models/UserModel.js";

export const addDoc = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const createdBy = req.user._id;

    /// now we send  title and content to gemini api for summary and tags
    const text = `{title: ${title}, content: ${content}}`;
    const summary = await generateSummary(text);
    const tags = await generateTags(text);

    const textForEmbedding = `
           Title: ${title}
           Content: ${content}
           Summary: ${summary}
           Tags: ${tags.join(", ")}
           createdBy: ${createdBy}
    `;

    const embedding = await generateEmbedding(textForEmbedding);

    const newDoc = new DocModel({
      title,
      content,
      summary,
      tags,
      embedding,
      createdBy,
    });

    await newDoc.save();
    res.status(201).json({ message: "Document added successfully",doc: newDoc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while adding document" });
  }
};

export const editDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const user = await UserModel.findById(req.user._id);

    const doc = await DocModel.findById(id);

    if (
       !user.role.includes("admin") &&
      user._id.toString() !== doc.createdBy.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this document" });
    }

    if (title) doc.title = title;
    if (content) doc.content = content;
    await doc.save();

    /// now we send  title and content to gemini api for summary and tags
    const text = `{title: ${doc.title}, content: ${doc.content}}`;
    const summary = await generateSummary(text);
    const tags = await generateTags(text);

    doc.summary = summary;
    doc.tags = tags;
    await doc.save();

    const textForEmbedding = `
           Title: ${doc.title}
           Content: ${doc.content}
           Summary: ${doc.summary}
           Tags: ${doc.tags.join(", ")}
           createdBy: ${doc.createdBy}
    `;

    const embedding = await generateEmbedding(textForEmbedding);

    doc.embedding = embedding;
    await doc.save();

    res
      .status(200)
      .json({ message: "Document updated successfully",  doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while updating document" });
  }
};

export const deleteDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(req.user._id);
    const doc = await DocModel.findById(id);

    if (!user.role.includes("admin") && user._id.toString() !== doc.createdBy.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this document" });
    }

    await DocModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while deleting document" });
  }
};

// searching documents

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const embeddingArray = await generateEmbedding(query);

    // 2. Fetch all docs from DB (each already has its embedding stored)
    const docs = await DocModel.find();

    // 3. Compare query embedding with each doc's embedding
    const results = docs.map((doc) => {
      const score = cosineSimilarity(embeddingArray, doc.embedding);
      console.log(`Similarity score for doc ${doc.title}: ${score}`);
      return {
        _id: doc._id,
        title: doc.title,
        summary: doc.summary,
        tags: doc.tags,
        createdBy: doc.createdBy,
        similarity: score,
      };
    });

    // 4. Sort by similarity (highest first)
    results.sort((a, b) => b.similarity - a.similarity);

    // 5. Return top N results (say 5)
   return res
      .status(200)
      .json({ message: "Search results", docs: results.slice(0, 5) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while searching documents",
      error,
    });
  }
};

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB);
}

export const teamQA = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    let topDocs = [];

    //  Try exact title match (case-insensitive)
    const exactDoc = await DocModel.findOne({
      title: { $regex: `^${question}$`, $options: "i" }  // ^ and $ → exact match
    });

    if (exactDoc) {
      console.log("Exact title match found:", exactDoc.title);
      topDocs = [exactDoc.toObject()];
    } else {
      //  Semantic search if no exact match

      const queryEmbedding = await generateEmbedding(question);
      const docs = await DocModel.find().populate("createdBy", "name");


      const ranked = docs.map(doc => {
        const score = cosineSimilarity(queryEmbedding, doc.embedding);
        return { ...doc.toObject(), score };
      }).sort((a, b) => b.score - a.score);

      // take top 3 docs
      topDocs = ranked.slice(0, 3);
    }

    // 3️⃣ Build context for Gemini
    const context = topDocs.map(d =>
           `Title: ${d.title}
         Summary: ${d.summary}
         Content: ${d.content}
         Score: ${d.score}
         Tags: ${d.tags.join(", ")}
         Created By: ${d.createdBy?.name || "Unknown"}`
         ).join("\n\n");



    const prompt = `
      You are a helpful assistant for team documents.
      Use only the following docs as context when answering and 80% answer based on the context whose score is highest.
      please not use / in your answer only give the answer like in chatbot you response
      in a way so that user get the right not the unnecessary  things.
      Context:
      ${context}

      Question: ${question}
      Answer in a clear and concise way:
    `;

    // 4️⃣ Get answer from Gemini
    const answer = await generateResponse(prompt);

    // 5️⃣ Send response back
    res.json({
      success: true,
      message: "Answer generated",
      answer,
      sources: topDocs.map(d => ({
        title: d.title, 
        score: d.score
      }))
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in Q&A", error: err.message });
  }
};


export const getAllDocs = async (req, res) => {
  try {
    const docs = await DocModel.find();
   return res.status(200).json({ success: true, message: "All documents fetched", docs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching documents", error: error.message });
  }
}

export const getDocById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocModel.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.status(200).json({ success: true, message: "Document fetched", doc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching document", error: error.message });
  }
};


// Regenerate Summary
export const regenerateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocModel.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

 /// now we send  title and content to gemini api for summary
    const text = `{title: ${doc.title}, content: ${doc.content}}`;
    const summary = await generateSummary(text);

    doc.summary = summary;
    await doc.save();

    res.json({ success: true, message: "Summary regenerated successfully", summary });
  } catch (err) {
    res.status(500).json({ message: "Error regenerating summary", error: err.message });
  }
};

// Regenerate Tags
export const regenerateTags = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocModel.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

 /// now we send  title and content to gemini api for summary and tags
    const text = `{title: ${doc.title}, content: ${doc.content}}`;
   
    const tags = await generateTags(text);
    doc.tags = tags;
    await doc.save();

    res.json({ success: true,message:"Tags regenerated successfully", tags });
  } catch (err) {
    res.status(500).json({ message: "Error regenerating tags", error: err.message });
  }
};
