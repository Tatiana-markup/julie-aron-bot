require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 477219279;
const CHANNEL_ID = '@Julii_und_Aron';

let stock = 20; // кількість наборів
const userLanguage = {};
const userOrders = {};
let orderCounter = 1;

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
    askPhone: 'Bitte geben Sie Ihre Telefonnummer im internationalen Format (+49...):',
    askPayment: 'Wählen Sie die Zahlungsmethode:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-Überweisung',
    successPayment: '✅ Zahlung erhalten.\nIhre Bestellung wird morgen versendet.\nDie Sendungsnummer erhalten Sie in diesem Chat.',
    sepaDetails: `🏦 *SEPA-Überweisung*\n\nEmpfänger: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nBetrag: [amount] €\nVerwendungszweck: Julii & Aron Bestellung [amount]`
  },
  en: {
    subscribe: '👉 Subscribe to the channel to get 10% off and grab the set for €63',
    subscribeBtn: '🔔 Subscribe',
    checkSub: '✅ I subscribed',
    notSubscribed: '❌ You are not subscribed yet. Please subscribe first 👆',
    buyNoSub: '💳 Buy without subscription for €70',
    askName: 'Please enter your full name (First + Last name):',
    askAddress: 'Please enter your delivery address (Country, City, Zip, Street/House/Apartment):',
    askEmail: 'Please enter your email:',
    askPhone: 'Please enter your phone number in international format (+44...):',
    askPayment: 'Choose payment method:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA Transfer',
    successPayment: '✅ Payment received.\nYour order will be shipped tomorrow.\nThe tracking number will be sent to this chat.',
    sepaDetails: `🏦 *SEPA Transfer*\n\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: [amount] €\nReference: Julii & Aron Order [amount]`
  },
  ru: {
    subscribe: '👉 Подпишитесь на канал, чтобы получить скидку 10% и забрать набор за 63 €',
    subscribeBtn: '🔔 Подписаться',
    checkSub: '✅ Я подписался',
    notSubscribed: '❌ Вы ещё не подписались. Пожалуйста, сначала подпишитесь 👆',
    buyNoSub: '💳 Купить без подписки за 70 €',
    askName: 'Введите имя и фамилию:',
    askAddress: 'Введите адрес доставки (Страна, Город, Индекс, Улица/дом/кв.):',
    askEmail: 'Введите ваш email:',
    askPhone: 'Введите ваш телефон в международном формате (+7...):',
    askPayment: 'Выберите метод оплаты:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-перевод',
    successPayment: '✅ Оплата получена.\nВаш заказ будет отправлен завтра.\nТрек-номер придёт в этот чат.',
    sepaDetails: `🏦 *SEPA-перевод*\n\nПолучатель: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nСумма: [amount] €\nНазначение: Julii & Aron Bestellung [amount]`
  }
};

// --- Старт ---
bot.start((ctx) => {
  if (ctx.from.id === ADMIN_ID) {
    ctx.reply('👋 Админ-панель', Markup.inlineKeyboard([
      [Markup.button.callback('📦 Список заказов', 'admin_orders')],
      [Markup.button.callback('📉 Остаток наборов', 'admin_stock')]
    ]));
  } else {
    ctx.reply(
      'Здравствуйте 👋 Пожалуйста, выберите язык / Hi 👋 Please choose a language / Hallo 👋 Bitte wählen Sie eine Sprache',
      Markup.inlineKeyboard([
        [Markup.button.callback('🇩🇪 Deutsch', 'lang_de')],
        [Markup.button.callback('🇬🇧 English', 'lang_en')],
        [Markup.button.callback('🇷🇺 Русский', 'lang_ru')]
      ])
    );
  }
});

// --- Вибір мови ---
bot.action(['lang_de', 'lang_en', 'lang_ru'], (ctx) => {
  ctx.answerCbQuery();
  let lang = ctx.match[0].split('_')[1];
  userLanguage[ctx.from.id] = lang;

  ctx.reply(translations[lang].welcome, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback(translations[lang].order, 'order')],
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')]
    ])
  });
});

// --- Замовлення ---
bot.action('order', async (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
    if (['member', 'administrator', 'creator'].includes(member.status)) {
      const orderId = orderCounter++;
      userOrders[ctx.from.id] = { id: orderId, step: 'name', lang, data: { price: 63 } };
      ctx.reply(formTranslations[lang].askName);
    } else {
      ctx.reply(formTranslations[lang].subscribe, Markup.inlineKeyboard([
        [Markup.button.url(formTranslations[lang].subscribeBtn, 'https://t.me/Julii_und_Aron')],
        [Markup.button.callback(formTranslations[lang].checkSub, 'check_sub')],
        [Markup.button.callback(formTranslations[lang].buyNoSub, 'order_no_sub')]
      ]));
    }
  } catch {
    ctx.reply('⚠️ Error checking subscription');
  }
});

// --- Форма ---
bot.on('text', (ctx) => {
  const order = userOrders[ctx.from.id];
  if (!order) return;
  const lang = order.lang;

  switch (order.step) {
    case 'name':
      if (ctx.message.text.trim().split(' ').length < 2) {
        return ctx.reply('❌ Введите имя и фамилию / Please enter first and last name / Bitte Vor- und Nachname eingeben');
      }
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
      if (!ctx.message.text.includes('@')) {
        return ctx.reply('❌ Неверный email / Invalid email / Ungültige E-Mail');
      }
      order.data.email = ctx.message.text;
      order.step = 'phone';
      ctx.reply(formTranslations[lang].askPhone);
      break;
    case 'phone':
      if (!/^\+\d{7,15}$/.test(ctx.message.text)) {
        return ctx.reply('❌ Телефон должен быть в формате +123456789 / Phone must be +123456789 / Telefon im Format +123456789');
      }
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

  let paymentLink = '';
  if (order.data.payment === 'PayPal') {
    paymentLink = order.data.price === 63
      ? 'https://www.paypal.com/paypalme/JuliiAron/63'
      : 'https://www.paypal.com/paypalme/JuliiAron/70';
  } else {
    paymentLink = formTranslations[lang].sepaDetails.replace(/\[amount\]/g, order.data.price);
  }

  const orderSummary = `
🆔 Order #${order.id} (${order.data.price} €)

👤 Name: ${order.data.name}
🏠 Address: ${order.data.address}
✉️ Email: ${order.data.email}
📱 Phone: ${order.data.phone}
💳 Payment: ${order.data.payment}
  `;

  ctx.telegram.sendMessage(ADMIN_ID, orderSummary, Markup.inlineKeyboard([
    [Markup.button.callback(`✅ Подтвердить оплату заказа #${order.id}`, `confirm_${order.id}`)]
  ]));

  ctx.reply(`🔗 ${paymentLink}`, { parse_mode: 'Markdown' });
});

// --- Подтверждение оплаты ---
bot.action(/confirm_(\d+)/, (ctx) => {
  const orderId = ctx.match[1];
  stock--;
  ctx.reply(`✅ Оплата подтверждена для заказа #${orderId}`);
  ctx.telegram.sendMessage(ADMIN_ID, `✅ Заказ #${orderId} подтвержден. Остаток: ${stock}`);
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
