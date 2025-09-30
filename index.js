require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 477219279; // твій Telegram ID
const CHANNEL_ID = '@Julii_und_Aron';

// --- Тексти для вітання ---
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
    questions: '❓ Fragen',
    successPayment: '✅ Zahlung bestätigt.\nIhre Bestellung wird morgen versendet.\nDie Sendungsnummer erhalten Sie in diesem Chat.'
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
    questions: '❓ Questions',
    successPayment: '✅ Payment confirmed.\nYour order will be shipped tomorrow.\nThe tracking number will be sent to this chat.'
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
    questions: '❓ Вопросы',
    successPayment: '✅ Оплата подтверждена.\nВаш заказ будет отправлен завтра.\nТрек-номер придёт в этот чат.'
  }
};

// --- Тексти для форми ---
const formTranslations = {
  de: {
    askName: 'Bitte geben Sie Ihren vollständigen Namen ein:',
    askAddress: 'Bitte geben Sie Ihre Lieferadresse ein:',
    askEmail: 'Bitte geben Sie Ihre E-Mail-Adresse ein:',
    askPhone: 'Bitte geben Sie Ihre Telefonnummer ein:',
    askPayment: 'Wählen Sie die Zahlungsmethode:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-Überweisung',
    notSubscribed: '❌ Sie haben den Kanal noch nicht abonniert.'
  },
  en: {
    askName: 'Please enter your full name:',
    askAddress: 'Please enter your delivery address:',
    askEmail: 'Please enter your email:',
    askPhone: 'Please enter your phone number:',
    askPayment: 'Choose payment method:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA Transfer',
    notSubscribed: '❌ You are not subscribed yet.'
  },
  ru: {
    askName: 'Введите имя и фамилию:',
    askAddress: 'Введите адрес доставки:',
    askEmail: 'Введите ваш email:',
    askPhone: 'Введите ваш телефон:',
    askPayment: 'Выберите метод оплаты:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-перевод',
    notSubscribed: '❌ Вы ещё не подписались.'
  }
};

// --- Тимчасові сховища ---
const userLanguage = {};
const userOrders = {};

// --- Старт ---
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

// --- Вибір мови ---
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

// --- Сценарій замовлення (спрощено) ---
bot.action('order', (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  ctx.reply(formTranslations[lang].askName);
  userOrders[ctx.from.id] = { step: 'name', lang, data: {} };
});

// --- Форма ---
bot.on('text', (ctx) => {
  const order = userOrders[ctx.from.id];
  if (!order) return;

  const lang = order.lang;

  switch (order.step) {
    case 'name':
      order.data.name = ctx.message.text;
      order.step = 'address';
      ctx.reply(formTranslations[lang].askAddress);
      break;
    case 'address':
      order.data.address = ctx.message.text;
      order.step = 'email';
      ctx.reply(formTranslations[lang].askEmail);
      break;
    case 'email':
      order.data.email = ctx.message.text;
      order.step = 'phone';
      ctx.reply(formTranslations[lang].askPhone);
      break;
    case 'phone':
      order.data.phone = ctx.message.text;
      order.step = 'payment';
      ctx.reply(formTranslations[lang].askPayment, Markup.inlineKeyboard([
        [Markup.button.callback(formTranslations[lang].payPaypal, 'pay_paypal')],
        [Markup.button.callback(formTranslations[lang].paySepa, 'pay_sepa')]
      ]));
      break;
  }
});

// --- Оплата ---
bot.action(['pay_paypal', 'pay_sepa'], (ctx) => {
  const order = userOrders[ctx.from.id];
  if (!order) return;
  const lang = order.lang;

  order.data.payment = ctx.match[0] === 'pay_paypal' ? 'PayPal' : 'SEPA';

  const orderSummary = `
📦 Новый заказ

👤 Name: ${order.data.name}
🏠 Address: ${order.data.address}
✉️ Email: ${order.data.email}
📱 Phone: ${order.data.phone}
💳 Payment: ${order.data.payment}
  `;

  ctx.telegram.sendMessage(ADMIN_ID, orderSummary, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Подтвердить оплату', callback_data: `confirm_${ctx.from.id}` }]
      ]
    }
  });

  ctx.reply('🔗 Для оплаты перейдите по ссылке:\n' +
    (order.data.payment === 'PayPal'
      ? 'https://www.paypal.com/paypalme/JuliiAron/' + (order.data.price || 63)
      : 'IBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nПолучатель: Iuliia Troshina\nСумма: ' + (order.data.price || 63) + ' €\nНазначение: Bestellung')
  );

  delete userOrders[ctx.from.id];
});

// --- Підтвердження від адміна ---
bot.action(/confirm_(.+)/, (ctx) => {
  const userId = ctx.match[1];
  const lang = userLanguage[userId] || 'en';
  ctx.telegram.sendMessage(userId, translations[lang].successPayment);
  ctx.answerCbQuery('✅ Оплата подтверждена');
});

// --- Express для Railway ---
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');
app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
