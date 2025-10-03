const translations = {
  de: {
    welcome: "💎 Willkommen! Statt 600€ nur 63€...",
    order: "🛒 Bestellen für 63 €",
    payment: "💳 Zahlungsbedingungen",
    shipping: "📦 Lieferbedingungen",
    questions: "❓ Fragen"
  },
  en: {
    welcome: "💎 Welcome! Instead of €600 only €63...",
    order: "🛒 Order for €63",
    payment: "💳 Payment terms",
    shipping: "📦 Shipping terms",
    questions: "❓ Questions"
  },
  ru: {
    welcome: "💎 Добро пожаловать! Вместо 600€ всего 63€...",
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
    errorName: "❌ Der Name muss mindestens 2 Wörter enthalten.",
    errorEmail: "❌ Ungültige E-Mail-Adresse.",
    errorPhone: "❌ Ungültiges Telefonformat. Beispiel: +491234567890",
    noOrderFound: "⚠️ Wir haben keine aktive Bestellung von Ihnen gefunden.",
    paymentConfirmSent: "✅ Danke! Ihre Zahlungsbestätigung wurde an den Administrator gesendet.\nUnser Manager wird sie prüfen und bestätigen.",
    paymentApproved: "✅ Ihre Zahlung wurde bestätigt. Bitte warten Sie auf die Sendungsverfolgungsnummer.",
    paypalMsg: (price, orderId) =>
      `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nBitte führen Sie die Zahlung durch und senden Sie einen Screenshot.\n🆔 Bestellnummer: ${orderId}`,
    sepaMsg: (price, orderId) =>
      `🏦 SEPA-Überweisung\nEmpfänger: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nBetrag: ${price} €\nVerwendungszweck: Julii & Aron Bestellung ${price}\n\nBitte senden Sie einen Screenshot.\n🆔 Bestellnummer: ${orderId}`
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
    errorEmail: "❌ Invalid email.",
    errorPhone: "❌ Invalid phone format. Example: +441234567890",
    noOrderFound: "⚠️ We couldn't find your active order.",
    paymentConfirmSent: "✅ Thank you! Your payment confirmation has been sent to the administrator.\nOur manager will review and confirm it.",
    paymentApproved: "✅ Your payment has been confirmed. Please wait for the tracking number.",
    paypalMsg: (price, orderId) =>
      `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nPlease make the payment and send a screenshot.\n🆔 Order ID: ${orderId}`,
    sepaMsg: (price, orderId) =>
      `🏦 SEPA Transfer\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: ${price} €\nPurpose: Julii & Aron Order ${price}\n\nPlease send a screenshot.\n🆔 Order ID: ${orderId}`
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
    noOrderFound: "⚠️ У нас нет вашего активного заказа.",
    paymentConfirmSent: "✅ Спасибо! Ваше подтверждение отправлено администратору.\nНаш менеджер проверит его и подтвердит заказ.",
    paymentApproved: "✅ Ваша оплата подтверждена. Ожидайте трек-номер отправления.",
    paypalMsg: (price, orderId) =>
      `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nПожалуйста, произведите оплату и отправьте скриншот.\n🆔 Номер заказа: ${orderId}`,
    sepaMsg: (price, orderId) =>
      `🏦 SEPA-перевод\nПолучатель: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nСумма: ${price} €\nНазначение: Julii & Aron Bestellung ${price}\n\nПожалуйста, отправьте скриншот.\n🆔 Номер заказа: ${orderId}`
  }
};

module.exports = { translations, formTranslations };
