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
  de: {
    welcome: `
💎 *Deine Chance auf einen Duft, den man nie vergisst*

Statt *600 €* — nur *63 €* für ein Set aus drei luxuriösen Düften:

✨ *Red Crystal* (wie Baccarat Rouge 540) — die Energie der Begierde in jeder Note.  
🌸 *Rive Droite* (wie Fleur Narcotic) — Eleganz und Leichtigkeit für jeden Tag.  
🔥 *Nossi* (exklusives Parfum) — ein Duft, der beeindruckt.  

Im Set: *150 ml + 15 ml Proben*.  
🔐 Nur *20 Sets* — Exklusivität, die im Nu verschwindet.
    `,
    order: '🛒 Bestellen für 63 €',
    payment: '💳 Zahlungsbedingungen',
    shipping: '📦 Lieferbedingungen',
    questions: '❓ Fragen'
  },
  en: {
    welcome: `
💎 *Your chance to own an unforgettable fragrance*

Instead of *€600* — only *€63* for a set of three luxurious scents:

✨ *Red Crystal* (like Baccarat Rouge 540) — the energy of desire in every note.  
🌸 *Rive Droite* (like Fleur Narcotic) — elegance and lightness for every day.  
🔥 *Nossi* (exclusive creation) — a fragrance designed to impress.  

Includes *150 ml + 15 ml testers*.  
🔐 Only *20 sets* — exclusivity that disappears before your eyes.
    `,
    order: '🛒 Order for €63',
    payment: '💳 Payment terms',
    shipping: '📦 Shipping terms',
    questions: '❓ Questions'
  },
  ru: {
    welcome: `
💎 *Твой шанс на аромат, который невозможно забыть*

Вместо *600 €* — всего *63 €* за набор из трёх роскошных ароматов:

✨ *Red Crystal* (как Baccarat Rouge 540) — энергия желания в каждой ноте.  
🌸 *Rive Droite* (как Fleur Narcotic) — утончённость и лёгкость на каждый день.  
🔥 *Nossi* (авторский эксклюзив) — аромат, созданный поражать.  

В комплекте: *150 мл + 15 мл пробников*.  
🔐 Всего *20 наборов* — эксклюзивность, исчезающая на глазах.
    `,
    order: '🛒 Заказать за 63 €',
    payment: '💳 Условия оплаты',
    shipping: '📦 Условия доставки',
    questions: '❓ Вопросы'
  }
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
    noActiveOrder: "⚠️ Sie haben keine aktive Bestellung. Bitte zuerst bestellen."
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
    noActiveOrder: "⚠️ You don’t have an active order. Please place an order first."
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
    noActiveOrder: "⚠️ У вас нет активного заказа. Пожалуйста, сначала оформите заказ."
  }
};

// --- Обробка фото (скрін оплати) ---
bot.on("photo", async (ctx) => {
  const order = orders.find(o => o.userId === ctx.from.id);
  const lang = userLanguage[ctx.from.id] || "en";

  if (!order) {
    return ctx.reply(formTranslations[lang].noActiveOrder);
  }

  const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  await ctx.telegram.sendPhoto(
    ADMIN_ID,
    photo,
    { caption: `📷 Скрин оплаты\n🆔 Order: ${order.id}\n👤 ${order.data.name}` }
  );

  ctx.reply(formTranslations[lang].confirmSent);
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
