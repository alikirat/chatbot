# Chatbot

A ChatGPT-style chat UI built with React, Tailwind CSS, and the
[Groq API](https://groq.com/) (Llama 3.3 70B). Conversations are listed in a
sidebar and persisted through a backend API.

## Features

- Send prompts and get streamed-in AI responses (Groq `llama-3.3-70b-versatile`)
- Sidebar of past conversations — select, create, or delete a chat
- Chat history persisted via a backend API (create/get/update/delete)

## Tech Stack

React 19, Vite, Tailwind CSS v4, `groq-sdk`, Axios.

## Setup

This app needs two things to run: a Groq API key, and a running backend that
exposes the chat-persistence routes it calls (`/api/chat`).

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
which means the API key is exposed client-side — fine for local development,
but a real deployment should proxy requests through a backend instead.
