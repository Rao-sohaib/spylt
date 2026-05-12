import Fuse from "fuse.js";
import faqDatabase from "./faqs.js";

const KNOWN_FLAVORS = [
  "max chocolate",
  "chocolate",
  "vanilla cream",
  "vanilla",
  "strawberry cream",
  "strawberry",
  "cookies & cream",
  "cookies and cream",
  "peanut butter chocolate",
  "peanut butter",
];

const TOPIC_PATTERNS = {
  protein: /protein|protien|muscle|recovery/i,
  calories: /calories|calorie|cal/i,
  sugar: /sugar|sweet|low sugar|sugar free/i,
  ingredients: /ingredient|ingredients|clean label|preservative/i,
  vitamins: /vitamin|vitamin d|b12|calcium|minerals/i,
  workout: /gym|workout|exercise|recovery|training/i,
  kids: /kid|children|teen|teenager/i,
  lactose: /lactose/i,
  gluten: /gluten/i,
  caffeine: /caffeine/i,
};

const synonymMap = {
  protien: "protein",
  choc: "chocolate",
  choclate: "chocolate",
  choclate: "chocolate",
  sugary: "sugar",
  sweets: "sugar",
  carb: "carbs",
  carbs: "carbs",
  cal: "calories",
  cals: "calories",
  vit: "vitamin",
  kids: "children",
  teen: "teenager",
  milkshake: "milk",
  gym: "workout",
  gymn: "workout",
};

const fuse = new Fuse(faqDatabase, {
  includeScore: true,
  keys: [
    { name: "question", weight: 0.5 },
    { name: "aliases", weight: 0.35 },
    { name: "tags", weight: 0.25 },
    { name: "answer", weight: 0.1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  useExtendedSearch: true,
});

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9&\s]+/g, " ")
    .split(" ")
    .map((word) => synonymMap[word] || word)
    .filter(Boolean)
    .join(" ");
}

function findFavoriteFlavor(text) {
  const normalized = normalizeText(text);
  return KNOWN_FLAVORS.find((flavor) => normalized.includes(flavor));
}

function findTopicFromText(text) {
  const result = Object.keys(TOPIC_PATTERNS).find((key) => TOPIC_PATTERNS[key].test(text));
  return result || "";
}

function extractContext(history) {
  const userMessages = Array.isArray(history) ? history.filter((item) => item.sender === "user") : [];
  const combined = userMessages.map((item) => item.text).join(" ");
  return {
    lastFlavor: findFavoriteFlavor(combined),
    lastTopic: findTopicFromText(combined),
  };
}

function createContextualQuery(message, context) {
  let query = normalizeText(message);
  if (!query.includes("spylt") && context.lastFlavor) {
    query = `${query} ${context.lastFlavor}`.trim();
  }
  if (!query.includes(context.lastTopic) && context.lastTopic) {
    query = `${query} ${context.lastTopic}`.trim();
  }
  return query;
}

function getFaqMatch(message, context = {}) {
  const query = createContextualQuery(message, context);
  const results = fuse.search(query);

  if (!results.length) {
    return { found: false, score: 1, item: null };
  }

  const best = results[0];
  const isStrong = best.score <= 0.28;
  const containsExact = faqDatabase.some((faq) => {
    const normalized = normalizeText(faq.question + " " + faq.aliases.join(" "));
    return normalized.includes(normalizeText(message));
  });

  if (isStrong || containsExact) {
    return { found: true, score: best.score, item: best.item, strong: true };
  }

  if (best.score <= 0.40) {
    return { found: true, score: best.score, item: best.item, strong: false };
  }

  return { found: false, score: best.score, item: best.item };
}

function buildFollowUpSuggestions(topic = "") {
  const core = [
    "Want nutrition facts too?",
    "Need flavor recommendations?",
    "Want calorie details?",
    "Need workout milk suggestions?",
  ];

  if (topic === "protein") {
    return ["Want the best high-protein flavor?", "Need workout recovery tips?"];
  }
  if (topic === "calories") {
    return ["Want the lowest-calorie Spylt option?", "Need macros for your favorite flavor?"];
  }
  return core;
}

export { extractContext, getFaqMatch, buildFollowUpSuggestions, normalizeText };
