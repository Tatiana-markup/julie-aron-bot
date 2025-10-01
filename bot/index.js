require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

// Імпорт модулів
const { translations, formTranslations } = require('./translations');
const setupUserHandlers = require('./user');
const setupAdminHandlers = require('./admin');

const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_ID = 477219279;
const CHANNEL_ID = '@Julii_und_Aron';

// Глобальні сховища
let stock = 20;
const userLanguage = {};
const userOrders = {};
let orders = [];
const adminState = {};

// --- Start ---
bot.start((ctx) => {
  if (ctx.from.id === ADMIN_ID) {
    return ctx.reply("👩‍💻 Админ-панель", {
      reply_markup: {
        keyboard: [
          ["📦 Список заказов", "✏️ Изменить количество товара"],
          ["🚚 Отправить трек-номер", "📊 Остаток товара"]
        ],
        resize_keyboard: true
      }
    });
  }

  ctx.reply(
    'Здравствуйте 👋 Пожалуйста, выберите язык / Hi 👋 Please choose a language / Hallo 👋 Bitte wählen Sie eine Sprache',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇩🇪 Deutsch", callback_data: "lang_de" }],
          [{ text: "🇬🇧 English", callback_data: "lang_en" }],
          [{ text: "🇷🇺 Русский", callback_data: "lang_ru" }]
        ]
      }
    }
  );
});

// --- Передаємо у файли ---
setupUserHandlers(bot, { translations, formTranslations, userLanguage, userOrders, orders, CHANNEL_ID });
setupAdminHandlers(bot, { userLanguage, orders, adminState, ADMIN_ID, stockRef: () => stock, setStock: (val) => stock = val });

// --- Express для Railway ---
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');

app.get('/', (req, res) => res.send('Bot is running 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
