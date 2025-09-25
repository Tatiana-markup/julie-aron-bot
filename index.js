require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);

// команда /start
bot.start((ctx) => {
  ctx.reply('Привіт 👋 Це бот Julie & Aron, я вже на Railway!');
});

const app = express();

// middleware для парсингу json (Telegram надсилає JSON)
app.use(express.json());

// webhook маршрут
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// тестовий маршрут
app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

// слухаємо порт
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
