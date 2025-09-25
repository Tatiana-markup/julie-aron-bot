require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Обов’язково!
app.use(express.json());

// Команда /start
bot.start((ctx) => {
  ctx.reply('Привіт 👋 Це бот Julie & Aron, я працюю через Railway!');
});

// Обробка webhook
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res)
    .then(() => {
      if (!res.headersSent) res.sendStatus(200);
    })
    .catch(err => {
      console.error('Помилка обробки апдейту:', err);
      if (!res.headersSent) res.sendStatus(500);
    });
});

// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('Bot is alive 🚀');
});

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
