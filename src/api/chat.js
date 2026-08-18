import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get an AI completion, proxied through the backend so the Groq API key
// never has to reach the browser
export async function getChatCompletion(messages) {
  const res = await axios.post(
    `${API_URL}/api/chat/completion`,
    { messages },
    { headers: authHeaders() }
  );
  return res.data;
}

// Create a new chat
export async function createChat(messages, title) {
  const res = await axios.post(
    `${API_URL}/api/chat`,
    { messages, title },
    { headers: authHeaders() }
  );
  return res.data;
}

// Get all chats
export async function getChats() {
  const res = await axios.get(`${API_URL}/api/chat/`, { headers: authHeaders() });
  return res.data;
}

// Get a specific chat
export async function getChat(chatId) {
  const res = await axios.get(`${API_URL}/api/chat/${chatId}`, { headers: authHeaders() });
  return res.data;
}

// Update a chat
export async function updateChat(chatId, messages, title) {
  const res = await axios.patch(
    `${API_URL}/api/chat/${chatId}`,
    { messages, title },
    { headers: authHeaders() }
  );
  return res.data;
}

// Delete a chat
export async function deleteChat(chatId) {
  await axios.delete(`${API_URL}/api/chat/${chatId}`, { headers: authHeaders() });
}
