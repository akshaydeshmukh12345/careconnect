import { useState } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const AIWellness = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to use CareConnect AI.");
      }

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/ai/ask`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: trimmedMessage,
    }),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI request failed"
        );
      }

      const aiMessage: Message = {
        role: "ai",
        text: data.reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (error) {
      console.error("AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            error instanceof Error
              ? error.message
              : "Unable to connect to the AI assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-col">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
            🤖
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            CareConnect AI
          </h1>

          <p className="mt-2 text-slate-500">
            Your AI wellness assistant
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <strong>Important:</strong> CareConnect AI
          provides general wellness information and
          is not a substitute for professional medical
          advice, diagnosis, or treatment.
        </div>

        {/* Chat */}
        <div className="flex min-h-[500px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">

            {messages.length === 0 && (
              <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

                <div className="mb-4 text-5xl">
                  🌿
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  How can I help you today?
                </h2>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Ask about general wellness, healthy
                  habits, nutrition, exercise, sleep,
                  or other health-related topics.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  <button
                    onClick={() =>
                      setMessage(
                        "Give me some healthy lifestyle tips."
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    💚 Healthy lifestyle tips
                  </button>

                  <button
                    onClick={() =>
                      setMessage(
                        "How can I improve my sleep?"
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    😴 Improve my sleep
                  </button>

                  <button
                    onClick={() =>
                      setMessage(
                        "Give me some beginner exercise tips."
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    🏃 Exercise tips
                  </button>

                  <button
                    onClick={() =>
                      setMessage(
                        "What are some healthy eating habits?"
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    🥗 Healthy eating
                  </button>

                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-5 py-3 text-sm leading-6 ${
                    item.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-5 py-3 text-sm text-slate-500">
                  CareConnect AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-4">

            <div className="flex gap-3">

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask CareConnect AI..."
                rows={2}
                disabled={loading}
                className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <button
                onClick={handleSend}
                disabled={
                  loading ||
                  !message.trim()
                }
                className="self-end rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Press Enter to send · Shift + Enter
              for a new line
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AIWellness;