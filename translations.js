const translations = {
  de: {
    welcome: `
💎 *Deine Chance auf einen Duft, den man nie vergisst*

Statt *600 €* — nur *63 €* für ein Set aus drei luxuriösen Düften:

✨ *Red Crystal* (wie Baccarat Rouge 540) — die Energie der Begierde in jeder Note.  
🌸 *Rive Droite* (wie Fleur Narcotic) — Eleganz und Leichtigkeit für jeden Tag.  
🔥 *Nossi* (exklusives Parfum) — ein Duft, der beeindruckt.  

Im Set: *150 ml + 15 ml Proben*.  
🔐 Nur *20 Sets* — Exklusivität, die im Nu verschwindet.
    `,
    order: '🛒 Bestellen für 63 €',
    payment: '💳 Zahlungsbedingungen',
    shipping: '📦 Lieferbedingungen',
    questions: '❓ Fragen'
  },
  en: {
    welcome: `
💎 *Your chance to own an unforgettable fragrance*

Instead of *€600* — only *€63* for a set of three luxurious scents:

✨ *Red Crystal* (like Baccarat Rouge 540) — the energy of desire in every note.  
🌸 *Rive Droite* (like Fleur Narcotic) — elegance and lightness for every day.  
🔥 *Nossi* (exclusive creation) — a fragrance designed to impress.  

Includes *150 ml + 15 ml testers*.  
🔐 Only *20 sets* — exclusivity that disappears before your eyes.
    `,
    order: '🛒 Order for €63',
    payment: '💳 Payment terms',
    shipping: '📦 Shipping terms',
    questions: '❓ Questions'
  },
  ru: {
    welcome: `
💎 *Твой шанс на аромат, который невозможно забыть*

Вместо *600 €* — всего *63 €* за набор из трёх роскошных ароматов:

✨ *Red Crystal* (как Baccarat Rouge 540) — энергия желания в каждой ноте.  
🌸 *Rive Droite* (как Fleur Narcotic) — утончённость и лёгкость на каждый день.  
🔥 *Nossi* (авторский эксклюзив) — аромат, созданный поражать.  

В комплекте: *150 мл + 15 мл пробников*.  
🔐 Всего *20 наборов* — эксклюзивность, исчезающая на глазах.
    `,
    order: '🛒 Заказать за 63 €',
    payment: '💳 Условия оплаты',
    shipping: '📦 Условия доставки',
    questions: '❓ Вопросы'
  }
};

const formTranslations = {
  de: {
    subscribe: '👉 Abonniere den Kanal, um 10% Rabatt zu erhalten und das Set für 63 € zu bekommen',
    subscribeBtn: '🔔 Abonnieren',
    checkSub: '✅ Ich habe abonniert',
    notSubscribed: '❌ Sie haben den Kanal noch nicht abonniert. Bitte zuerst abonnieren 👆',
    buyNoSub: '💳 Ohne Abo für 70 € kaufen',
    askName: 'Bitte geben Sie Ihren vollständigen Namen ein (Vorname + Nachname):',
    askAddress: 'Bitte geben Sie Ihre Lieferadresse ein:',
    askEmail: 'Bitte geben Sie Ihre E-Mail-Adresse ein:',
    askPhone: 'Bitte geben Sie Ihre Telefonnummer im internationalen Format ein (+4...):',
    askPayment: 'Wählen Sie die Zahlungsmethode:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-Überweisung',
    errorName: '❌ Name muss mindestens 2 Wörter enthalten.',
    errorEmail: '❌ Ungültige E-Mail-Adresse.',
    errorPhone: '❌ Ungültiges Telefonformat. Beispiel: +491234567890',
    paypalMsg: (price, link, id) =>
      `🔗 [${price} € → PayPal](${link})\n\nBitte führen Sie die Zahlung durch und senden Sie einen Screenshot.\n🆔 Bestellnummer: ${id}`,
    sepaMsg: (price, id) =>
      `🏦 SEPA-Überweisung\n\nEmpfänger: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nBetrag: ${price} €\nVerwendungszweck: Julii & Aron Bestellung ${price}\n\nBitte senden Sie einen Screenshot.\n🆔 Bestellnummer: ${id}`
  },
  en: {
    subscribe: '👉 Subscribe to the channel to get 10% off and grab the set for €63',
    subscribeBtn: '🔔 Subscribe',
    checkSub: '✅ I subscribed',
    notSubscribed: '❌ You are not subscribed yet. Please subscribe first 👆',
    buyNoSub: '💳 Buy without subscription for €70',
    askName: 'Please enter your full name (First + Last):',
    askAddress: 'Please enter your delivery address:',
    askEmail: 'Please enter your email:',
    askPhone: 'Please enter your phone number in international format (+4...):',
    askPayment: 'Choose payment method:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA Transfer',
    errorName: '❌ Name must contain at least 2 words.',
    errorEmail: '❌ Invalid email address.',
    errorPhone: '❌ Invalid phone format. Example: +491234567890',
    paypalMsg: (price, link, id) =>
      `🔗 [${price} € → PayPal](${link})\n\nPlease make the payment and send a screenshot.\n🆔 Order ID: ${id}`,
    sepaMsg: (price, id) =>
      `🏦 SEPA Transfer\n\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: ${price} €\nPurpose: Julii & Aron Order ${price}\n\nPlease send a screenshot.\n🆔 Order ID: ${id}`
  },
  ru: {
    subscribe: '👉 Подпишитесь на канал, чтобы получить скидку 10% и забрать набор за 63 €',
    subscribeBtn: '🔔 Подписаться',
    checkSub: '✅ Я подписался',
    notSubscribed: '❌ Вы ещё не подписаны. Пожалуйста, подпишитесь 👆',
    buyNoSub: '💳 Купить без подписки за 70 €',
    askName: 'Введите имя и фамилию:',
    askAddress: 'Введите адрес доставки:',
    askEmail: 'Введите ваш email:',
    askPhone: 'Введите ваш телефон в международном формате (+4...):',
    askPayment: 'Выберите метод оплаты:',
    payPaypal: '💳 PayPal',
    paySepa: '🏦 SEPA-перевод',
    errorName: '❌ Имя должно содержать минимум 2 слова.',
    errorEmail: '❌ Неверный email.',
    errorPhone: '❌ Неверный формат телефона. Пример: +491234567890',
    paypalMsg: (price, link, id) =>
      `🔗 [${price} € → PayPal](${link})\n\nПожалуйста, произведите оплату и отправьте скриншот.\n🆔 Номер заказа: ${id}`,
    sepaMsg: (price, id) =>
      `🏦 SEPA-перевод\n\nПолучатель: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nСумма: ${price} €\nНазначение: Julii & Aron Bestellung ${price}\n\nПожалуйста, отправьте скриншот.\n🆔 Номер заказа: ${id}`
  }
};

module.exports = { translations, formTranslations };
