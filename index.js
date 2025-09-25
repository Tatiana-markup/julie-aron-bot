require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);

// команда /start
bot.start((ctx) => {
  ctx.reply(
    'Привіт 👋 Обери мову:',
    Markup.inlineKeyboard([
      [Markup.button.callback('🇩🇪 Deutsch', 'lang_de')],
      [Markup.button.callback('🇬🇧 English', 'lang_en')],
      [Markup.button.callback('🇷🇺 Russian', 'lang_ru')]
    ])
  );
});

// обробка вибору мови
bot.action('lang_de', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Du hast Deutsch gewählt 🇩🇪');
});

bot.action('lang_en', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('You have chosen English 🇬🇧');
});

bot.action('lang_ru', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Вы выбрали русский язык 🇷🇺');
});

const app = express();
app.use(bot.webhookCallback('/webhook'));

// реєструємо webhook у Telegram
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');

// тестовий маршрут
app.get('/', (req, res) => res.send('Bot is running 🚀'));

// запуск сервера
app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
