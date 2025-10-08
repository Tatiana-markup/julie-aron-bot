// ✅ Оновлений стабільний код для Telegram-бота Julii & Aron
// Підтримує перевірку підписки, відправку замовлень, підтвердження оплати, трек-номер і роботу адмінки.

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
      [Markup.button.callback('✨ Red Crystal', 'aroma_red'), Markup.button.callback('🌸 Rive Droite', 'aroma_rive')],
      [Markup.button.callback('🔥 Nossi', 'aroma_nossi')],
      [Markup.button.callback(formTranslations[lang].back, 'back_to_menu')],
    ]),
  });
});

// --- Оплата та доставка ---
['payment', 'shipping', 'questions'].forEach(section => {
  bot.action(section, async (ctx) => {
    const lang = getLang(ctx.from.id);
    await ctx.answerCbQuery();
    const textMap = {
      payment: formTranslations[lang].paymentInfo,
      shipping: formTranslations[lang].shippingInfo,
      questions: formTranslations[lang].questionsInfo,
    };
    return ctx.editMessageText(textMap[section], {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback(formTranslations[lang].back, 'back_to_menu')]]),
    });
  });
});

// --- Назад ---
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
      return ctx.reply(formTranslations[lang].subscribe, Markup.inlineKeyboard([
        [Markup.button.url(formTranslations[lang].subscribeBtn, `https://t.me/${CHANNEL_ID.replace('@', '')}`)],
        [Markup.button.callback(formTranslations[lang].checkSub, 'check_sub')],
        [Markup.button.callback(formTranslations[lang].buyNoSub, 'order_no_sub')],
      ]));
    }
  } catch (err) {
    console.error('Error in order:', err);
    return ctx.reply('⚠️ Помилка при старті замовлення. Спробуйте ще раз.');
  }
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

// --- Форма заповнення ---
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text.trim();
  const order = userOrders[userId];
  if (!order) return;
  const lang = order.lang;

  switch (order.step) {
    case 'name':
      if (!/^[A-Za-z\s'-]+$/.test(text)) return ctx.reply(formTranslations[lang].errorLatinName);
      order.data.name = text;
      order.step = 'address';
      return ctx.reply(formTranslations[lang].askAddress);
    case 'address':
      if (!/^[A-Za-z0-9\s,.'-]+$/.test(text)) return ctx.reply(formTranslations[lang].errorLatinAddress);
      order.data.address = text;
      order.step = 'email';
      return ctx.reply(formTranslations[lang].askEmail);
    case 'email':
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) return ctx.reply(formTranslations[lang].errorEmail);
      order.data.email = text;
      order.step = 'phone';
      return ctx.reply(formTranslations[lang].askPhone);
    case 'phone':
      if (!/^\+\d{9,15}$/.test(text)) return ctx.reply(formTranslations[lang].errorPhone);
      order.data.phone = text;
      order.step = 'payment';
      return ctx.reply(formTranslations[lang].askPayment, Markup.inlineKeyboard([
        [Markup.button.callback(formTranslations[lang].payPaypal, 'pay_paypal')],
        [Markup.button.callback(formTranslations[lang].paySepa, 'pay_sepa')]
      ]));
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
  order.step = 'payment_chosen';

  const messageText = isPaypal ? formTranslations[lang].paypalMsg(order.data.price) : formTranslations[lang].sepaMsg(order.data.price);
  await ctx.reply(messageText, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: [[{ text: formTranslations[lang].changePayment, callback_data: 'change_payment' }]] }
  });
});

// --- Фото (чек) ---
bot.on('photo', async (ctx) => {
  const userId = ctx.from.id;
  const lang = getLang(userId);
  const order = userOrders[userId];
  if (!order) return ctx.reply(formTranslations[lang].orderNotFound);

  const photoId = ctx.message.photo.at(-1).file_id;
  const orderId = Date.now().toString();
  order.id = orderId;
  order.userId = userId;
  order.data.paymentConfirmed = false;
  orders.push(order);

  await ctx.telegram.sendPhoto(ADMIN_ID, photoId, {
    caption: `🖼 Подтверждение оплаты\n🆔 Заказ: ${orderId}\n👤 ${order.data.name}\n🏠 ${order.data.address}\n📱 ${order.data.phone}\n✉️ ${order.data.email}\n💰 ${order.data.price}€`,
    reply_markup: { inline_keyboard: [[{ text: '✅ Подтвердить оплату', callback_data: `confirm_${orderId}` }]] }
  });

  ctx.reply(formTranslations[lang].paymentSent);
  delete userOrders[userId];
});

// --- Підтвердження оплати ---
bot.action(/confirm_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const orderId = ctx.match[1];
  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.reply('❌ Заказ не найден');

  order.data.paymentConfirmed = true;
  const lang = order.lang;
  await bot.telegram.sendMessage(order.userId, formTranslations[lang].paymentConfirmed);
  ctx.reply(`✅ Оплата по заказу *${orderId}* подтверждена!`, { parse_mode: 'Markdown' });
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
