require('dotenv').config();
const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const { translations, formTranslations } = require('./translations');

// --- Налаштування ---
const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = parseInt(process.env.ADMIN_ID);
const CHANNEL_ID = '@Julii_und_Aron';

// --- Тимчасові сховища ---
let stock = 20;
let orders = [];
const userLanguage = {};
const userOrders = {};
let adminState = {};

// ==========================
// 📦 КОРИСТУВАЧ
// ==========================
bot.start((ctx) => {
  if (ctx.from.id === ADMIN_ID) {
    return ctx.reply("👩‍💻 Панель администратора", Markup.keyboard([
      ["📦 Список заказов", "📊 Остаток товара"],
      ["✏️ Изменить количество товара", "🚚 Отправить трек-номер"]
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

// --- Check Sub ---
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

// --- Order without sub ---
bot.action('order_no_sub', (ctx) => {
  const lang = userLanguage[ctx.from.id] || 'en';
  ctx.reply(formTranslations[lang].askName);
  userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 70 } };
});

// --- Форма ---
bot.on('text', (ctx) => {
  // якщо це адмін — ігноруємо тут
  if (ctx.from.id === ADMIN_ID) return;

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

    message = `🔗 [${order.data.price} € → PayPal](${link})\n\nPlease pay and send a screenshot.\n🆔 Order: ${orderId}`;
  } else {
    message = `🏦 SEPA\n\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: ${order.data.price} €\nPurpose: Julii & Aron Order ${order.data.price}\n\nSend screenshot after payment.\n🆔 Order: ${orderId}`;
  }

  ctx.reply(message, { parse_mode: "Markdown" });

  // повідомлення адміну (російською)
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
  if (ctx.from.id === ADMIN_ID) return;
  const lastOrder = orders.find(o => o.userId === ctx.from.id);
  if (!lastOrder) return ctx.reply("⚠️ Нет активного заказа.");

  const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  await ctx.telegram.sendPhoto(ADMIN_ID, photoId, {
    caption: `🖼 Подтверждение оплаты\n🆔 Заказ: ${lastOrder.id}`
  });
  ctx.reply("✅ Спасибо! Подтверждение отправлено администратору.");
});

// ==========================
// 👩‍💻 АДМИНКА
// ==========================
bot.hears("📦 Список заказов", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  if (orders.length === 0) {
    ctx.reply("ℹ️ Заказов нет");
  } else {
    let list = orders.map(o => `🆔 ${o.id} | ${o.data.name} | ${o.data.price}€`).join("\n");
    ctx.reply(`📋 Заказы:\n\n${list}\n\n📊 Остаток: ${stock}`);
  }
});

bot.hears("📊 Остаток товара", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply(`📊 Текущее количество наборов: ${stock}`);
});

bot.hears("✏️ Изменить количество товара", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply("✏️ Введите новое количество наборов:");
  adminState[ctx.from.id] = "update_stock";
});

bot.hears("🚚 Отправить трек-номер", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply("📦 Введите ID заказа:");
  adminState[ctx.from.id] = "enter_orderId";
});

// Обработка текста в админке
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
    ctx.reply("✏️ Введите трек-номер:");
    adminState[ctx.from.id] = { step: "enter_tracking", orderId };
  }

  if (state?.step === "enter_tracking") {
    const trackNumber = ctx.message.text;
    const order = orders.find(o => o.id === state.orderId);
    if (order) {
      bot.telegram.sendMessage(order.userId, `📦 Ваш заказ отправлен!\nТрек-номер: ${trackNumber}`);
      ctx.reply(`✅ Трек-номер отправлен пользователю (🆔 ${order.id})`);
      stock = stock - 1;
    } else {
      ctx.reply("❌ Заказ не найден");
    }
    adminState[ctx.from.id] = null;
  }
});

// ==========================
// 🚀 EXPRESS
// ==========================
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');
app.get('/', (req, res) => res.send('Julie & Aron Bot работает 🚀'));
app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
