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

// --- Middleware для збереження ID користувачів ---
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
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')],
    ]),
  });
});

// --- Order ---
bot.action('order', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getLang(ctx.from.id);
  if (await isSubscribed(ctx)) {
    await ctx.reply(formTranslations[lang].askName);
    userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
  } else {
    await ctx.reply(formTranslations[lang].subscribe, Markup.inlineKeyboard([
      [Markup.button.url(formTranslations[lang].subscribeBtn, `https://t.me/${CHANNEL_ID.replace('@', '')}`)],
      [Markup.button.callback(formTranslations[lang].checkSub, 'check_sub')],
      [Markup.button.callback(formTranslations[lang].buyNoSub, 'order_no_sub')],
    ]));
  }
});

bot.action('check_sub', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getLang(ctx.from.id);
  if (await isSubscribed(ctx)) {
    await ctx.reply(formTranslations[lang].askName);
    userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
  } else {
    await ctx.reply(formTranslations[lang].notSubscribed);
  }
});

bot.action('order_no_sub', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getLang(ctx.from.id);
  await ctx.reply(formTranslations[lang].askName);
  userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 70 } };
});

// --- ЄДИНИЙ обробник текстів ---
bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text.trim();

  // --- Якщо це адмін і є state ---
  if (userId === ADMIN_ID && adminState[userId]) {
    const state = adminState[userId];

    if (state === "update_stock") {
      const newStock = parseInt(text);
      if (!isNaN(newStock) && newStock >= 0) {
        stock = newStock;
        await ctx.reply(`✅ Количество наборов обновлено: ${stock}`);
      } else {
        await ctx.reply("❌ Введите корректное число");
      }
      adminState[userId] = null;
      return;
    }

    if (state === "enter_orderId") {
      adminState[userId] = { step: "enter_tracking", orderId: text };
      return ctx.reply("✏️ Введите трек-номер:");
    }

    if (state?.step === "enter_tracking") {
      const trackNumber = text;
      const order = orders.find(o => o.id === state.orderId);
      if (order) {
        await bot.telegram.sendMessage(order.userId, `📦 Ваш заказ отправлен!\nТрек-номер: ${trackNumber}`);
        await ctx.reply(`✅ Трек-номер отправлен пользователю (🆔 ${order.id})`);
        stock = Math.max(0, stock - 1);
      } else {
        await ctx.reply("❌ Заказ не найден");
      }
      adminState[userId] = null;
      return;
    }

    if (state === "broadcast") {
      let success = 0, fail = 0;
      for (let id of userIds) {
        try {
          await bot.telegram.sendMessage(id, text, { parse_mode: "Markdown" });
          success++;
        } catch {
          fail++;
        }
      }
      ctx.reply(`✅ Рассылка завершена. Успешно: ${success}, ошибок: ${fail}`);
      adminState[userId] = null;
      return;
    }
  }

  // --- Якщо це юзер і є активне замовлення ---
  const order = userOrders[userId];
  if (!order) return;
  const lang = order.lang;

  switch (order.step) {
    case "name":
      if (text.split(" ").length < 2) return ctx.reply(formTranslations[lang].errorName);
      order.data.name = text;
      order.step = "address";
      return ctx.reply(formTranslations[lang].askAddress);

    case "address":
      order.data.address = text;
      order.step = "email";
      return ctx.reply(formTranslations[lang].askEmail);

    case "email": {
      const email = text.trim();
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return ctx.reply(formTranslations[lang].errorEmail);
      }
      order.data.email = email;
      order.step = "phone";
      return ctx.reply(formTranslations[lang].askPhone);
    }

    case "phone": {
      const phone = text.trim();
      if (!/^\+\d{9,15}$/.test(phone)) {
        return ctx.reply(formTranslations[lang].errorPhone || "❌ Невірний формат телефону. Приклад: +380931234567");
      }
      order.data.phone = phone;
      order.step = "payment";
      return ctx.reply(formTranslations[lang].askPayment, Markup.inlineKeyboard([
        [Markup.button.callback(formTranslations[lang].payPaypal, "pay_paypal")],
        [Markup.button.callback(formTranslations[lang].paySepa, "pay_sepa")]
      ]));
    }
  }
});

// --- Оплата ---
bot.action(['pay_paypal', 'pay_sepa'], async (ctx) => {
  await ctx.answerCbQuery();
  const order = userOrders[ctx.from.id];
  if (!order) return;
  const lang = order.lang;
  const orderId = Date.now().toString();
  const isPaypal = ctx.callbackQuery.data === 'pay_paypal';

  order.data.payment = isPaypal ? 'PayPal' : 'SEPA';
  order.id = orderId;
  order.userId = ctx.from.id;
  orders.push(order);

  const messageText = isPaypal
    ? formTranslations[lang].paypalMsg(order.data.price, orderId)
    : formTranslations[lang].sepaMsg(order.data.price, orderId);

  await ctx.reply(messageText, { parse_mode: "Markdown", disable_web_page_preview: true });

  const orderSummary = `
🆔 Заказ: ${orderId}
👤 Имя: ${order.data.name}
🏠 Адрес: ${order.data.address}
✉️ Email: ${order.data.email}
📱 Телефон: ${order.data.phone}
💳 Оплата: ${order.data.payment}
💰 Сумма: ${order.data.price} €
  `;
  if (ADMIN_ID) await ctx.telegram.sendMessage(ADMIN_ID, `📦 Новый заказ:\n${orderSummary}`);

  delete userOrders[ctx.from.id];
});

// --- Фото (чек) ---
bot.on('photo', async (ctx) => {
  const lang = getLang(ctx.from.id);
  const order = lastOrderFor(ctx.from.id);
  if (!order) return ctx.reply(formTranslations[lang].orderNotFound);

  const photoId = ctx.message.photo.at(-1).file_id;
  await ctx.telegram.sendPhoto(ADMIN_ID, photoId, {
    caption: `🖼 Подтверждение оплаты\n🆔 Заказ: ${order.id}`,
    reply_markup: {
      inline_keyboard: [[{ text: "✅ Подтвердить оплату", callback_data: `confirm_${order.id}` }]]
    }
  });
  ctx.reply(formTranslations[lang].paymentSent);
});

// --- Підтвердження адміном ---
bot.action(/confirm_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const orderId = ctx.match[1];
  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.reply("❌ Заказ не найден");
  const lang = order.lang;
  await bot.telegram.sendMessage(order.userId, formTranslations[lang].paymentConfirmed);
  ctx.reply(`✅ Оплата по заказу ${orderId} подтверждена!`);
});

// --- Адмін-панель ---
bot.hears("📦 Список заказов", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  if (!orders.length) return ctx.reply("ℹ️ Заказов нет");
  const list = orders.map(o => `🆔 ${o.id} | ${o.data.name} | ${o.data.price}€`).join("\n");
  ctx.reply(`📋 Заказы:\n\n${list}\n\n📊 Остаток: ${stock}`);
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

bot.hears("📢 Рассылка", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.reply("✏️ Введи текст рассылки:");
  adminState[ctx.from.id] = "broadcast";
});

// --- Сервер ---
const app = express();
app.use(express.json());
if (WEBHOOK_URL) app.use(bot.webhookCallback('/webhook'));

app.get('/', (req, res) => res.send('Bot is running 🚀'));
app.listen(PORT, async () => {
  console.log('Server running on port', PORT);
  if (WEBHOOK_URL) {
    try {
      await bot.telegram.setWebhook(`${WEBHOOK_URL}/webhook`, { drop_pending_updates: true });
      console.log('Webhook set to', `${WEBHOOK_URL}/webhook`);
    } catch (e) {
      console.error('Webhook error, switching to polling...', e.message);
      await bot.telegram.deleteWebhook().catch(() => {});
      await bot.launch();
    }
  } else {
    await bot.telegram.deleteWebhook().catch(() => {});
    await bot.launch();
    console.log('Polling started (no WEBHOOK_URL)');
  }
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
