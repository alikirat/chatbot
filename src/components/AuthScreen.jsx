import { useState } from "react";
import { login, register } from "../api/auth";

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const completeLogin = async (loginEmail, loginPassword) => {
    const data = await login(loginEmail, loginPassword);
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.email);
    onAuthenticated();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await register(email, password);
      }
      await completeLogin(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await completeLogin("demo@test.com", "demo1234");
    } catch (err) {
      setError("Could not log in to the demo account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex items-center justify-center bg-indigo-900 text-white h-screen p-5'>
      <div className='w-full max-w-sm bg-neutral-800 rounded-2xl p-8'>
        <h1 className='text-2xl font-bold text-orange-500 text-center mb-6'>Chatbot</h1>

        <div className='bg-neutral-900 border border-dashed border-orange-500 rounded-lg p-4 mb-6 text-center'>
          <p className='text-xs font-bold tracking-wide text-orange-400 mb-1'>LIVE DEMO</p>
          <p className='text-sm text-neutral-300 mb-3'>
            This is a portfolio demo. Conversations are tied to your account and not shared with other visitors.
          </p>
          <button
            type='button'
            onClick={handleDemoLogin}
            disabled={loading}
            className='w-full bg-orange-600 hover:bg-orange-700 rounded-lg py-2 font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Use Demo Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='border border-neutral-600 bg-neutral-900 rounded-lg p-2'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='border border-neutral-600 bg-neutral-900 rounded-lg p-2'
          />

          {error && <p className='text-red-400 text-sm text-center'>{error}</p>}

          <button
            type='submit'
            disabled={loading}
            className='bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className='text-center text-sm text-neutral-400 mt-4'>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type='button'
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className='text-orange-500 hover:underline cursor-pointer'
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </main>
  );
}

export default AuthScreen;
