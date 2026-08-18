import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return res.data; // { token, email }
}

export async function register(email, password) {
  const res = await axios.post(`${API_URL}/api/auth/register`, { email, password });
  return res.data; // { _id, email }
}
