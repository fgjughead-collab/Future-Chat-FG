// === CONFIGURAÇÕES ===
const API_PROVIDER = "groq";
const API_KEY = "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";
const MODEL = "llama-3.3-70b-versatile";

const ENDPOINTS = {
  groq: "https://api.groq.com/openai/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  openai: "https://api.openai.com/v1/chat/completions"
};

const API_URL = ENDPOINTS[API_PROVIDER];

// === ELEMENTOS ===
const messagesDiv = document.getElementById("chat-messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// === HISTÓRICO ===
let conversation = [
  {
    role: "system",
    content: "Você é Future, uma IA inteligente que responde em português de forma clara."
  }
];

// === MOSTRAR MENSAGEM ===
function addMessage(text, isUser = false) {
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(isUser ? "user" : "bot");
  msg.textContent = text;

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  return msg;
}

// === ENVIAR PARA IA ===
async function sendToAI() {

  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, true);
  input.value = "";

  const thinkingMsg = addMessage("⏳ Pensando...");

  try {

    conversation.push({
      role: "user",
      content: userText
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error("Erro na API");
    }

    const data = await response.json();

    thinkingMsg.remove();

    const aiText = data.choices[0].message.content;

    addMessage(aiText);

    conversation.push({
      role: "assistant",
      content: aiText
    });

  } catch (error) {

    thinkingMsg.remove();
    addMessage("❌ Erro: " + error.message);

  }
}

// === EVENTOS ===
sendBtn.addEventListener("click", sendToAI);

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendToAI();
  }
});
