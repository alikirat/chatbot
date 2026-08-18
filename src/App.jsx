import { useState, useRef, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { LuBot, LuLogOut } from "react-icons/lu";
import { FaRegPenToSquare } from "react-icons/fa6";
import { BsWindowSidebar } from "react-icons/bs";
import {
  getChatCompletion,
  getChats,
  getChat,
  createChat,
  updateChat,
  deleteChat,
} from "./api/chat";
import AuthScreen from "./components/AuthScreen";

function App() {
  const promptInputRef = useRef(null); // ref for text input

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail("");
    setChats([]);
    setMessages([]);
    setCurrentChatId(null);
  };

  // If a request comes back unauthorized/forbidden, the token is
  // missing or expired - send the user back to the login screen.
  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      handleLogout();
      return true;
    }
    return false;
  };

  // Fetch all chats once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchChats = async () => {
      try {
        const allChats = await getChats();
        setChats(allChats);
      } catch (error) {
        if (!handleAuthError(error)) {
          console.error("Failed to fetch chats:", error);
        }
      }
    };
    fetchChats();
  }, [isAuthenticated]);

  // Focus on input once the chat UI is actually rendered
  useEffect(() => {
    if (isAuthenticated) {
      promptInputRef.current?.focus();
    }
  }, [isAuthenticated]);

  /**
   * Handle Form Submit
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessage = {
      role: "user",
      content: prompt,
    };

    const newMessages = [...messages, newMessage];

    try {
      setErrorMessage(null);
      // Get AI response. Strip Mongo-added fields (_id, timeStamp) since
      // Groq rejects unrecognized properties on message objects.
      const completion = await getChatCompletion(
        newMessages.map(({ role, content }) => ({ role, content }))
      );
      const assistantMessage = {
        role: "assistant",
        content: completion.choices[0].message.content,
      };

      const updatedMessages = [...newMessages, assistantMessage];

      if (currentChatId) {
        // Update existing chat
        await updateChat(currentChatId, [newMessage, assistantMessage]);
      } else {
        // Create new chat
        const newChat = await createChat(
          updatedMessages,
          prompt.substring(0, 30) + "..." // Use first 30 chars of prompt as title
        );
        setCurrentChatId(newChat._id);
        setChats([newChat, ...chats]);
      }

      setMessages(updatedMessages);
      setPrompt("");
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Error processing chat:", error);
        setErrorMessage(
          "Something went wrong generating a response. Please try again."
        );
      }
    }
  };

  const handleChatSelect = async (chatId) => {
    try {
      const chat = await getChat(chatId);
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Error loading chat:", error);
      }
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      setChats(chats.filter((chat) => chat._id !== chatId));
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Error deleting chat:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => {
      setIsAuthenticated(true);
      setUserEmail(localStorage.getItem("userEmail") || "");
    }} />;
  }

  return (
    <main className='flex bg-indigo-900 text-white h-screen'>
      {/* LEFT CHATS SECTION  */}
      {isSidebarOpen && (
        <section className='flex flex-col flex-1 min-w-0 border p-5 bg-neutral-800'>
          <div className='flex justify-between items-center mb-5'>
            <h1 className='text-xl font-bold text-orange-500'>Chatbot</h1>
            <FaRegPenToSquare
              size={24}
              onClick={handleNewChat}
              className='cursor-pointer hover:text-orange-500'
            />
          </div>
          {/* PREVIOUS CHATS */}
          <div className='flex-1 overflow-y-auto'>
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`group p-2 border rounded-md mb-2 cursor-pointer hover:bg-neutral-700 flex justify-between items-center
                ${currentChatId === chat._id ? "bg-neutral-700" : ""}`}
                onClick={() => handleChatSelect(chat._id)}
              >
                <span className='truncate'>{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat._id);
                  }}
                  className='text-red-500 hover:text-red-700 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 transition-opacity'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className='flex items-center justify-between mb-5 mt-auto'>
            <div className='flex items-center gap-2 min-w-0'>
              <CiUser size={32} className='border rounded-full p-1 shrink-0' />
              <span className='truncate font-bold text-orange-500'>{userEmail}</span>
            </div>
            <LuLogOut
              size={20}
              onClick={handleLogout}
              className='cursor-pointer hover:text-orange-500 shrink-0'
              title='Log out'
            />
          </div>
        </section>
      )}

      {/* RIGHT CHAT SECTION  */}
      <section className='flex flex-col flex-3 min-w-0 border bg-neutral-900'>
        <div className='flex items-center gap-3 mb-5 bg-neutral-800 p-3 w-full'>
          <BsWindowSidebar
            size={24}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className='cursor-pointer hover:text-orange-500 shrink-0'
          />
          <h2 className='flex-1 text-center text-xl font-bold'>Chat</h2>
        </div>
        <div className='flex-1 overflow-y-auto p-5'>
          {messages.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center text-neutral-500 text-center'>
              <LuBot size={40} />
              <p className='mt-3'>Start a conversation by sending a message below.</p>
            </div>
          ) : (
            messages.map((message, idx) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2 mb-4 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <LuBot size={32} className='border rounded-full p-1 shrink-0' />
                  )}
                  <div
                    className={`min-w-0 break-words rounded-2xl px-4 py-2 max-w-[75%] ${
                      isUser ? "bg-orange-600" : "bg-neutral-800"
                    }`}
                  >
                    {message.content}
                  </div>
                  {isUser && (
                    <CiUser size={32} className='border rounded-full p-1 shrink-0' />
                  )}
                </div>
              );
            })
          )}
        </div>

        {errorMessage && (
          <p className='text-red-400 text-center px-3'>{errorMessage}</p>
        )}
        <form
          onSubmit={handleSubmit}
          className='flex justify-between w-full mt-auto p-3'
        >
          <input
            ref={promptInputRef}
            type='text'
            className='border w-full p-1 rounded-lg'
            placeholder='Prompt'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <button
            type='submit'
            className='ml-2 px-4 py-2 rounded-lg bg-orange-600 font-semibold cursor-pointer hover:bg-orange-700 transition-colors'
          >
            Send
          </button>
        </form>
        <i className='text-center'>
          Chatbot can make mistakes. Check important info.
        </i>
      </section>
    </main>
  );
}

export default App;