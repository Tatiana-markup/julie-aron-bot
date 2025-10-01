const { Markup } = require("telegraf");
const { ADMIN_ID } = require("./state");

function setupUser(bot, translations, formTranslations, userLanguage, userOrders, orders, stock) {
  bot.start((ctx) => {
    if (ctx.from.id === ADMIN_ID) {
      // адмін не бачить юзерське меню
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

  // --- Далі твій код для замовлення (order, check_sub, order_no_sub, форма і т.д.) ---
}

module.exports = setupUser;
