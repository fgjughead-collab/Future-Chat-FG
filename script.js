// === CONFIGURAÇÕES - MUDE AQUI ===
const API_PROVIDER = "groq"; // "groq", "openrouter" ou "openai"
const API_KEY = "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"; // Cole sua chave aqui!
const MODEL = "llama-3.3-70b-versatile"; // Groq: modelo rápido e poderoso

// Endpoints compatíveis com OpenAI
const ENDPOINTS = {
  groq: "https://api.groq.com/openai/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  openai: "https://api.openai.com/v1/chat/completions"
};

const API_URL = ENDPOINTS[API_PROVIDER];

// === ELEMENTOS DO DOM ===
const messagesDiv = document.getElementById("chat-messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// === HISTÓRICO DE CONVERSA ===
let conversation = [
  {
    role: "system",
    content: `Você é Future, uma IA avançada, inteligente e útil. 
    - Responda em português do Brasil de forma natural
    - Seja direto e conciso, mas completo
    - Use emojis ocasionalmente para deixar mais interessante
    - Tenha senso de humor sutil
    - Ajude com programação, tecnologia, dúvidas gerais
    - Seja criativo e inovador nas respostas`
  }
];

// === FUNÇÕES ===

function addMessage(text, isUser = false) {
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(isUser ? "user" : "bot");
  msg.textContent = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return msg;
}

async function sendToAI() {
  // Validação
  if (!API_KEY || API_KEY.includes("YOUR")) {
    addMessage("❌ Erro: Insira sua API Key no código (script.js, linha 3) e recarregue.");
    return;
  }

  const userText = input.value.trim();
  if (!userText) return;

  // Adiciona mensagem do usuário
  addMessage(userText, true);
  input.value = "";

  // Mensagem de "pensando"
  const thinkingMsg = addMessage("⏳ Pensando...");

  try {
    // Adiciona mensagem do usuário ao histórico
    conversation.push({ role: "user", content: userText });

    // Faz requisição à API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: conversation,
        temperature: 0.7, // 0 = determinístico, 1 = criativo
        max_tokens: 2048,
        stream: true // Streaming = resposta aparecendo aos poucos
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error ${response.status}: ${error.error?.message || "Erro desconhecido"}`);
    }

    // Remove mensagem de "pensando"
    thinkingMsg.remove(); }} { catch (error) {
      addMessage(`❌ Erro: ${error.message}`);
    }
     