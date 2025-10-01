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
    successPayment: "✅ Zahlung erhalten!"
  },
  en: {
    askName: "Please enter your full name (First + Last):",
    askAddress: "Please enter your delivery address:",
    askEmail: "Please enter your email:",
    askPhone: "Please enter your phone number in international format (+44...):",
    askPayment: "Choose payment method:",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA Transfer",
    successPayment: "✅ Payment received!"
  },
  ru: {
    askName: "Введите имя и фамилию:",
    askAddress: "Введите адрес доставки:",
    askEmail: "Введите ваш email:",
    askPhone: "Введите ваш телефон в международном формате (+7...):",
    askPayment: "Выберите метод оплаты:",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA-перевод",
    successPayment: "✅ Оплата получена!"
  }
};

module.exports = { translations, formTranslations };
