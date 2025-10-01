const { Markup } = require('telegraf');
const { translations, formTranslations } = require('./translations');

const userLanguage = {};
const userOrders = {};
let orders = [];
let stock = 20;

module.exports = (bot) => {
  // команда /start для користувача
  bot.start((ctx) => {
    if (ctx.from.id === parseInt(process.env.ADMIN_ID)) return; // адмін не юзер

    ctx.reply(
      'Здравствуйте 👋 Пожалуйста, выберите язык / Hi 👋 Please choose a language / Hallo 👋 Bitte wählen Sie eine Sprache',
      Markup.inlineKeyboard([
        [Markup.button.callback('🇩🇪 Deutsch', 'lang_de')],
        [Markup.button.callback('🇬🇧 English', 'lang_en')],
        [Markup.button.callback('🇷🇺 Русский', 'lang_ru')]
      ])
    );
  });

  // вибір мови
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

  // обробка замовлення
  bot.action('order', async (ctx) => {
    const lang = userLanguage[ctx.from.id] || 'en';
    ctx.reply(formTranslations[lang].askName);
    userOrders[ctx.from.id] = { step: 'name', lang, data: { price: 63 } };
  });

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

  bot.action(['pay_paypal', 'pay_sepa'], (ctx) => {
    const order = userOrders[ctx.from.id];
    if (!order) return;
    const lang = order.lang;
    const orderId = Date.now().toString();

    order.data.payment = ctx.match[0] === 'pay_paypal' ? 'PayPal' : 'SEPA';
    order.id = orderId;
    order.userId = ctx.from.id;

    orders.push(order);
    stock--; // авто-зменшення залишку

    ctx.telegram.sendMessage(process.env.ADMIN_ID, `📦 Новое заказ:\nID: ${orderId}\nName: ${order.data.name}\nPrice: ${order.data.price}€`);

    ctx.reply(formTranslations[lang].successPayment);
    delete userOrders[ctx.from.id];
  });

  return { orders, stock };
};
