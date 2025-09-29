require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 477219279; // твій Telegram ID
const CHANNEL_ID = '@Julii_und_Aron';

// --- Хранилище заказов и стока ---
let orders = [];
let stock = 20;

// --- Переводы ---
const translations = {
  de: {
    welcome: `
💎 *Deine Chance auf einen Duft, den man nie vergisst*

Statt *600 €* — nur *63 €* für ein Set aus drei luxuriösen Düften:

✨ *Red Crystal* (wie Baccarat Rouge 540)  
🌸 *Rive Droite* (wie Fleur Narcotic)  
🔥 *Nossi* (exklusives Parfum)  

Im Set: *150 ml + 15 ml Proben*.  
🔐 Nur *20 Sets* — Exklusivität, die im Nu verschwindet.
    `,
    order: '🛒 Bestellen für 63 €'
  },
  en: {
    welcome: `
💎 *Your chance to own an unforgettable fragrance*

Instead of *€600* — only *€63* for a set of three luxurious scents:

✨ *Red Crystal* (like Baccarat Rouge 540)  
🌸 *Rive Droite* (like Fleur Narcotic)  
🔥 *Nossi* (exclusive creation)  

Includes *150 ml + 15 ml testers*.  
🔐 Only *20 sets* — exclusivity that disappears before your eyes.
    `,
    order: '🛒 Order for €63'
  },
  ru: {
    welcome: `
💎 *Твой шанс на аромат, который невозможно забыть*

Вместо *600 €* — всего *63 €* за набор из трёх роскошных ароматов:

✨ *Red Crystal* (как Baccarat Rouge 540)  
🌸 *Rive Droite* (как Fleur Narcotic)  
🔥 *Nossi* (авторский эксклюзив)  

В комплекте: *150 мл + 15 мл пробников*.  
🔐 Всего *20 наборов* — эксклюзивность, исчезающая на глазах.
    `,
    order: '🛒 Заказать за 63 €'
  }
};

// --- Языки пользователей ---
const userLanguage = {};
const userOrders = {};

// --- Команда старт ---
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

// --- Выбор языка ---
bot.action(['lang_de', 'lang_en', 'lang_ru'], (ctx) => {
  ctx.answerCbQuery();
  let lang = ctx.match[0].split('_')[1];
  userLanguage[ctx.from.id] = lang;

  ctx.reply(translations[lang].welcome, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback(translations[lang].order, 'order')]
    ])
  });
});

// --- Обработка заказа (тест, без формы для краткости) ---
bot.action('order', (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  const newOrder = {
    id: orders.length + 1,
    userId: ctx.from.id,
    lang,
    status: 'NEW',
    name: ctx.from.first_name || 'Unknown',
    price: 63
  };
  orders.push(newOrder);

  ctx.reply('✅ Ваш заказ принят. Пожалуйста, ожидайте подтверждения оплаты.');
  bot.telegram.sendMessage(
    ADMIN_ID,
    `📦 Новый заказ #${newOrder.id}\n👤 ${newOrder.name}\nЦена: €${newOrder.price}\nСтатус: ${newOrder.status}`
  );
});

// --- Админ меню ---
bot.command('admin', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply('📋 Админ-меню', Markup.inlineKeyboard([
    [Markup.button.callback('📦 Все заказы', 'admin_all')],
    [Markup.button.callback('🟢 Оплаченные', 'admin_paid')],
    [Markup.button.callback('🚚 Отправленные', 'admin_shipped')],
    [Markup.button.callback('🔄 Установить остаток', 'admin_stock')],
    [Markup.button.callback('📤 Разослать трек', 'admin_track')]
  ]));
});

// --- Списки заказов ---
function formatOrders(list) {
  if (!list.length) return '❌ Заказов нет';
  return list.map(o => `#${o.id} | ${o.name} | €${o.price} | ${o.status}`).join('\n');
}

bot.action('admin_all', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply(formatOrders(orders));
});
bot.action('admin_paid', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply(formatOrders(orders.filter(o => o.status === 'PAID')));
});
bot.action('admin_shipped', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply(formatOrders(orders.filter(o => o.status === 'SHIPPED')));
});

// --- Установка остатка ---
bot.action('admin_stock', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply(`Сейчас в наличии: ${stock}\nВведи новое число (командой /setstock 15)`);
});
bot.command('setstock', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  const parts = ctx.message.text.split(' ');
  if (parts.length < 2) return ctx.reply('⚠️ Используй: /setstock 15');
  stock = parseInt(parts[1]);
  ctx.reply(`✅ Остаток обновлён: ${stock}`);
});

// --- Рассылка треков ---
bot.action('admin_track', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply('Введи команду в формате:\n/track orderId trackingNumber');
});
bot.command('track', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  const parts = ctx.message.text.split(' ');
  if (parts.length < 3) return ctx.reply('⚠️ Используй: /track 1 AA123456789DE');
  const orderId = parseInt(parts[1]);
  const tracking = parts[2];

  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.reply('❌ Заказ не найден');

  order.status = 'SHIPPED';
  order.tracking = tracking;

  // сообщение клиенту
  let msg;
  if (order.lang === 'de') msg = `📦 Ihre Bestellung wurde versendet.\nTracking-Nummer: ${tracking}`;
  else if (order.lang === 'ru') msg = `📦 Ваш заказ был отправлен.\nТрек-номер: ${tracking}`;
  else msg = `📦 Your order has been shipped.\nTracking number: ${tracking}`;

  bot.telegram.sendMessage(order.userId, msg);
  ctx.reply(`✅ Трек ${tracking} отправлен пользователю #${order.userId}`);
});

// --- Express для Railway ---
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');

app.get('/', (req, res) => res.send('Bot is running 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
