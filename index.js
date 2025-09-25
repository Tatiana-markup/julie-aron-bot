require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Привіт 👋 Це бот Julie & Aron, тепер я живу на Railway 🚂');
});

const app = express();

// це дуже важливо! middleware має відповідати
app.use(express.json());

// підключаємо webhook
app.use(bot.webhookCallback('/webhook'));

// реєструємо webhook у Telegram
bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);

// тестовий маршрут для перевірки
app.get('/', (req, res) => {
  res.send('✅ Bot is running');
});

// Railway слухає порт
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
