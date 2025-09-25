require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Команда /start
bot.start((ctx) => ctx.reply('Привіт 👋 Це бот Julie & Aron, тепер точно працюю 🚀'));

const app = express();
app.use(express.json()); // важливо!

// Webhook endpoint
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res)
    .catch(err => {
      console.error('Update error:', err);
      res.sendStatus(500);
    });
});

// Тестовий GET
app.get('/', (req, res) => res.send('Bot is running ✅'));

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
