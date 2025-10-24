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
    Markup.inlineKeyboard([
        [
            Markup.button.callback('📦 Список заказов', 'admin_orders'),
            Markup.button.callback('📊 Остаток товара', 'admin_stock')
                       ],
        [
            Markup.button.callback('✏️ Изменить количество товара', 'admin_edit_stock'),
            Markup.button.callback('🚚 Отправить трек-номер', 'admin_track')
                       ],
        [Markup.button.callback('📢 Рассылка', 'admin_broadcast')]
        ])

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
      [Markup.button.callback( '🌐 Изменить язык / Change language / Sprache ändern', 'change_lang')],
    ]),
  });
});

// --- Зміна мови ---
bot.action('change_lang', async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.editMessageText(
    'Здравствуйте 👋 Пожалуйста, выберите язык / Hi 👋 Please choose a language / Hallo 👋 Bitte wählen Sie eine Sprache',
    Markup.inlineKeyboard([
      [Markup.button.callback('🇩🇪 Deutsch', 'lang_de')],
      [Markup.button.callback('🇬🇧 English', 'lang_en')],
      [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
    ])
  );
});


// --- Про аромати ---
bot.action('fragrances', async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();
  return ctx.editMessageText(
    formTranslations[lang].chooseAroma,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("✨ Red Crystal", "aroma_red"),
          Markup.button.callback("🌸 Rive Droite", "aroma_rive"),
        ],
        [Markup.button.callback("🔥 Nossi", "aroma_nossi")],
        [Markup.button.callback(formTranslations[lang].back, "back_to_menu")],
      ]),
    }
  );
});

// --- Опис ароматів ---
bot.action(["aroma_red", "aroma_rive", "aroma_nossi"], async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();

  let text = "";
  if (ctx.callbackQuery.data === "aroma_red") text = formTranslations[lang].aromaRed;
  if (ctx.callbackQuery.data === "aroma_rive") text = formTranslations[lang].aromaRive;
  if (ctx.callbackQuery.data === "aroma_nossi") text = formTranslations[lang].aromaNossi;

  return ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback("✨ Red Crystal", "aroma_red"),
        Markup.button.callback("🌸 Rive Droite", "aroma_rive"),
      ],
      [Markup.button.callback("🔥 Nossi", "aroma_nossi")],
      [Markup.button.callback(formTranslations[lang].back, "back_to_menu")],
    ]),
  });
});

// --- Інфо ---
bot.action(['payment', 'shipping', 'questions'], async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();

  const type = ctx.callbackQuery.data;
  const text = formTranslations[lang][`${type}Info`];
  return ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([[Markup.button.callback(formTranslations[lang].back, "back_to_menu")]]),
  });
});

// --- Назад до меню ---
bot.action("back_to_menu", async (ctx) => {
  const lang = getLang(ctx.from.id);
  await ctx.answerCbQuery();

  return ctx.editMessageText(translations[lang].welcome, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback(translations[lang].order, 'order')],
      [Markup.button.callback(translations[lang].fragrances, 'fragrances')],
      [Markup.button.callback(translations[lang].payment, 'payment')],
      [Markup.button.callback(translations[lang].shipping, 'shipping')],
      [Markup.button.callback(translations[lang].questions, 'questions')],
    ]),
  });
});

// --- Замовлення ---
bot.action('order', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getLang(ctx.from.id);

  const subscribed = await isSubscribed(ctx);
  if (!subscribed) {
    return ctx.reply(
      formTranslations[lang].subscribe || "🔔 Підпишіться, щоб отримати знижку!",
      Markup.inlineKeyboard([
          [Markup.button.url(formTranslations[lang].subscribeBtn, `https://t.me/${CHANNEL_ID.replace('@', '')}`)],
                  [Markup.button.callback(formTranslations[lang].checkSub, 'check_sub')],
                  [Markup.button.callback(formTranslations[lang].buyNoSub, 'order_no_sub')],
      ])
    );
  }

  userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
  return ctx.reply(formTranslations[lang].askName);
});

bot.action('check_sub', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getLang(ctx.from.id);

  if (await isSubscribed(ctx)) {
    userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
    return ctx.reply(formTranslations[lang].askName);
  } else {
    return ctx.reply(formTranslations[lang].notSubscribed);
  }
});

bot.action('order_no_sub', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getLang(ctx.from.id);
  userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 70 } };
  return ctx.reply(formTranslations[lang].askName);
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text.trim();

// --- Адмін логіка ---
  if (userId === ADMIN_ID && adminState[userId]) {
    const state = adminState[userId];

    if (state === "update_stock") {
      const n = parseInt(text);
      if (!isNaN(n)) stock = n;
      await ctx.reply(`✅ Количество наборов обновлено: ${stock}`);
      adminState[userId] = null;
      return;
    }

    if (state === "enter_orderId") {
      adminState[userId] = { step: "enter_tracking", orderId: text };
      return ctx.reply("✏️ Введите трек-номер:");
    }

    if (state?.step === "enter_tracking") {
      const order = orders.find(o => o.id === state.orderId);
      if (!order) {
        await ctx.reply("❌ Заказ не найден");
        adminState[userId] = null;
        return;
      }

      const trackNumber = text;
      const lang = order.lang || "en";
      const trackMessages = {
        ru: `📦 *Ваш заказ отправлен!*\n🚚 Трек-номер: *${trackNumber}* Отслеживать заказ можно по ссылке https://www.dhl.com/global-en/home.html`,
        de: `📦 *Ihre Bestellung wurde versendet!*\n🚚 Sendungsnummer: *${trackNumber}*`,
        en: `📦 *Your order has been shipped!*\n🚚 Tracking number: *${trackNumber}*`
      };

      await bot.telegram.sendMessage(order.userId, trackMessages[lang] || trackMessages.en, { parse_mode: "Markdown" });
      await ctx.reply(`✅ Трек-номер отправлен пользователю (🆔 ${order.id})`);
      adminState[userId] = null;
      stock = Math.max(0, stock - 1);
      return;
    }

    if (state === "broadcast") {
      let success = 0, fail = 0;
      for (let id of userIds) {
        try { await bot.telegram.sendMessage(id, text); success++; } catch { fail++; }
      }
      await ctx.reply(`✅ Рассылка завершена. Успешно: ${success}, ошибок: ${fail}`);
      adminState[userId] = null;
      return;
    }
  }

  // --- Логіка юзера ---
  const order = userOrders[userId];
  if (!order) return;
  const lang = order.lang;

  switch (order.step) {
    case 'name':
  if (text.split(/\s+/).length < 2) return ctx.reply(formTranslations[lang].errorName);
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(text)) return ctx.reply(formTranslations[lang].errorLatinName);
  order.data.name = text.trim();
  order.step = 'country';
  return ctx.reply(formTranslations[lang].askCountry);

// --- Країна ---
case 'country':
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(text)) {
    return ctx.reply(formTranslations[lang].errorLatinCountry);
  }
  order.data.country = text.trim();
  order.step = 'city';
  return ctx.reply(formTranslations[lang].askCity);

// --- Місто + індекс ---
case 'city':
  if (!/^[A-Za-z0-9À-ÖØ-öø-ÿ\s,'\-]+$/.test(text)) {
    return ctx.reply(formTranslations[lang].errorLatinCity);
  }
  order.data.city = text.trim();
  order.step = 'street';
  return ctx.reply(formTranslations[lang].askStreet);

// --- Вулиця, будинок, квартира ---
case 'street':
  if (!/^[A-Za-z0-9À-ÖØ-öø-ÿ\s,'\-./#]+$/.test(text)) {
    return ctx.reply(formTranslations[lang].errorLatinStreet);
  }
  order.data.street = text.trim();
  order.step = 'email';
  return ctx.reply(formTranslations[lang].askEmail);

// --- Email ---
case 'email':
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return ctx.reply(formTranslations[lang].errorEmail);
  order.data.email = text.trim();
  order.step = 'phone';
  return ctx.reply(formTranslations[lang].askPhone);

// --- Телефон ---
case 'phone':
  if (!/^\+[0-9]{8,15}$/.test(text)) return ctx.reply(formTranslations[lang].errorPhone);
  order.data.phone = text.trim();
  order.step = 'payment';
  order.data.paymentConfirmed = false;
  orders.push(order);

  // --- Розрахунок доставки ---
  let deliveryCost = 15;
  const c = order.data.country.toLowerCase();
  if (c.includes('germany') || c.includes('deutschland')) deliveryCost = 5;
  else if (['france', 'austria', 'italy', 'spain', 'poland', 'netherlands', 'belgium', 'czech', 'sweden', 'finland', 'denmark']
           .some(k => c.includes(k))) deliveryCost = 9.99;

  order.data.deliveryCost = deliveryCost;
  order.data.total = order.data.price + deliveryCost;

  // --- Повідомлення з підсумком ---
  await ctx.reply(
  formTranslations[lang].orderSummary(
    order.data.country,
    deliveryCost,
    order.data.total
  ),
  { parse_mode: 'Markdown' }
);

  // --- Кнопки оплати ---
  await ctx.reply(formTranslations[lang].askPayment, Markup.inlineKeyboard([
    [Markup.button.callback(formTranslations[lang].payPaypal, 'pay_paypal')],
    [Markup.button.callback(formTranslations[lang].paySepa, 'pay_sepa')],
  ]));

  // --- Нагадування через 30 хв ---
  setTimeout(async () => {
    const pending = orders.find(o => o.userId === userId && !o.data.paymentConfirmed);
    if (pending) {
      await bot.telegram.sendMessage(userId, formTranslations[lang].paymentReminder);
    }
  }, 15 * 60 * 1000);
  return;
}
});

// --- Оплата ---
bot.action(['pay_paypal', 'pay_sepa'], async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const order = userOrders[userId];
  if (!order) return;

  const lang = order.lang;
  const isPaypal = ctx.callbackQuery.data === 'pay_paypal';
  order.data.payment = isPaypal ? 'PayPal' : 'SEPA';

  const msg = isPaypal
    ? formTranslations[lang].paypalMsg(
        order.data.price,
        order.data.country,
        order.data.deliveryCost,
        order.data.total
      )
    : formTranslations[lang].sepaMsg(
        order.data.price,
        order.data.country,
        order.data.deliveryCost,
        order.data.total
      );

  await ctx.reply(msg, { parse_mode: "Markdown" });

  await ctx.reply(formTranslations[lang].changePayment, Markup.inlineKeyboard([
    [Markup.button.callback(formTranslations[lang].payPaypal, 'pay_paypal')],
    [Markup.button.callback(formTranslations[lang].paySepa, 'pay_sepa')],
  ]));
});

// --- Фото (чек) ---
bot.on('photo', async (ctx) => {
  const userId = ctx.from.id;
  const lang = getLang(userId);
  const order = userOrders[userId];
  if (!order) return ctx.reply(formTranslations[lang].orderNotFound);

  const orderId = Date.now().toString();
  order.id = orderId;
  order.userId = userId;
  order.data.paymentConfirmed = false;
  orders.push(order);

  const photoId = ctx.message.photo.at(-1).file_id;
  await ctx.telegram.sendPhoto(ADMIN_ID, photoId, {
    caption: `🆔 Заказ: ${orderId}\n👤 ${order.data.name}\n🏠 ${order.data.address}\n✉️ ${order.data.email}\n📱 ${order.data.phone}\n💰 ${order.data.price}€\n💳 ${order.data.payment}`,
    reply_markup: { inline_keyboard: [[{ text: "✅ Подтвердить оплату", callback_data: `confirm_${orderId}` }]] }
  });

  ctx.reply(formTranslations[lang].paymentSent);
  delete userOrders[userId];
});

// --- Підтвердження оплати ---
bot.action(/confirm_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const orderId = ctx.match[1];
  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.reply("❌ Заказ не найден");
  order.data.paymentConfirmed = true;
  await bot.telegram.sendMessage(order.userId, formTranslations[order.lang].paymentConfirmed);
  await ctx.reply(`✅ Оплата по заказу ${orderId} подтверждена!`);
});

// --- Адмін кнопки (callback-и) ---
bot.action('admin_orders', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  if (!orders.length) return ctx.reply("ℹ️ Заказов нет");
  const list = orders.map(o =>
    `🆔 ${o.id}\n👤 ${o.data.name}\n🏠 ${o.data.address}\n📱 ${o.data.phone}\n✉️ ${o.data.email}\n💳 ${o.data.payment}\n💰 ${o.data.price}€\n📦 ${o.data.paymentConfirmed ? "✅ Оплачено" : "⏳ Не оплачено"}`
  ).join("\n───────────────\n");
  await ctx.reply(`📋 Список заказов:\n\n${list}\n\n📊 Остаток: ${stock}`);
});

bot.action('admin_stock', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  await ctx.reply(`📦 Остаток товара: ${stock}`);
});

bot.action('admin_edit_stock', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  await ctx.reply("Введите новое количество:");
  adminState[ctx.from.id] = "update_stock";
});

bot.action('admin_track', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  await ctx.reply("Введите ID заказа:");
  adminState[ctx.from.id] = "enter_orderId";
});

bot.action('admin_broadcast', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  await ctx.reply("Введите текст рассылки:");
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