const { Markup } = require("telegraf");
const { ADMIN_ID } = require("./state");

function setupUser(bot, translations, formTranslations, userLanguage, userOrders, orders, stock) {
  // --- START ---
  bot.start((ctx) => {
    if (ctx.from.id === ADMIN_ID) {
      // якщо це адмін – нічого тут не робимо (адмінка в admin.js)
      return;
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
      const member = await ctx.telegram.getChatMember("@Julii_und_Aron", ctx.from.id);
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
      ctx.reply('⚠️ Error checking subscription');
    }
  });

  // --- Перевірка підписки ---
  bot.action('check_sub', async (ctx) => {
    const lang = userLanguage[ctx.from.id] || 'en';
    try {
      const member = await ctx.telegram.getChatMember("@Julii_und_Aron", ctx.from.id);
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
    stock--; // автоматично зменшуємо кількість

    let payLink = "";
    if (ctx.match[0] === 'pay_paypal') {
      payLink = order.data.price === 63
        ? "https://www.paypal.com/paypalme/JuliiAron/63"
        : "https://www.paypal.com/paypalme/JuliiAron/70";
    } else {
      payLink = `
Получатель / Recipient / Empfänger: Iuliia Troshina
IBAN: DE77 7505 0000 0027 9627 45
BIC: BYLADEM1RBG
Сумма / Amount / Betrag: ${order.data.price} €
Назначение / Purpose / Verwendungszweck: Julii & Aron Bestellung ${order.data.price}
      `;
    }

    const orderSummary = `
🆔 Order: ${orderId}
👤 Name: ${order.data.name}
🏠 Address: ${order.data.address}
✉️ Email: ${order.data.email}
📱 Phone: ${order.data.phone}
💳 Payment: ${order.data.payment}
💰 Price: ${order.data.price} €
    `;

    // повідомлення адміну
    ctx.telegram.sendMessage(ADMIN_ID, `📦 Новое заказ:\n${orderSummary}`);

    ctx.reply(`🔗 Оплата:\n${payLink}`);
    delete userOrders[ctx.from.id];
  });
}

module.exports = setupUser;
