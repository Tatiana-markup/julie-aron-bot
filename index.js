require("dotenv").config();
const { Telegraf } = require("telegraf");
const express = require("express");

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Реакція на /start
bot.start((ctx) => ctx.reply("Привіт 👋 Це Julie & Aron бот на Railway 🚀"));

// Реєструємо webhook callback
app.use(bot.webhookCallback("/webhook"));

// Тестовий маршрут для перевірки
app.get("/", (req, res) => {
  res.send("✅ Bot is running on Railway!");
});

// Слухаємо порт
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);
});
