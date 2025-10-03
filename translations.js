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
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA-Überweisung",
    errorName: "❌ Der Name muss mindestens aus zwei Wörtern bestehen.",
    errorEmail: "❌ Ungültige E-Mail-Adresse.",
    errorPhone: "❌ Ungültiges Telefonformat. Beispiel: +491234567890",
    paypalMsg: (price, id) => `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nBitte zahlen Sie und senden Sie einen Screenshot.\n🆔 Bestellung: ${id}`,
    sepaMsg: (price, id) => `🏦 SEPA-Überweisung\nEmpfänger: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nBetrag: ${price} €\nVerwendungszweck: Julii & Aron Bestellung ${price}\n\nBitte zahlen Sie und senden Sie einen Screenshot.\n🆔 Bestellung: ${id}`,
    orderNotFound: "⚠️ Wir haben keine aktive Bestellung von Ihnen gefunden.",
    paymentSent: "✅ Danke! Ihre Zahlungsbestätigung wurde an den Administrator gesendet.\nUnser Manager wird sie prüfen und bestätigen.",
    paymentConfirmed: "✅ Ihre Zahlung wurde bestätigt. Bitte warten Sie auf die Sendungsverfolgungsnummer."
  },
  en: {
    askName: "Please enter your full name (First + Last):",
    askAddress: "Please enter your delivery address:",
    askEmail: "Please enter your email:",
    askPhone: "Please enter your phone number in international format (+44...):",
    askPayment: "Choose payment method:",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA Transfer",
    errorName: "❌ Name must contain at least 2 words.",
    errorEmail: "❌ Invalid email address.",
    errorPhone: "❌ Invalid phone format. Example: +441234567890",
    paypalMsg: (price, id) => `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nPlease pay and send a screenshot.\n🆔 Order ID: ${id}`,
    sepaMsg: (price, id) => `🏦 SEPA Transfer\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: ${price} €\nPurpose: Julii & Aron Order ${price}\n\nPlease pay and send a screenshot.\n🆔 Order ID: ${id}`,
    orderNotFound: "⚠️ We couldn't find your active order.",
    paymentSent: "✅ Thank you! Your payment confirmation has been sent to the administrator.\nOur manager will review and confirm it.",
    paymentConfirmed: "✅ Your payment has been confirmed. Please wait for the tracking number."
  },
  ru: {
    askName: "Введите имя и фамилию:",
    askAddress: "Введите адрес доставки:",
    askEmail: "Введите ваш email:",
    askPhone: "Введите ваш телефон в международном формате (+7...):",
    askPayment: "Выберите метод оплаты:",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA-перевод",
    errorName: "❌ Имя должно содержать минимум 2 слова.",
    errorEmail: "❌ Неверный email.",
    errorPhone: "❌ Неверный формат телефона. Пример: +79123456789",
    paypalMsg: (price, id) => `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nПожалуйста, оплатите и отправьте скриншот.\n🆔 Номер заказа: ${id}`,
    sepaMsg: (price, id) => `🏦 SEPA-перевод\nПолучатель: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nСумма: ${price} €\nНазначение: Julii & Aron Bestellung ${price}\n\nПожалуйста, оплатите и отправьте скриншот.\n🆔 Номер заказа: ${id}`,
    orderNotFound: "⚠️ У нас нет вашего активного заказа.",
    paymentSent: "✅ Спасибо! Ваше подтверждение отправлено администратору.\nНаш менеджер проверит его и подтвердит заказ.",
    paymentConfirmed: "✅ Ваша оплата подтверждена. Ожидайте трек-номер отправления."
  }
};

module.exports = { translations, formTranslations };
