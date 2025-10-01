require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

// створюємо бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// підключаємо модулі
const userModule = require('./user');
const { orders, stock } = userModule(bot);

require('./admin')(bot, { orders, stock });

// Express сервер
const app = express();
app.use(express.json());

app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');

app.get('/', (req, res) => res.send('Julie & Aron Bot 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
