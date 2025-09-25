require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);

// команда /start
bot.start((ctx) => {
  ctx.reply('Привіт 👋 Це бот Julie & Aron, я вже на Railway!');
});

const app = express();

// додали парсер для JSON
app.use(express.json());

// підключаємо webhook
app.use(bot.webhookCallback('/webhook'));

// реєструємо webhook у Telegram
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');

// тестовий маршрут
app.get('/', (req, res) => res.send('Bot is running 🚀'));

// запускаємо сервер
app.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port", process.env.PORT || 8080);
});
