require('dotenv').config();
const express = require('express');

const { userBot, orders, getStock, setStock } = require('./user');
const admin = require('./admin'); // тут ми забираємо і bot, і init

const app = express();
app.use(express.json());

// ініціалізація адмін-бота
admin.init({ orders, getStock, setStock });
const adminBot = admin.bot;

// підключаємо вебхуки
app.use(userBot.webhookCallback('/user'));
app.use(adminBot.webhookCallback('/admin'));

userBot.telegram.setWebhook(process.env.WEBHOOK_URL + '/user');
adminBot.telegram.setWebhook(process.env.WEBHOOK_URL + '/admin');

app.get('/', (req, res) => res.send('Julie & Aron Bot работает 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
