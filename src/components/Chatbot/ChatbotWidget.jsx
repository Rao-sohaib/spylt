import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  ArrowRight,
  Loader2,
  Sparkles,
  Bell,
  RefreshCw,
} from "lucide-react";
import { sendChatRequest } from "./chatService";

const STORAGE_KEY = "spylt_chat_history_v1";
const UNREAD_KEY = "spylt_chat_unread_v1";

const starterMessage = {
  id: "spylt-welcome",
  role: "assistant",
  content:
    "Hi! I'm your Spylt Milk expert. Ask me anything about our protein-enriched milk drinks, nutrition facts, flavors, health benefits, or workout recovery. I know all about our 6 delicious flavors and can help you find the perfect one! 🥛💪",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  followUp: "What would you like to know about Spylt Milk?"
};

const fallbackMessage = {
  id: "spylt-fallback",
  role: "assistant",
  content:
    "I'm having trouble reaching the assistant right now. Please try again in a few seconds.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const exampleQuestions = [
  "How much protein in Spylt?",
  "Best flavor for workouts?",
  "Calories in chocolate milk?",
  "Is Spylt good for gym?",
  "All Spylt flavors?",
  "Safe for teenagers?",
  "Nutrition facts?",
  "Gluten free?",
  "Shelf life?",
  "Vitamins in Spylt?",
];

const quickReplies = [
  { label: "Protein Info", question: "How much protein in Spylt?" },
  { label: "Calories", question: "Calories in chocolate milk?" },
  { label: "Best Flavor", question: "Which flavor tastes best?" },
  { label: "Gym Benefits", question: "Good for gym users?" },
  { label: "Sugar Content", question: "Least sugar flavor?" },
  { label: "Ingredients", question: "Spylt ingredients?" },
  { label: "Kids Safety", question: "Can kids drink Spylt?" },
  { label: "Vitamins", question: "Vitamins in Spylt?" },
];

const formatTimestamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const unread = Number(window.localStorage.getItem(UNREAD_KEY) || 0);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        setMessages([]);
      }
    }
    setUnreadCount(unread);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    window.localStorage.setItem(UNREAD_KEY, String(unreadCount));
  }, [messages, unreadCount]);

  useEffect(() => {
    if (!isOpen) return;
    setUnreadCount(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [isOpen, messages]);

  const apiHistory = useMemo(
    () => messages.map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  const sendMessage = async (text = inputValue) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: crypto?.randomUUID?.() ?? `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: formatTimestamp(),
    };

    setMessages((current) => [...current, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError("");
    setShowQuickReplies(false);

    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      const reply = await sendChatRequest(trimmed, apiHistory);
      const assistantMessage = {
        id: crypto?.randomUUID?.() ?? `assistant-${Date.now()}`,
        role: "assistant",
        content: reply.answer || reply,
        followUp: reply.followUp,
        category: reply.category,
        isFAQ: reply.isFAQ,
        timestamp: formatTimestamp(),
      };

      // Simulate typing delay for better UX
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages((current) => [...current, assistantMessage]);
        setIsLoading(false);
      }, 800 + Math.random() * 1200); // Random delay between 800-2000ms

    } catch (fetchError) {
      setIsTyping(false);
      setError("Unable to connect to the AI assistant. Try again later.");
      setMessages((current) => [...current, fallbackMessage]);
      setIsLoading(false);
    }
  };

  const handleQuickReply = (question) => {
    if (isLoading) return;
    setInputValue(question);
    sendMessage(question);
  };

  const handleFollowUp = (followUp) => {
    if (isLoading || !followUp) return;
    sendMessage(followUp);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const visibleMessages = messages.length ? messages : [starterMessage];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end gap-3 max-sm:left-4">
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex h-16 w-16 items-center justify-center rounded-[28px] bg-[#523122]/90 backdrop-blur-xl text-[#faeade] shadow-[0_20px_60px_rgba(82,49,34,0.25)] ring-1 ring-[#865720]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#523122] hover:shadow-[0_25px_80px_rgba(82,49,34,0.35)] focus:outline-none focus:ring-2 focus:ring-[#e3d3bc]/70"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#faeade]/10 to-transparent opacity-50" />
        <div className="absolute inset-0 rounded-[28px] border border-[#faeade]/20" />
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <MessageCircle className="relative h-7 w-7" />
        </motion.div>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gradient-to-r from-[#a02128] to-[#c9252d] px-1.5 text-[11px] font-bold text-[#faeade] shadow-lg"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-[380px] max-w-[calc(100vw-32px)] h-[650px] max-h-[85vh] overflow-hidden rounded-[28px] border border-[#523122]/20 bg-[#f7e9d7]/95 backdrop-blur-2xl shadow-[0_40px_120px_rgba(82,49,34,0.16)] md:w-[420px] max-sm:w-[calc(100vw-32px)] max-sm:h-[80vh] max-sm:max-h-[80vh]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#523122]/10 bg-[#523122] px-5 py-4 text-[#faeade]">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#faeade]/80">CHUG BOT</p>
                <p className="text-sm text-[#faeade]">Ask about nutrition, flavors, health & fitness</p>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#faeade] text-[#523122] transition hover:bg-[#e3d3bc] focus:outline-none focus:ring-2 focus:ring-[#e3d3bc]/60"
                aria-label="Close chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-[#523122]/10 bg-[#f7e9d7] px-5 py-4">
              <div className="mb-3 text-sm font-semibold text-[#523122]">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <motion.button
                    key={reply.label}
                    type="button"
                    onClick={() => handleQuickReply(reply.question)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full border border-[#523122]/20 bg-[#ffffff] px-3 py-2 text-xs font-semibold text-[#523122] transition hover:border-[#865720] hover:bg-[#f5e2c3] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reply.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col bg-[#f7e9d7] min-h-0 overflow-hidden">
              <div
                ref={scrollRef}
                className="chat-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
              >
                {visibleMessages.map((message, index) => (
                  <motion.div
                    key={message.id ?? `${message.role}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-[0_10px_30px_rgba(82,49,34,0.08)] ${
                        message.role === "user"
                          ? "bg-[#523122] text-[#faeade] rounded-br-[6px]"
                          : "bg-[#ffffff] text-[#523122] rounded-bl-[6px]"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.followUp && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => handleFollowUp(message.followUp)}
                        disabled={isLoading}
                        className="ml-2 rounded-full border border-[#523122]/20 bg-[#f5e2c3] px-3 py-1 text-xs text-[#523122] transition hover:border-[#865720] hover:bg-[#e3d3bc] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {message.followUp}
                      </motion.button>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-[#523122]/70">
                      <span>{message.role === "user" ? "You" : "Chug Bot"}</span>
                      <span>•</span>
                      <span>{message.timestamp}</span>
                      {message.category && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{message.category}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="inline-flex items-center gap-3 rounded-[24px] bg-[#ffffff] px-4 py-3 text-[#523122] shadow-[0_10px_30px_rgba(82,49,34,0.08)]">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                          className="h-2 w-2 rounded-full bg-[#523122]/60"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-[#523122]/60"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-[#523122]/60"
                        />
                      </div>
                      <span className="text-sm">Chug Bot is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="border-t border-[#523122]/10 bg-[#faf0de] px-4 py-4">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-3"
                >
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Ask about Spylt nutrition, flavors, health benefits..."
                    className="min-h-[44px] w-full resize-none rounded-[20px] border border-[#523122]/15 bg-[#fff7ef] px-4 py-3 text-sm text-[#523122] outline-none transition focus:border-[#865720] focus:ring-2 focus:ring-[#e3d3bc]/40"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="inline-flex h-12 min-w-[3rem] items-center justify-center rounded-[20px] bg-[#523122] px-4 text-sm font-semibold text-[#faeade] transition hover:bg-[#6b3f28] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#523122]/80">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[#523122]">Nutrition · Flavors · Health · Fitness</span>
                  <span className="hidden sm:inline">·</span>
                  <Bell className="h-4 w-4" />
                  <span>Messages are saved locally.</span>
                  <RefreshCw className="h-4 w-4" />
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setError("");
                      setInputValue("");
                      setUnreadCount(0);
                      window.localStorage.removeItem(STORAGE_KEY);
                      window.localStorage.removeItem(UNREAD_KEY);
                    }}
                    className="text-[#523122] underline-offset-2 transition hover:text-[#865720]"
                  >
                    Reset chat
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-[#a02128]">{error}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;
