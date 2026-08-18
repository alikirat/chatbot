# Chatbot

A ChatGPT-style chat UI built with React, Tailwind CSS, and the
[Groq API](https://groq.com/) (Llama 3.3 70B). Conversations are tied to a
user account and persisted through a backend API.

![Chatbot screenshot](docs/screenshot.png)

**Live demo:** [akdev-chatbot.netlify.app](https://akdev-chatbot.netlify.app)

**Test Credentials:**
- **Demo:** `demo@test.com` / `demo1234` (or use the "Use Demo Login" button)

> 📌 **Note:** This is a portfolio/demo project. All data is for testing purposes only. Please don't enter real personal information.

## Features

- Send prompts and get AI responses (Groq `llama-3.3-70b-versatile`)
- User accounts: sign up, log in, or use the one-click demo login
- Each account has its own chats, other users can't see or touch them
- Sidebar of past conversations for the logged-in user: select, create, or delete a chat
- Chat history persisted via a backend API (create/get/update/delete)

## Tech Stack

React 19, Vite, Tailwind CSS v4, `groq-sdk`, Axios.

## Setup

This app needs two things to run: a Groq API key, and a running backend that
exposes the auth and chat-persistence routes it calls (`/api/auth`, `/api/chat`,
see [chatbot-backend](https://github.com/alikirat/chatbot-backend)).

1. Get a free API key from [console.groq.com](https://console.groq.com/).
2. Create a `.env` file in the project root:
   ```env
   VITE_GROQ_API_KEY=your-groq-key-here
   VITE_API_URL=http://localhost:3000
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

The app runs on `http://localhost:5173` by default.

## Notes

The Groq client runs directly in the browser (`dangerouslyAllowBrowser: true`),
which means the API key is exposed client-side. That's fine for local
development, but a real deployment should proxy requests through a backend
instead.
