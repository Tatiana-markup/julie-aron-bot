const { Telegraf, Markup } = require('telegraf');

let ordersRef;
let stockRef;
let updateStock;
let adminState = {};

const bot = new Telegraf(process.env.BOT_TOKEN);

// ⚙️ Панель администратора
bot.command('admin', (ctx) => {
  if (ctx.from.id !== parseInt(process.env.ADMIN_ID)) return;

  ctx.reply("👩‍💻 Панель администратора", Markup.keyboard([
    ["📦 Список заказов", "📊 Остаток товара"],
    ["✏️ Изменить количество товара", "🚚 Отправить трек-номер"]
  ]).resize());
});

// 📦 Список заказов
bot.hears("📦 Список заказов", (ctx) => {
  if (ordersRef.length === 0) {
    ctx.reply("ℹ️ Заказов нет");
  } else {
    let list = ordersRef
      .map(o => `🆔 ${o.id} | ${o.data.name} | ${o.data.price}€`)
      .join("\n");
    ctx.reply(`📋 Заказы:\n\n${list}\n\n📊 Остаток: ${stockRef()}`);
  }
});

// 📊 Остаток товара
bot.hears("📊 Остаток товара", (ctx) => {
  ctx.reply(`📊 Текущее количество наборов: ${stockRef()}`);
});

// ✏️ Изменить количество товара
bot.hears("✏️ Изменить количество товара", (ctx) => {
  ctx.reply("✏️ Введите новое количество наборов:");
  adminState[ctx.from.id] = "update_stock";
});

// 🚚 Отправить трек-номер
bot.hears("🚚 Отправить трек-номер", (ctx) => {
  ctx.reply("📦 Введите ID заказа:");
  adminState[ctx.from.id] = "enter_orderId";
});

// Обработка вводимого текста в админке
bot.on("text", (ctx) => {
  if (ctx.from.id !== parseInt(process.env.ADMIN_ID)) return;
  const state = adminState[ctx.from.id];

  // Изменение количества
  if (state === "update_stock") {
    const newStock = parseInt(ctx.message.text);
    if (!isNaN(newStock) && newStock >= 0) {
      updateStock(newStock);
      ctx.reply(`✅ Количество наборов обновлено: ${stockRef()}`);
    } else {
      ctx.reply("❌ Введите корректное число");
    }
    adminState[ctx.from.id] = null;
  }

  // Ввод ID заказа
  if (state === "enter_orderId") {
    const orderId = ctx.message.text;
    const order = ordersRef.find(o => o.id === orderId);
    if (!order) {
      ctx.reply("❌ Заказ не найден");
      adminState[ctx.from.id] = null;
      return;
    }
    ctx.reply("✏️ Введите трек-номер:");
    adminState[ctx.from.id] = { step: "enter_tracking", orderId };
  }

  // Ввод трек-номера
  if (state?.step === "enter_tracking") {
    const trackNumber = ctx.message.text;
    const order = ordersRef.find(o => o.id === state.orderId);
    if (order) {
      bot.telegram.sendMessage(
        order.userId,
        `📦 Ваш заказ отправлен!\nТрек-номер: ${trackNumber}`
      );
      ctx.reply(`✅ Трек-номер отправлен пользователю (🆔 ${order.id})`);

      // уменьшаем остаток на 1
      updateStock(stockRef() - 1);
    } else {
      ctx.reply("❌ Заказ не найден");
    }
    adminState[ctx.from.id] = null;
  }
});

bot.init = ({ orders, getStock, setStock }) => {
  ordersRef = orders;
  stockRef = getStock;
  updateStock = setStock;
};

module.exports = bot;
