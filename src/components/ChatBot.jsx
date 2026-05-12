import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bolt, MessageSquare, Moon, Send, Sparkles, Sun, X } from "lucide-react";

const QUICK_CHIPS = [
  "Protein Info",
  "Calories",
  "Best Flavor",
  "Gym Benefits",
  "Ingredients",
  "Sugar Content",
  "Kids Safety",
  "Vitamins",
];

const FLAVORS = [
  "max chocolate",
  "chocolate",
  "vanilla",
  "strawberry",
  "cookies & cream",
  "peanut butter chocolate",
];

const TOPIC_PATTERNS = {
  protein: /protein|protien|muscle|recovery/i,
  calories: /calories|calorie|cal|kcal/i,
  sugar: /sugar|sweet|low sugar|sugar free|sweetness/i,
  ingredients: /ingredient|ingredients|label|preservative|flavor/i,
  vitamins: /vitamin|b12|d|calcium|mineral/i,
  workout: /gym|workout|exercise|training|recovery/i,
  kids: /kid|children|teen|teenager/i,
  lactose: /lactose/i,
};

const INITIAL_MESSAGES = [
  {
    id: "bot-1",
    sender: "bot",
    text: "Hello! I'm your premium Spylt Milk assistant. Ask me anything about milk, Spylt flavors, nutrition, ingredients, protein, or workout recovery.",
    timestamp: new Date().toISOString(),
  },
];

const STORAGE_KEYS = {
  messages: "spylt-chat-history",
  theme: "spylt-chat-theme",
  analytics: "spylt-chat-analytics",
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9&\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSessionContext(text, previous) {
  const lower = normalizeText(text);
  const flavor = FLAVORS.find((item) => lower.includes(item)) || previous.lastFlavor;
  const topic = Object.keys(TOPIC_PATTERNS).find((key) => TOPIC_PATTERNS[key].test(text)) || previous.lastTopic;
  return { lastFlavor: flavor, lastTopic: topic };
}

function categorizeQuery(text) {
  const normalized = normalizeText(text);
  if (/protein|protien|muscle|recovery/.test(normalized)) return "protein";
  if (/calories|calorie|cal|kcal/.test(normalized)) return "calories";
  if (/sugar|sweet|low sugar/.test(normalized)) return "sugar";
  if (/ingredient|label|preservative|flavor/.test(normalized)) return "ingredients";
  if (/vitamin|b12|d|calcium|mineral/.test(normalized)) return "vitamins";
  if (/workout|gym|exercise|training/.test(normalized)) return "workout";
  if (/kid|children|teenager/.test(normalized)) return "kids";
  return "milk";
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [context, setContext] = useState({ lastFlavor: "", lastTopic: "" });
  const [analytics, setAnalytics] = useState({ total: 0, categories: {} });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    const storedMessages = window.localStorage.getItem(STORAGE_KEYS.messages);
    const storedAnalytics = window.localStorage.getItem(STORAGE_KEYS.analytics);

    if (storedTheme) setTheme(storedTheme);
    if (storedMessages) setMessages(JSON.parse(storedMessages));
    if (storedAnalytics) setAnalytics(JSON.parse(storedAnalytics));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(analytics));
  }, [analytics]);

  const themeStyles = useMemo(
    () => ({
      panel: theme === "dark" ? "bg-[#1c1711]/95 border-[#4f412f]/80 text-[#f7e7d3]" : "bg-white/95 border-[#e8d1b5]/80 text-[#46321f]",
      surface: theme === "dark" ? "bg-[#2d241b]" : "bg-[#f8e2c8]",
      input: theme === "dark" ? "bg-[#2f261e] border-[#5d4f42] placeholder-[#bfa985] text-[#f7e5d2]" : "bg-[#fff8f0] border-[#d8c0a0] placeholder-[#8b7358] text-[#3f2d1f]",
    }),
    [theme]
  );

  const updateAnalytics = useCallback((message) => {
    const category = categorizeQuery(message);
    setAnalytics((prev) => ({
      total: prev.total + 1,
      categories: { ...prev.categories, [category]: (prev.categories[category] || 0) + 1 },
    }));
  }, []);

  const handleSendMessage = useCallback(
    async (messageText) => {
      const trimmed = messageText.trim();
      if (!trimmed || isLoading) return;

      const userMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: trimmed,
        timestamp: new Date().toISOString(),
      };

      const nextContext = extractSessionContext(trimmed, context);
      setContext(nextContext);
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setStatusNote("");
      setIsLoading(true);
      updateAnalytics(trimmed);

      try {
        const history = [...messages, userMessage].slice(-8).map((item) => ({ sender: item.sender, text: item.text }));
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history, context: nextContext }),
        });

        const data = await response.json();
        const answer = data?.answer?.trim() || "I only answer questions related to milk and Spylt products.";
        const botMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: answer,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setStatusNote(data?.source === "faq" ? "Instant FAQ answer" : data?.source === "faq-fallback" ? "Local fallback active" : "AI powered response");
      } catch (error) {
        console.error(error);
        const botMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "AI responses are temporarily limited. Showing instant FAQ answers instead.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setStatusNote("Offline fallback engaged");
      } finally {
        setIsLoading(false);
      }
    },
    [context, isLoading, messages, updateAnalytics]
  );

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();
      handleSendMessage(inputValue);
    },
    [handleSendMessage, inputValue]
  );

  const handleQuickReply = useCallback(
    (label) => {
      if (isLoading) return;
      const query = label === "Best Flavor" ? "Which Spylt flavor tastes best?" : label;
      handleSendMessage(query);
    },
    [handleSendMessage, isLoading]
  );

  const handleInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage(inputValue);
      }
    },
    [handleSendMessage, inputValue]
  );

  return (
    <div className={`fixed z-[9999] ${isOpen ? "bottom-6 right-6" : "bottom-6 right-6"} max-sm:left-4 max-sm:right-4 max-sm:right-auto`}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className={`flex flex-col w-[380px] max-w-[calc(100vw-32px)] h-[680px] max-h-[85vh] rounded-[32px] shadow-[0_40px_120px_rgba(83,51,34,0.24)] border ${themeStyles.panel} overflow-hidden backdrop-blur-xl`}
          >
            <div className={`flex items-center justify-between px-5 py-4 ${themeStyles.surface}`}>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8c6c4e]">Spylt AI Assistant</p>
                <h3 className="mt-2 text-xl font-semibold leading-tight">Milk & recovery expert</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,247,238,0.55),_transparent_45%)]">
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/90 to-transparent" />
              <div className="flex h-full flex-col px-4 pt-4 pb-2">
                <div className="mb-4 rounded-[28px] border border-[#e6d5bf] bg-[#fff7ec] px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3 text-[#5c4226]">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[#f3dcc2] text-[#9b6f41]"><Sparkles size={18} /></span>
                    <div>
                      <p className="text-sm font-semibold">Quick suggestions</p>
                      <p className="mt-1 text-xs opacity-80">Tap a chip to ask faster.</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleQuickReply(chip)}
                        className="rounded-2xl border border-[#d8b68c] bg-[#fff3df] px-3 py-2 text-xs font-medium text-[#5f4128] transition hover:border-[#a26833] hover:bg-[#fbe6c3]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-2">
                  {messages.map((message) => (
                    <motion.div
                      layout
                      key={message.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-3xl border p-4 text-sm leading-6 shadow-sm ${
                          message.sender === "user"
                            ? "rounded-br-[4px] bg-gradient-to-r from-[#8b5a2b] to-[#5f3f23] text-white border-transparent"
                            : "rounded-bl-[4px] bg-white text-[#3f2d1f] border border-[#e6d0b1]"
                        }`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="mb-3 flex justify-start">
                      <div className="inline-flex items-center gap-2 rounded-3xl border border-[#e0c6a2] bg-white px-4 py-3 text-sm text-[#5a3f2a] shadow-sm">
                        <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#a26833]" />
                        <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#a26833] delay-75" />
                        <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#a26833] delay-150" />
                        Typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            <div className={`border-t ${theme === "dark" ? "border-[#4a3d31]" : "border-[#e2c7a7]"} bg-transparent px-4 py-4 pb-[calc(env(safe-area-inset-bottom,16px)+16px)]`}>
              <div className="mb-3 flex items-center justify-between gap-3 text-xs tracking-[0.18em] text-[#7d6447]">
                <span>{statusNote || "Premium milk assistant ready."}</span>
                <span className="inline-flex items-center gap-1 text-[#8d6d52]"><Bolt size={14} /> Fast</span>
              </div>
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  rows={1}
                  placeholder="Ask your milk or Spylt question…"
                  className={`flex-1 min-h-[52px] resize-none rounded-full border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a26833]/30 ${themeStyles.input}`}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#a26833] to-[#523122] text-white shadow-lg transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#523122] to-[#a26833] text-white shadow-[0_25px_60px_rgba(82,49,34,0.25)]"
            aria-label="Open chat"
          >
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
