require('dotenv').config();
const express = require('express');

const userBot = require('./user');
const { bot: adminBot } = require('./admin');

const app = express();
app.use(express.json());

app.use(userBot.webhookCallback('/user'));
app.use(adminBot.webhookCallback('/admin'));

userBot.telegram.setWebhook(process.env.WEBHOOK_URL + '/user');
adminBot.telegram.setWebhook(process.env.WEBHOOK_URL + '/admin');

app.get('/', (req, res) => res.send('Julie & Aron Bot работает 🚀'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port', process.env.PORT || 8080);
});
