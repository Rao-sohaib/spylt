const CHAT_API_ROUTE = import.meta.env.VITE_CHAT_API_URL || "/chat";
const FALLBACK_REPLY = "I only answer questions related to milk and Spylt products.";

export async function sendChatRequest(question, history = []) {
  const response = await fetch(CHAT_API_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    answer: data.answer?.trim() || FALLBACK_REPLY,
    followUp: data.followUp,
    category: data.category,
    isFAQ: data.isFAQ
  };
}
