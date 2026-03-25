const TelegramBot = require('node-telegram-bot-api');
const Groq = require('groq-sdk');
const http = require('http');

// ✅ Environment variables
const token = process.env.TELEGRAM_TOKEN;
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 check if keys exist
if (!token || !process.env.GROQ_API_KEY) {
  console.error("Missing API keys!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Ask me anything 🤖");
});

// Message
bot.on('message', async (msg) => {
  const text = msg.text;

  if (!text || text === "/start") return;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "llama3-8b-8192",
    });

    const reply = response.choices[0].message.content;

    bot.sendMessage(msg.chat.id, reply);

  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error 😢");
  }
});

// Render fix
http.createServer((req, res) => {
  res.end("Bot running 🚀");
}).listen(process.env.PORT || 3000);