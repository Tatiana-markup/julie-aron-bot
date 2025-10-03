require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// --- Імпортуємо переклади для кожної мови окремо ---
const de = require('./translations/de');
const en = require('./translations/en');
const ru = require('./translations/ru');

// Формуємо обʼєкти перекладів
const translations = {
  de: de.translations,
  en: en.translations,
  ru: ru.translations,
};

const formTranslations = {
  de: de.formTranslations,
  en: en.formTranslations,
  ru: ru.formTranslations,
};

// --- ENV ---
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID) || 0;
const CHANNEL_ID = process.env.CHANNEL_ID || '@Julii_und_Aron';
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = Number(process.env.PORT) || 8080;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required');

const bot = new Telegraf(BOT_TOKEN);

// --- Сховища ---
let stock = 20;
const userLanguage = {};
const userOrders = {};
let orders = [];
const adminState = {};

// --- Хелпери ---
const getLang = (userId) => userLanguage[userId] || 'en';

function lastOrderFor(userId) {
  const list = orders.filter((o) => o.userId === userId);
  if (list.length === 0) return null;
  return list.sort((a, b) => Number(b.id) - Number(a.id))[0];
}

async function isSubscribed(ctx) {
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
    return ['member', 'administrator', 'creator'].includes(member?.status);
  } catch (err) {
    return false;
  }
}

// --- START ---
bot.start(async (ctx) => {
  if (ctx.from?.id === ADMIN_ID) {
    return ctx.reply(
      '👩‍💻 Панель администратора',
      Markup.keyboard([
        ['📦 Список заказов', '📊 Остаток товара'],
        ['✏️ Изменить количество товара', '🚚 Отправить трек-номер'],
      ]).resize()
    );
  }

  return ctx.reply(
    'Здравствуйте 👋 Пожалуйста, выберите язык / Hi 👋 Please choose a language / Hallo 👋 Bitte wählen Sie eine Sprache',
    Markup.inlineKeyboard([
      [Markup.button.callback('🇩🇪 Deutsch', 'lang_de')],
      [Markup.button.callback('🇬🇧 English', 'lang_en')],
      [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
    ])
  );
});

// --- Вибір мови ---
bot.action(['lang_de', 'lang_en', 'lang_ru'], async (ctx) => {
  await ctx.answerCbQuery();
  const data = ctx.callbackQuery?.data || 'lang_en';
  const lang = data.split('_')[1] || 'en';
  userLanguage[ctx.from.id] = lang;

  return ctx.editMessageText(translations[lang].welcome, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback(translations[lang].order, 'order')],
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')],
    ]),
  });
});

// --- решта логіки (замовлення, оплати, адмін-панель, підтвердження тощо) ---
// Код лишається такий самий, тільки замість дефолтних перекладів використовуємо
// translations[lang] та formTranslations[lang]
