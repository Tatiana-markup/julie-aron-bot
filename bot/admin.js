module.exports = function setupAdminHandlers(bot, { orders, adminState, ADMIN_ID, stockRef, setStock }) {
  
  bot.hears("📦 Список заказов", (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    if (orders.length === 0) return ctx.reply("ℹ️ Заказов нет");
    let list = orders.map(o => `🆔 ${o.id} | ${o.data.name} | ${o.data.price}€`).join("\n");
    ctx.reply(`📋 Заказы:\n\n${list}\n\nОстаток: ${stockRef()}`);
  });

  bot.hears("✏️ Изменить количество товара", (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    ctx.reply("✏️ Введите новое количество наборов:");
    adminState[ctx.from.id] = "update_stock";
  });

  bot.hears("📊 Остаток товара", (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    ctx.reply(`📦 Остаток: ${stockRef()}`);
  });

  bot.hears("🚚 Отправить трек-номер", (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    ctx.reply("📦 Введите ID заказа:");
    adminState[ctx.from.id] = "enter_orderId";
  });

  bot.on("text", (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const state = adminState[ctx.from.id];

    if (state === "update_stock") {
      const newStock = parseInt(ctx.message.text);
      if (!isNaN(newStock) && newStock >= 0) {
        setStock(newStock);
        ctx.reply(`✅ Количество наборов обновлено: ${stockRef()}`);
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
        ctx.reply(`✅ Трек-номер отправлен (${order.id})`);
      } else {
        ctx.reply("❌ Заказ не найден");
      }
      adminState[ctx.from.id] = null;
    }
  });
};
