const { Markup } = require('telegraf');

let ordersRef;
let stockRef;

module.exports = (bot, { orders, stock }) => {
  ordersRef = orders;
  stockRef = stock;

  bot.command('admin', (ctx) => {
    if (ctx.from.id !== parseInt(process.env.ADMIN_ID)) return;

    ctx.reply("👩‍💻 Панель администратора", Markup.keyboard([
      ["📦 Список заказов", "📊 Остаток товара"],
      ["✏️ Изменить количество товара", "🚚 Отправить трек-номер"]
    ]).resize());
  });

  bot.hears("📦 Список заказов", (ctx) => {
    if (ordersRef.length === 0) {
      ctx.reply("ℹ️ Заказов нет");
    } else {
      let list = ordersRef.map(o => `🆔 ${o.id} | ${o.data.name} | ${o.data.price}€`).join("\n");
      ctx.reply(`📋 Заказы:\n\n${list}\n\nОстаток: ${stockRef}`);
    }
  });

  bot.hears("📊 Остаток товара", (ctx) => {
    ctx.reply(`📊 Текущее количество наборов: ${stockRef}`);
  });

  bot.hears("✏️ Изменить количество товара", (ctx) => {
    ctx.reply("✏️ Введите новое количество наборов:");
  });

  bot.hears("🚚 Отправить трек-номер", (ctx) => {
    ctx.reply("📦 Введите ID заказа, а затем трек-номер");
  });
};
