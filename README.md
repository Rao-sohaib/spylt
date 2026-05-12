# ⚡ GSAP with React

This project demonstrates how to integrate **GSAP (GreenSock Animation Platform)** with **React** to create smooth, high-performance animations.

## 🚀 What is GSAP?

**GSAP** is a powerful JavaScript animation library used for building highly performant and visually appealing animations. It works with DOM elements, CSS properties, SVG, Canvas, and more.

> GSAP is widely used in web development for interactive UIs and complex motion graphics.

---

## ⚛️ Why Use GSAP with React? 

While React excels at managing UI state and structure, it doesn’t handle complex animations well on its own. GSAP bridges that gap by giving you fine-grained control over animations.

**Benefits:**
- GPU-accelerated, buttery smooth animations
- Sequencing and timelines with `gsap.timeline()`
- Advanced easing
- SVG support
- Scroll-based animations (with plugins like `ScrollTrigger`)

---

## 📦 Installation

```bash
npm install gsap @gsap/react
```

## 🥛 Spylt AI Chatbot

This project now includes a Milk & Spylt chatbot backed by a local FAQ engine with Hugging Face free API fallback.

### Setup

1. Copy `.env.example` to `.env`.
2. Add your Hugging Face API token:

```bash
HUGGINGFACE_API_TOKEN=your_huggingface_api_token_here
```

### Development

```bash
npm run dev
```

This starts both the Vite frontend and the Express backend together.

### API Route

The chat API is available at `http://localhost:5000/api/chat` and is proxied through Vite at `/api/chat`.

### Notes

- The chatbot only answers milk, dairy, nutrition, protein drinks, and Spylt-related questions.
- Any unrelated or unsafe questions return: `I only answer questions related to milk and Spylt products.`
- The system uses a local FAQ database first and falls back to Hugging Face only when needed.
