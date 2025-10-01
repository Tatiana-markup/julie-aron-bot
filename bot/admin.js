const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

let stock = 20;
let orders = [];
const adminState = {};
const ADMIN_ID = process.env.ADMIN_ID;

// --- Админ панель ---
bot.command("admin", (ctx) => {
  if (ctx.from.id != ADMIN_ID) return;
  ctx.reply("👩‍💻 Панель администратора", Markup.keyboard([
    ["📦 Список заказов", "📊 Остаток товара"],
    ["✏️ Изменить количество товара", "🚚 Отправить трек-номер"]
  ]).resize());
});

// --- Кнопки ---
bot.hears("📦 Список заказов", (ctx) => {
  if (orders.length === 0) {
    ctx.reply("ℹ️ Заказов нет");
  } else {
    let list = orders.map(o => `🆔 ${o.id} | ${o.data.name} | ${o.data.price}€`).join("\n");
    ctx.reply(`📋 Заказы:\n\n${list}\n\nОстаток: ${stock}`);
  }
});

bot.hears("📊 Остаток товара", (ctx) => {
  ctx.reply(`📊 Текущее количество наборов: ${stock}`);
});

bot.hears("✏️ Изменить количество товара", (ctx) => {
  ctx.reply("✏️ Введите новое количество наборов:");
  adminState[ctx.from.id] = "update_stock";
});

bot.hears("🚚 Отправить трек-номер", (ctx) => {
  ctx.reply("📦 Введите ID заказа:");
  adminState[ctx.from.id] = "enter_orderId";
});

// --- Обработка ввода ---
bot.on("text", (ctx) => {
  if (ctx.from.id != ADMIN_ID) return;
  const state = adminState[ctx.from.id];

  if (state === "update_stock") {
    const newStock = parseInt(ctx.message.text);
    if (!isNaN(newStock) && newStock >= 0) {
      stock = newStock;
      ctx.reply(`✅ Количество наборов обновлено: ${stock}`);
    } else {
      ctx.reply("❌ Введите число");
    }
    adminState[ctx.from.id] = null;
  }

  if (state === "enter_orderId") {
    const orderId = ctx.message.text;
    ctx.reply("✏️ Введите трек-номер:");
    adminState[ctx.from.id] = { step: "enter_tracking", orderId };
  }

  if (state?.step === "enter_tracking") {
    const trackNumber = ctx.message.text;
    const order = orders.find(o => o.id === state.orderId);
    if (order) {
      bot.telegram.sendMessage(order.userId, `📦 Ваш заказ отправлен!\nТрек-номер: ${trackNumber}`);
      ctx.reply(`✅ Трек-номер отправлен пользователю (${order.id})`);
    } else {
      ctx.reply("❌ Заказ не найден");
    }
    adminState[ctx.from.id] = null;
  }
});

module.exports = { bot, orders, stock };
