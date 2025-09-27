require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Простий "словник" для різних мов
const translations = {
  de: {
    welcome: 'Willkommen bei Julie & Aron 🌸',
    order: '🛒 Bestellen für 63 €',
    payment: '💳 Zahlungsbedingungen',
    shipping: '📦 Lieferbedingungen',
    questions: '❓ Fragen'
  },
  en: {
    welcome: 'Welcome to Julie & Aron 🌸',
    order: '🛒 Order for €63',
    payment: '💳 Payment terms',
    shipping: '📦 Shipping terms',
    questions: '❓ Questions'
  },
  ru: {
    welcome: 'Добро пожаловать в Julie & Aron 🌸',
    order: '🛒 Заказать за 63 €',
    payment: '💳 Условия оплаты',
    shipping: '📦 Условия доставки',
    questions: '❓ Вопросы'
  }
};

// Тимчасове сховище для мов користувачів
const userLanguage = {};

// Старт → вибір мови
bot.start((ctx) => {
  ctx.reply(
    'Здравствуйте 👋 Пожалуйста, выберите язык / Hi 👋 Please choose a language / Hallo 👋 Bitte wählen Sie eine Sprache',
    Markup.inlineKeyboard([
      [Markup.button.callback('🇩🇪 Deutsch', 'lang_de')],
      [Markup.button.callback('🇬🇧 English', 'lang_en')],
      [Markup.button.callback('🇷🇺 Русский', 'lang_ru')]
    ])
  );
});

// Обробка вибору мови
bot.action(['lang_de', 'lang_en', 'lang_ru'], (ctx) => {
  ctx.answerCbQuery();

  let lang = ctx.match[0].split('_')[1]; // de, en, ru
  userLanguage[ctx.from.id] = lang;

  ctx.reply(translations[lang].welcome,
    Markup.inlineKeyboard([
      [Markup.button.callback(translations[lang].order, 'order')],
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')]
    ])
  );
});

// Демо-обробка кнопок
bot.action(['order', 'payment', 'shipping', 'questions'], (ctx) => {
  ctx.answerCbQuery();

  const lang = userLanguage[ctx.from.id] || 'en'; // за замовчуванням англійська
  ctx.reply(`👉 [${translations[lang][ctx.match[0]]}] (ще треба розписати сценарій)`);
});

// Express-сервер для Railway
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');

app.get('/', (req, res) => res.send('Bot is running 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
