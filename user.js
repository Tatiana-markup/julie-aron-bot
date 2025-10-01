require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { translations, formTranslations } = require('./translations');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 477219279;
const CHANNEL_ID = '@Julii_und_Aron';

// --- Тимчасові сховища ---
const userLanguage = {};
const userOrders = {};
let orders = [];

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
      [Markup.button.callback(translations[lang].order, 'order')],
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')]
    ])
  });
});

// --- Order ---
bot.action('order', async (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
    if (['member', 'administrator', 'creator'].includes(member.status)) {
      ctx.reply(formTranslations[lang].askName);
      userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
    } else {
      ctx.reply(formTranslations[lang].subscribe, Markup.inlineKeyboard([
        [Markup.button.url(formTranslations[lang].subscribeBtn, 'https://t.me/Julii_und_Aron')],
        [Markup.button.callback(formTranslations[lang].checkSub, 'check_sub')],
        [Markup.button.callback(formTranslations[lang].buyNoSub, 'order_no_sub')]
      ]));
    }
  } catch (err) {
    console.error(err);
    ctx.reply('⚠️ Error checking subscription');
  }
});

// --- Перевірка підписки ---
bot.action('check_sub', async (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
    if (['member', 'administrator', 'creator'].includes(member.status)) {
      ctx.reply(formTranslations[lang].askName);
      userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
    } else {
      ctx.reply(formTranslations[lang].notSubscribed);
    }
  } catch (err) {
    ctx.reply('⚠️ Error checking subscription');
  }
});

// --- Без підписки ---
bot.action('order_no_sub', (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  ctx.reply(formTranslations[lang].askName);
  userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 70 } };
});

// --- Форма ---
bot.on('text', (ctx) => {
  const order = userOrders[ctx.from.id];
  if (!order) return;
  const lang = order.lang;
  const text = ctx.message.text.trim();

  switch (order.step) {
    case 'name':
      if (text.split(" ").length < 2) {
        return ctx.reply("❌ Name must contain at least 2 words / Имя должно содержать минимум 2 слова / Ім’я має містити мінімум 2 слова");
      }
      order.data.name = text;
      order.step = 'address';
      ctx.reply(formTranslations[lang].askAddress);
      break;
    case 'address':
      order.data.address = text;
      order.step = 'email';
      ctx.reply(formTranslations[lang].askEmail);
      break;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        return ctx.reply("❌ Invalid email / Неверный email / Невірна адреса пошти");
      }
      order.data.email = text;
      order.step = 'phone';
      ctx.reply(formTranslations[lang].askPhone);
      break;
    case 'phone':
      if (!/^\+\d{7,15}$/.test(text)) {
        return ctx.reply("❌ Invalid phone format. Example: +491234567890 / Неверный формат телефона. Пример: +79123456789 / Невірний формат телефону. Приклад: +380931234567");
      }
      order.data.phone = text;
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
  const orderId = Date.now().toString();

  order.data.payment = ctx.match[0] === 'pay_paypal' ? 'PayPal' : 'SEPA';
  order.id = orderId;
  order.userId = ctx.from.id;

  orders.push(order);

  let message = "";
  if (ctx.match[0] === 'pay_paypal') {
    const link = order.data.price === 63
      ? "https://www.paypal.com/paypalme/JuliiAron/63"
      : "https://www.paypal.com/paypalme/JuliiAron/70";

    if (lang === "de") {
      message = `🔗 [${order.data.price} € → PayPal](${link})\n\nBitte führen Sie die Zahlung durch und senden Sie einen Screenshot zur Bestätigung.\n🆔 Bestellnummer: ${orderId}`;
    } else if (lang === "ru") {
      message = `🔗 [${order.data.price} € → PayPal](${link})\n\nПожалуйста, произведите оплату и отправьте скриншот для подтверждения.\n🆔 Номер заказа: ${orderId}`;
    } else {
      message = `🔗 [${order.data.price} € → PayPal](${link})\n\nPlease make the payment and send a screenshot for confirmation.\n🆔 Order ID: ${orderId}`;
    }
  } else {
    if (lang === "de") {
      message = `🏦 SEPA-Überweisung\n\nEmpfänger: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nBetrag: ${order.data.price} €\nVerwendungszweck: Julii & Aron Bestellung ${order.data.price}\n\nBitte führen Sie die Zahlung durch und senden Sie einen Screenshot zur Bestätigung.\n🆔 Bestellnummer: ${orderId}`;
    } else if (lang === "ru") {
      message = `🏦 SEPA-перевод\n\nПолучатель: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nСумма: ${order.data.price} €\nНазначение: Julii & Aron Bestellung ${order.data.price}\n\nПожалуйста, произведите оплату и отправьте скриншот для подтверждения.\n🆔 Номер заказа: ${orderId}`;
    } else {
      message = `🏦 SEPA Transfer\n\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: ${order.data.price} €\nPurpose: Julii & Aron Order ${order.data.price}\n\nPlease make the payment and send a screenshot for confirmation.\n🆔 Order ID: ${orderId}`;
    }
  }

  ctx.reply(message, { parse_mode: "Markdown" });

  // --- повідомлення адміну (російською) ---
  const orderSummary = `
🆔 Заказ: ${orderId}
👤 Имя: ${order.data.name}
🏠 Адрес: ${order.data.address}
✉️ Email: ${order.data.email}
📱 Телефон: ${order.data.phone}
💳 Оплата: ${order.data.payment}
💰 Сумма: ${order.data.price} €
  `;
  ctx.telegram.sendMessage(ADMIN_ID, `📦 Новый заказ:\n${orderSummary}`);

  delete userOrders[ctx.from.id];
});

// --- Обробка скріншотів ---
bot.on('photo', async (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  const lastOrder = orders.find(o => o.userId === ctx.from.id);

  if (!lastOrder) {
    if (lang === "de") return ctx.reply("⚠️ Wir haben keine aktive Bestellung von Ihnen gefunden.");
    if (lang === "ru") return ctx.reply("⚠️ У нас нет вашего активного заказа.");
    return ctx.reply("⚠️ We couldn't find your active order.");
  }

  const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

  // надсилаємо адміну фото + ID заказа
  await ctx.telegram.sendPhoto(ADMIN_ID, photoId, {
    caption: `🖼 Подтверждение оплаты\n🆔 Заказ: ${lastOrder.id}`
  });

  // відповідь користувачу
  if (lang === "de") {
    ctx.reply("✅ Danke! Ihre Zahlungsbestätigung wurde an den Administrator gesendet.");
  } else if (lang === "ru") {
    ctx.reply("✅ Спасибо! Ваше подтверждение отправлено администратору.");
  } else {
    ctx.reply("✅ Thank you! Your payment confirmation has been sent to the administrator.");
  }
});

module.exports = bot;
