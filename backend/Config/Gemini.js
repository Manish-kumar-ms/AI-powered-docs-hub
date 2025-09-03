// services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI response for free-text prompts
export async function generateResponse(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const response = await model.generateContent(prompt);
  return response.response.text(); // plain text
}

// Generate embeddings
export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values; // array of numbers
}

// Generate summary
export async function generateSummary(text) {
  const prompt = `Summarize this document in 3-5 sentences:\n\n${text}`;
  return await generateResponse(prompt);
}

// Generate tags
export async function generateTags(text) {
  const prompt = `Extract 3 to 5 meaningful tags (keywords) for this document. 
  Return them as a comma-separated list:\n\n${text}`;
  const raw = await generateResponse(prompt);
  return raw.split(",").map(tag => tag.trim().toLowerCase());
}
