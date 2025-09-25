require('dotenv').config();
const { Telegraf } = require('telegraf');

// беремо токен з .env
const bot = new Telegraf(process.env.BOT_TOKEN);

// команда /start
bot.start((ctx) => {
  ctx.reply('Привіт 👋 Це тестовий бот Julie & Aron!');
});

// запуск
bot.launch();
console.log("Бот запущений...");

