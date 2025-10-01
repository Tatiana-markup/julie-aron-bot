require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const setupAdmin = require('./admin');
const setupUser = require('./user');

const bot = new Telegraf(process.env.BOT_TOKEN);

// підключаємо адмінку і юзерську частину
setupAdmin(bot);
setupUser(bot);

// Express для Railway
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/webhook');

app.get('/', (req, res) => res.send('Bot is running 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
