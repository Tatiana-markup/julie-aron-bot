require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Команда /start
bot.start((ctx) => {
  ctx.reply('Привіт 👋 Це бот Julie & Aron, я вже на Railway!');
});

const app = express();

// Telegram присилає JSON — обов’язково!
app.use(express.json());

// ✅ Правильний webhook endpoint
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res).catch(err => {
    console.error('Update error:', err);
    res.status(500).send('Error');
  });
});

// Тестовий маршрут (щоб перевіряти браузером)
app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

// Слухаємо порт
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
