// CONFIGURAÇÃO
const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// ELEMENTOS
const messagesDiv = document.getElementById("chat-messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// HISTÓRICO
let conversation = [
{
role:"system",
content:"Você é uma IA útil que responde em português."
}
];

// MOSTRAR MENSAGEM
function addMessage(text,user=false){

const msg=document.createElement("div");

msg.className="message "+(user?"user":"bot");

msg.textContent=text;

messagesDiv.appendChild(msg);

messagesDiv.scrollTop=messagesDiv.scrollHeight;

return msg;

}

// ENVIAR
async function sendMessage(){

const text=input.value.trim();

if(!text) return;

addMessage(text,true);

input.value="";

const thinking=addMessage("Pensando...");

try{

conversation.push({
role:"user",
content:text
});

const response=await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+API_KEY
},
body:JSON.stringify({
model:MODEL,
messages:conversation,
temperature:0.7,
max_tokens:1000
})
});

const data=await response.json();

thinking.remove();

const reply=data.choices[0].message.content;

addMessage(reply);

conversation.push({
role:"assistant",
content:reply
});

}catch(err){

thinking.remove();

addMessage("Erro: "+err.message);

}

}

// EVENTOS
sendBtn.addEventListener("click",sendMessage);

input.addEventListener("keydown",function(e){

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

sendMessage();

}

});
