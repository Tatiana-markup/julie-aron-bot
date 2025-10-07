const translations = {
  de: {
    welcome: "💎 Deine Chance auf einen Duft, den man nie vergisst\n\nStatt €600 — nur €63 für ein Set aus drei luxuriösen Düften:\n\n✨ Red Crystal (ähnlich wie Baccarat Rouge 540) — Energie der Begierde in jeder Note.\n🌸 Rive Droite (ähnlich wie Fleur Narcotic) — Raffinesse und Leichtigkeit für den Alltag.\n🔥 Nossi (exklusiv) — ein Duft, der beeindruckt.\n\nEnthält 150 ml + 15 ml Proben.\n🔐 Nur 20 Sets — Exklusivität, die im Nu verschwindet.",
    order: "🛒 Bestellen für 63 €",
    payment: "💳 Zahlungsbedingungen",
    shipping: "📦 Lieferbedingungen",
    questions: "❓ Fragen"
  },
  en: {
    welcome: "💎 Your chance to own a fragrance you’ll never forget\n\nInstead of €600 — only €63 for a set of three luxury scents:\n\n✨ Red Crystal (like Baccarat Rouge 540) — the energy of desire in every note.\n🌸 Rive Droite (like Fleur Narcotic) — elegance and lightness for every day.\n🔥 Nossi (exclusive) — a fragrance made to impress.\n\nIncludes 150 ml + 15 ml testers.\n🔐 Only 20 sets — exclusivity that vanishes before your eyes.",
    order: "🛒 Order for €63",
    payment: "💳 Payment terms",
    shipping: "📦 Shipping terms",
    questions: "❓ Questions"
  },
  ru: {
    welcome: "💎 Твой шанс на аромат, который невозможно забыть\n\nВместо €600 — всего €63 за набор из трёх роскошных ароматов:\n\n✨ Red Crystal (как Baccarat Rouge 540) — энергия желания в каждой ноте.\n🌸 Rive Droite (как Fleur Narcotic) — изысканность и лёгкость на каждый день.\n🔥 Nossi (эксклюзив) — аромат, созданный впечатлять.\n\nВ комплекте 150 мл + 15 мл пробников.\n🔐 Всего 20 наборов — эксклюзивность, исчезающая на глазах.",
    order: "🛒 Заказать за 63 €",
    payment: "💳 Условия оплаты",
    shipping: "📦 Условия доставки",
    questions: "❓ Вопросы"
  }
};

const formTranslations = {
  de: {
    askName: "Bitte geben Sie Ihren vollständigen Namen ein (Vorname + Nachname):",
    askAddress: "Bitte geben Sie Ihre Lieferadresse ein:",
    askEmail: "Bitte geben Sie Ihre E-Mail-Adresse ein:",
    askPhone: "Bitte geben Sie Ihre Telefonnummer im internationalen Format ein (+49...):",
    askPayment: "Wählen Sie die Zahlungsmethode:",
    changePayment: "🔄 Zahlungsart ändern",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA-Überweisung",
    errorName: "❌ Der Name muss mindestens aus zwei Wörtern bestehen.",
    errorLatinName: "❌ Bitte verwenden Sie nur lateinische Buchstaben im Namen.",
    errorLatinAddress: "❌ Bitte verwenden Sie nur lateinische Buchstaben und Zahlen in der Adresse.",
    errorEmail: "❌ Ungültige E-Mail-Adresse.",
    errorPhone: "❌ Ungültiges Telefonformat. Beispiel: +491234567890",
    paypalMsg: (price, id) => `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nBitte zahlen Sie und senden Sie einen Screenshot.\n🆔 Bestellung: ${id}`,
    sepaMsg: (price, id) => `🏦 SEPA-Überweisung\nEmpfänger: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nBetrag: ${price} €\nVerwendungszweck: Julii & Aron Bestellung ${price}\n\nBitte zahlen Sie und senden Sie einen Screenshot.\n🆔 Bestellung: ${id}`,
    orderNotFound: "⚠️ Wir haben keine aktive Bestellung von Ihnen gefunden.",
    paymentSent: "✅ Danke! Ihre Zahlungsbestätigung wurde an den Administrator gesendet.\nUnser Manager wird sie prüfen und bestätigen.",
    paymentConfirmed: "✅ Ihre Zahlung wurde bestätigt. Bitte warten Sie auf die Sendungsverfolgungsnummer.",

    // 🆕 Переклади для підписки
    subscribe: "Bitte abonniere unseren Kanal, um den Rabatt zu erhalten 👇",
    subscribeBtn: "📢 Kanal abonnieren",
    checkSub: "✅ Ich habe abonniert",
    buyNoSub: "💰 Ohne Rabatt kaufen (70 €)",
    notSubscribed: "❌ Du bist noch nicht abonniert. Bitte abonniere zuerst den Kanal, um den Rabatt zu erhalten.",

    paymentInfo: `💳 *Zahlungsbedingungen*
Wir akzeptieren Zahlungen über:  
- PayPal  
- Banküberweisung (SEPA)  

Nach der Bestellung erhalten Sie alle Anweisungen.  
Die Zahlung muss innerhalb von 24 Stunden erfolgen.`,

    shippingInfo: `🚚 *Lieferdienste*
Wir versenden Bestellungen mit DHL — innerhalb Deutschlands und in die Länder der Europäischen Union.

⏱ *Lieferzeiten*
- Deutschland: 1–3 Werktage  
- EU-Länder: 3–8 Werktage  

💰 *Versandkosten*
- Innerhalb Deutschlands: 4,90 €  
- EU-Länder: 9,90 € Pauschalbetrag.  
Wir sind nicht umsatzsteuerpflichtig.

📦 *Sendungsverfolgung*
Nach dem Versand erhalten Sie eine Bestätigung mit Sendungsnummer und Link.

⚠️ *Mögliche Verzögerungen*
An Feiertagen oder bei hoher Auslastung der Lieferdienste kann es zu Verzögerungen kommen.`,

    questionsInfo: `❓ *Fragen*
Wenn Sie Fragen zu Ihrer Bestellung oder Lieferung haben — schreiben Sie uns direkt im Chat und wir antworten so schnell wie möglich.`
  },

  en: {
    askName: "Please enter your full name (First + Last):",
    askAddress: "Please enter your delivery address:",
    askEmail: "Please enter your email:",
    askPhone: "Please enter your phone number in international format (+49...):",
    askPayment: "Choose payment method:",
    changePayment: "🔄 Change payment method",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA Transfer",
    errorName: "❌ Name must contain at least 2 words.",
    errorLatinName: "❌ Please use only Latin letters in your name.",
    errorLatinAddress: "❌ Please use only Latin letters and numbers in the address.",
    errorEmail: "❌ Invalid email address.",
    errorPhone: "❌ Invalid phone format. Example: +491234567890",
    paypalMsg: (price, id) => `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nPlease pay and send a screenshot.\n🆔 Order ID: ${id}`,
    sepaMsg: (price, id) => `🏦 SEPA Transfer\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: ${price} €\nPurpose: Julii & Aron Order ${price}\n\nPlease pay and send a screenshot.\n🆔 Order ID: ${id}`,
    orderNotFound: "⚠️ We couldn't find your active order.",
    paymentSent: "✅ Thank you! Your payment confirmation has been sent to the administrator.\nOur manager will review and confirm it.",
    paymentConfirmed: "✅ Your payment has been confirmed. Please wait for the tracking number.",

    // 🆕 Переклади для підписки
    subscribe: "Please subscribe to our channel to receive your discount 👇",
    subscribeBtn: "📢 Subscribe to the channel",
    checkSub: "✅ I’ve subscribed",
    buyNoSub: "💰 Buy without discount (€70)",
    notSubscribed: "❌ You are not subscribed yet. Please subscribe first to get the discount.",

    paymentInfo: `💳 *Payment terms*
We accept payments via:  
- PayPal  
- Bank transfer (SEPA)  

After placing your order, you will receive detailed instructions.  
Payment should be made within 24 hours.`,

    shippingInfo: `🚚 *Delivery Services*
We ship orders with DHL — across Germany and to the European Union.

⏱ *Delivery times*
- Germany: 1–3 business days  
- EU countries: 3–8 business days  

💰 *Shipping costs*
- Within Germany: €4.90  
- EU countries: €9.90 flat rate.  
We are not subject to VAT.

📦 *Order tracking*
After shipping, you will receive a confirmation with a tracking number and link.

⚠️ *Possible delays*
During holidays or peak periods, delivery services may experience delays.`,

    questionsInfo: `❓ *Questions*
If you have any questions about your order or delivery — write to us in chat and we’ll respond as soon as possible.`
  },

  ru: {
    askName: "Введите имя и фамилию:",
    askAddress: "Введите адрес доставки:",
    askEmail: "Введите ваш email:",
    askPhone: "Введите ваш телефон в международном формате (+49...):",
    askPayment: "Выберите метод оплаты:",
    changePayment: "🔄 Изменить способ оплаты",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA-перевод",
    errorName: "❌ Имя должно содержать минимум 2 слова.",
    errorLatinName: "❌ Пожалуйста, используйте только латинские буквы в имени.",
    errorLatinAddress: "❌ Пожалуйста, используйте только латинские буквы и цифры в адресе.",
    errorEmail: "❌ Неверный email.",
    errorPhone: "❌ Неверный формат телефона. Пример: +49123456789",
    paypalMsg: (price, id) => `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nПожалуйста, оплатите и отправьте скриншот.\n🆔 Номер заказа: ${id}`,
    sepaMsg: (price, id) => `🏦 SEPA-перевод\nПолучатель: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nСумма: ${price} €\nНазначение: Julii & Aron Bestellung ${price}\n\nПожалуйста, оплатите и отправьте скриншот.\n🆔 Номер заказа: ${id}`,
    orderNotFound: "⚠️ У нас нет вашего активного заказа.",
    paymentSent: "✅ Спасибо! Ваше подтверждение отправлено администратору.\nНаш менеджер проверит его и подтвердит заказ.",
    paymentConfirmed: "✅ Ваша оплата подтверждена. Ожидайте трек-номер отправления.",

    // 🆕 Переклади для підписки
    subscribe: "Пожалуйста, подпишись на наш канал, чтобы получить скидку 👇",
    subscribeBtn: "📢 Подписаться на канал",
    checkSub: "✅ Я подписался",
    buyNoSub: "💰 Купить без скидки (70 €)",
    notSubscribed: "❌ Вы ещё не подписаны. Пожалуйста, подпишитесь, чтобы получить скидку.",

    paymentInfo: `💳 *Условия оплаты*
Мы принимаем оплату двумя способами:  
- PayPal  
- Банковский перевод (SEPA)  

После оформления заказа вы получите все инструкции.  
Оплата должна быть произведена в течение 24 часов.`,

    shippingInfo: `🚚 *Службы доставки*
Мы отправляем заказы с помощью DHL — по всей Германии и в страны Европейского Союза.

⏱ *Сроки доставки*
- Германия: 1–3 рабочих дня  
- Страны ЕС: 3–8 рабочих дней  

💰 *Стоимость доставки*
- Германия: 4,90 €  
- Страны ЕС: 9,90 € фиксированная ставка.  
Мы не являемся плательщиками НДС.

📦 *Отслеживание заказа*
После отправки вы получите подтверждение с трек-номером и ссылкой для отслеживания.

⚠️ *Возможные задержки*
В праздничные дни или при высокой нагрузке на службы доставки возможны задержки.`,

    questionsInfo: `❓ *Вопросы*
Если у вас возникли вопросы по заказу или доставке — напишите нам прямо в чат, и мы ответим в ближайшее время.`
  }
};

module.exports = { translations, formTranslations };
