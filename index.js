require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 477219279;
const CHANNEL_ID = '@Julii_und_Aron';

// --- Залишок наборів ---
let stock = 20;

// --- Тимчасові сховища ---
const userLanguage = {};
const userOrders = {};
let orders = [];
const adminState = {};

// --- Тексти ---
const translations = {
  de: { order: '🛒 Bestellen für 63 €' },
  en: { order: '🛒 Order for €63' },
  ru: { order: '🛒 Заказать за 63 €' }
};

const formTranslations = {
  de: {
    subscribe: '👉 Abonniere den Kanal, um 10% Rabatt zu erhalten und das Set für 63 € zu bekommen',
    subscribeBtn: '🔔 Abonnieren',
    checkSub: '✅ Ich habe abonniert',
    notSubscribed: '❌ Sie haben den Kanal noch nicht abonniert. Bitte zuerst abonnieren 👆',
    buyNoSub: '💳 Ohne Abo für 70 € kaufen',
    askName: 'Bitte geben Sie Ihren vollständigen Namen ein (Vorname + Nachname):',
    askAddress: 'Bitte geben Sie Ihre Lieferadresse ein (Land, Stadt, PLZ, Straße/Haus/Wohnung):',
    askEmail: 'Bitte geben Sie Ihre E-Mail-Adresse ein:',
    askPhone: 'Bitte geben Sie Ihre Telefonnummer im internationalen Format ein (+49...):',
    askPayment: 'Wählen Sie die Zahlungsmethode:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-Überweisung',
    successPayment: '✅ Zahlung erhalten.\nIhre Bestellung wird morgen versendet.\nDie Sendungsnummer erhalten Sie in diesem Chat.',
    confirmSent: "✅ Danke! Ihre Bestätigung wurde an den Administrator gesendet.",
    noActiveOrder: "⚠️ Sie haben keine aktive Bestellung. Bitte zuerst bestellen.",
    sepa: (price) => `
👤 Empfänger: Iuliia Troshina
🏦 IBAN: DE77 7505 0000 0027 9627 45
🔑 BIC: BYLADEM1RBG
💶 Betrag: ${price} €
📌 Verwendungszweck: Julii & Aron Bestellung ${price}`
  },
  en: {
    subscribe: '👉 Subscribe to the channel to get 10% off and grab the set for €63',
    subscribeBtn: '🔔 Subscribe',
    checkSub: '✅ I subscribed',
    notSubscribed: '❌ You are not subscribed yet. Please subscribe first 👆',
    buyNoSub: '💳 Buy without subscription for €70',
    askName: 'Please enter your full name (First + Last):',
    askAddress: 'Please enter your delivery address (Country, City, Zip, Street/House/Apartment):',
    askEmail: 'Please enter your email:',
    askPhone: 'Please enter your phone number in international format (+44...):',
    askPayment: 'Choose payment method:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA Transfer',
    successPayment: '✅ Payment received.\nYour order will be shipped tomorrow.\nThe tracking number will be sent to this chat.',
    confirmSent: "✅ Thank you! Your confirmation has been sent to the administrator.",
    noActiveOrder: "⚠️ You don’t have an active order. Please place an order first.",
    sepa: (price) => `
👤 Recipient: Iuliia Troshina
🏦 IBAN: DE77 7505 0000 0027 9627 45
🔑 BIC: BYLADEM1RBG
💶 Amount: ${price} €
📌 Purpose: Julii & Aron order ${price}`
  },
  ru: {
    subscribe: '👉 Подпишитесь на канал, чтобы получить скидку 10% и забрать набор за 63 €',
    subscribeBtn: '🔔 Подписаться',
    checkSub: '✅ Я подписался',
    notSubscribed: '❌ Вы ещё не подписаны. Пожалуйста, подпишитесь 👆',
    buyNoSub: '💳 Купить без подписки за 70 €',
    askName: 'Введите имя и фамилию:',
    askAddress: 'Введите адрес доставки (Страна, Город, Индекс, Улица/дом/кв.):',
    askEmail: 'Введите ваш email:',
    askPhone: 'Введите ваш телефон в международном формате (+7...):',
    askPayment: 'Выберите метод оплаты:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-перевод',
    successPayment: '✅ Оплата получена.\nВаш заказ будет отправлен завтра.\nТрек-номер придёт в этот чат.',
    confirmSent: "✅ Спасибо! Ваше подтверждение отправлено администратору.",
    noActiveOrder: "⚠️ У вас нет активного заказа. Пожалуйста, сначала оформите заказ.",
    sepa: (price) => `
👤 Получатель: Iuliia Troshina
🏦 IBAN: DE77 7505 0000 0027 9627 45
🔑 BIC: BYLADEM1RBG
💶 Сумма: ${price} €
📌 Назначение: Julii & Aron заказ ${price}`
  }
};

// --- Старт ---
bot.start((ctx) => {
  if (ctx.from.id === ADMIN_ID) {
    return ctx.reply("👩‍💻 Админ-панель", Markup.keyboard([
      ["📦 Список заказов", "✏️ Изменить количество товара"],
      ["🚚 Отправить трек-номер"]
    ]).resize());
  }

  ctx.reply(
    'Здравствуйте 👋 Пожалуйста, выберите язык / Hi 👋 Please choose a language / Hallo 👋 Bitte wählen Sie eine Sprache',
    Markup.inlineKeyboard([
      [Markup.button.callback('🇩🇪 Deutsch', 'lang_de')],
      [Markup.button.callback('🇬🇧 English', 'lang_en')],
      [Markup.button.callback('🇷🇺 Русский', 'lang_ru')]
    ])
  );
});

// --- Фото підтвердження ---
bot.on("photo", async (ctx) => {
  const order = orders.find(o => o.userId === ctx.from.id);
  const lang = userLanguage[ctx.from.id] || "en";

  if (!order) return ctx.reply(formTranslations[lang].noActiveOrder);

  const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  await ctx.telegram.sendPhoto(
    ADMIN_ID,
    photo,
    { caption: `📷 Подтверждение оплаты\n🆔 Order: ${order.id}\n👤 ${order.data.name}` }
  );
  ctx.reply(formTranslations[lang].confirmSent);
});

// --- Адмін панель ---
bot.hears("📦 Список заказов", (ctx) => {
  if (orders.length === 0) return ctx.reply("ℹ️ Заказов нет");
  let list = orders.map(o => `🆔 ${o.id} | ${o.data.name} | ${o.data.price}€`).join("\n");
  ctx.reply(`📋 Заказы:\n${list}\n\nОстаток: ${stock}`);
});

bot.hears("✏️ Изменить количество товара", (ctx) => {
  ctx.reply("Введите новое количество наборов:");
  adminState[ctx.from.id] = "update_stock";
});

bot.hears("🚚 Отправить трек-номер", (ctx) => {
  ctx.reply("Введите ID заказа:");
  adminState[ctx.from.id] = "enter_orderId";
});

bot.on("text", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  const state = adminState[ctx.from.id];

  if (state === "update_stock") {
    const newStock = parseInt(ctx.message.text);
    if (!isNaN(newStock) && newStock >= 0) {
      stock = newStock;
      ctx.reply(`✅ Количество наборов обновлено: ${stock}`);
    } else {
      ctx.reply("❌ Введите число");
    }
    adminState[ctx.from.id] = null;
  }

  if (state === "enter_orderId") {
    const orderId = ctx.message.text;
    ctx.reply("Введите трек-номер:");
    adminState[ctx.from.id] = { step: "enter_tracking", orderId };
  }

  if (state?.step === "enter_tracking") {
    const trackNumber = ctx.message.text;
    const order = orders.find(o => o.id === state.orderId);
    if (order) {
      bot.telegram.sendMessage(order.userId, `📦 Ваш заказ отправлен!\nТрек-номер: ${trackNumber}`);
      ctx.reply(`✅ Трек-номер отправлен (${order.id})`);
    } else {
      ctx.reply("❌ Заказ не найден");
    }
    adminState[ctx.from.id] = null;
  }
});

// --- Express ---
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');
app.get('/', (req, res) => res.send('Bot is running 🚀'));
app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
