require('dotenv').config();
const express = require('express');

const { userBot } = require('./user');
const { adminBot } = require('./admin');

const app = express();
app.use(express.json());

// підключаємо обробники вебхуків
app.use(userBot.webhookCallback('/user'));
app.use(adminBot.webhookCallback('/admin'));

// ❌ НЕ ставимо setWebhook тут!
// Його треба задати один раз вручну через curl або Postman

app.get('/', (req, res) => res.send('Julie & Aron Bot работает 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
