const TelegramBot = require('node-telegram-bot-api');
const Groq = require('groq-sdk');
const http = require('http');

// ✅ Use environment variables (IMPORTANT)
const token = process.env.TELEGRAM_TOKEN;
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const bot = new TelegramBot(token, { polling: true });

// Start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Ask me anything 🤖");
});

// Message
bot.on('message', async (msg) => {
  const text = msg.text;

  if (text === "/start") return;

  try {
    const chat = await groq.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "llama3-8b-8192",
    });

    const reply = chat.choices[0].message.content;

    bot.sendMessage(msg.chat.id, reply);

  } catch (err) {
    console.log(err);
    bot.sendMessage(msg.chat.id, "Error 😢");
  }
});

// Render fix
http.createServer((req, res) => {
  res.end("Bot running 🚀");
}).listen(process.env.PORT || 3000);