require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// --- Переклади ---
const { translations, formTranslations } = require('./translations');

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
const userIds = new Set();

// --- Хелпери ---
const getLang = (userId) => userLanguage[userId] || 'en';
const lastOrderFor = (userId) => {
  const list = orders.filter(o => o.userId === userId);
  if (!list.length) return null;
  return list.sort((a, b) => Number(b.id) - Number(a.id))[0];
};

async function isSubscribed(ctx) {
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
    return ['member', 'administrator', 'creator'].includes(member?.status);
  } catch {
    return false;
  }
}

// --- Middleware ---
bot.use((ctx, next) => {
  if (ctx.from?.id) userIds.add(ctx.from.id);
  return next();
});

// --- START ---
bot.start(async (ctx) => {
  if (ctx.from?.id === ADMIN_ID) {
    return ctx.reply(
      '👩‍💻 Панель администратора',
      Markup.keyboard([
        ['📦 Список заказов', '📊 Остаток товара'],
        ['✏️ Изменить количество товара', '🚚 Отправить трек-номер'],
        ['📢 Рассылка']
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
  const lang = ctx.callbackQuery.data.split('_')[1] || 'en';
  userLanguage[ctx.from.id] = lang;

  return ctx.editMessageText(translations[lang].welcome, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback(translations[lang].order, 'order')],
      [Markup.button.callback(translations[lang].fragrances, 'fragrances')],
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')],
    ]),
  });
});

// --- Про аромати ---
bot.action('fragrances', async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();
  return ctx.editMessageText(formTranslations[lang].chooseAroma, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback('✨ Red Crystal', 'aroma_red'),
        Markup.button.callback('🌸 Rive Droite', 'aroma_rive'),
      ],
      [Markup.button.callback('🔥 Nossi', 'aroma_nossi')],
      [Markup.button.callback(formTranslations[lang].back, 'back_to_menu')],
    ]),
  });
});

// --- Обробка кнопок ароматів ---
bot.action(['aroma_red', 'aroma_rive', 'aroma_nossi'], async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();
  let text = '';
  if (ctx.callbackQuery.data === 'aroma_red') text = formTranslations[lang].aromaRed;
  if (ctx.callbackQuery.data === 'aroma_rive') text = formTranslations[lang].aromaRive;
  if (ctx.callbackQuery.data === 'aroma_nossi') text = formTranslations[lang].aromaNossi;

  return ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback('✨ Red Crystal', 'aroma_red'),
        Markup.button.callback('🌸 Rive Droite', 'aroma_rive'),
      ],
      [Markup.button.callback('🔥 Nossi', 'aroma_nossi')],
      [Markup.button.callback(formTranslations[lang].back, 'back_to_menu')],
    ]),
  });
});

// --- Условия оплаты ---
bot.action('payment', async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();
  return ctx.editMessageText(formTranslations[lang].paymentInfo, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([[Markup.button.callback(formTranslations[lang].back, 'back_to_menu')]]),
  });
});

// --- Условия доставки ---
bot.action('shipping', async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();
  return ctx.editMessageText(formTranslations[lang].shippingInfo, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([[Markup.button.callback(formTranslations[lang].back, 'back_to_menu')]]),
  });
});

// --- Вопросы ---
bot.action('questions', async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();
  return ctx.editMessageText(formTranslations[lang].questionsInfo, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([[Markup.button.callback(formTranslations[lang].back, 'back_to_menu')]]),
  });
});

// --- Кнопка «Назад» ---
bot.action('back_to_menu', async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();
  return ctx.editMessageText(translations[lang].welcome, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback(translations[lang].order, 'order')],
      [Markup.button.callback(translations[lang].fragrances, 'fragrances')],
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')],
    ]),
  });
});

// --- Кнопка «Купити за 63 €» ---
bot.action('order', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getLang(ctx.from.id);
  try {
    const subscribed = await isSubscribed(ctx);
    if (subscribed) {
      userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
      return ctx.reply(formTranslations[lang].askName);
    } else {
      return ctx.reply(
        formTranslations[lang].subscribe || '🔔 Підпишіться, щоб отримати знижку!',
        Markup.inlineKeyboard([
          [Markup.button.url(formTranslations[lang].subscribeBtn || 'Підписатись', `https://t.me/${CHANNEL_ID.replace('@', '')}`)],
          [Markup.button.callback(formTranslations[lang].checkSub || '✅ Я підписався', 'check_sub')],
          [Markup.button.callback(formTranslations[lang].buyNoSub || '💸 Купити без знижки (70€)', 'order_no_sub')],
        ])
      );
    }
  } catch (err) {
    console.error('Error in order:', err);
    return ctx.reply('⚠️ Помилка при старті замовлення. Спробуйте ще раз.');
  }
});
