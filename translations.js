const translations = {
  de: {
    welcome: "💎 *Deine Chance auf einen Duft, den man nie vergisst*\n\n✨ *Red Crystal* (ähnlich wie Baccarat Rouge 540) — die Energie des Verlangens in jeder Note.\n\n🌸 *Rive Droite* (ähnlich wie Fleur Narcotic) — Raffinesse und Leichtigkeit für jeden Tag.\n\n🔥 *Nossi* (exklusiv) — ein Duft, der beeindruckt.\n\n🧴 *Im Set enthalten:*\n3 Flakons à 50 ml = 150 ml Hauptdüfte\n\n5 Proben à 3 ml = 15 ml Bonusaromen\n\n***Insgesamt — 8 Düfte für nur €63 statt €600.***\n\n🔐 Nur 20 Sets — sei schnell, bevor sie verschwinden!",
    order: "🛒 Bestellen für 63 €",
    fragrances: "💠 Über die Düfte",
    payment: "💳 Zahlungsbedingungen",
    shipping: "📦 Lieferbedingungen",
    questions: "❓ Fragen"
  },

  en: {
    welcome: "💎 *Your chance to own a fragrance you’ll never forget*\n\n✨ *Red Crystal* (like Baccarat Rouge 540) — the energy of desire in every note.\n\n🌸 *Rive Droite* (like Fleur Narcotic) — elegance and lightness for every day.\n\n🔥 *Nossi* (exclusive) — a fragrance made to impress.\n\n🧴 *Included in the set:*\n3 bottles of 50 ml = 150 ml of main fragrances\n\n5 samples of 3 ml = 15 ml of bonuses\n\n***Total — 8 fragrances for only €63 instead of €600.***\n\n🔐 Only 20 sets — hurry before they’re gone!",
    order: "🛒 Order for €63",
    fragrances: "💠 About the fragrances",
    payment: "💳 Payment terms",
    shipping: "📦 Shipping terms",
    questions: "❓ Questions"
  },

  ru: {
    welcome: "💎 *Твой шанс на аромат, который невозможно забыть*\n\n✨ *Red Crystal* (как Baccarat Rouge 540) — энергия желания в каждой ноте.\n\n🌸 *Rive Droite* (как Fleur Narcotic) — изысканность и лёгкость на каждый день.\n\n🔥 *Nossi* (авторский эксклюзив) — аромат, созданный впечатлять.\n\n🧴 *В наборе:*\n3 флакона по 50 мл = 150 мл основных ароматов\n\n5 пробников по 3 мл = 15 мл бонусов\n\n***Итого — 8 ароматов за €63 вместо €600.***\n\n🔐 Всего 20 наборов — успей, пока они не исчезли!",
    order: "🛒 Заказать за 63 €",
    fragrances: "💠 Об ароматах",
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
    paypalMsg: (price, id) =>
      `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nBitte zahlen Sie und senden Sie einen Screenshot.\n🆔 Bestellung: ${id}`,
    sepaMsg: (price, id) =>
      `🏦 SEPA-Überweisung\nEmpfänger: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nBetrag: ${price} €\nVerwendungszweck: Julii & Aron Bestellung ${price}\n\nBitte zahlen Sie und senden Sie einen Screenshot.\n🆔 Bestellung: ${id}`,
    orderNotFound: "⚠️ Wir haben keine aktive Bestellung von Ihnen gefunden.",
    paymentSent: "✅ Danke! Ihre Zahlungsbestätigung wurde an den Administrator gesendet.",
    paymentConfirmed: "✅ Ihre Zahlung wurde bestätigt. Bitte warten Sie auf die Sendungsverfolgungsnummer.",

    subscribe: "Bitte abonniere unseren Kanal, um den Rabatt zu erhalten 👇",
    subscribeBtn: "📢 Kanal abonnieren",
    checkSub: "✅ Ich habe abonniert",
    buyNoSub: "💰 Ohne Rabatt kaufen (70 €)",
    notSubscribed: "❌ Du bist noch nicht abonniert. Bitte abonniere zuerst den Kanal.",

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
Wenn Sie Fragen zu Ihrer Bestellung oder Lieferung haben — schreiben Sie uns direkt im Chat.`,
    chooseAroma: "💠 Wählen Sie einen Duft, um mehr zu erfahren:",
      aromaRed: `💎 *RED CRYSTAL — Julii & Aron*\n_extrait de parfum_\n\nEs gibt Düfte, die zu Legenden werden – wie Baccarat Rouge 540: kristallklar, ambriert, strahlend. Doch manche empfinden ihn als zu intensiv für den Alltag.\n\nBei Julii & Aron haben wir diese Legende neu interpretiert und *RED CRYSTAL* geschaffen.\nWir haben die DNA des Dufts bewahrt, aber feine Anpassungen vorgenommen:\n\n- den „medizinischen“ Ton entfernt,\n- die Ambra weicher gestaltet,\n- die Basis veredelt.\n\nDas Ergebnis: eine kristallklare Duftspur – sanfter, leichter, doch unverkennbar luxuriös.\n\n💎 Baccarat Rouge 540 kostet heute Hunderte von Euro.\n🔥 Unser *RED CRYSTAL* bietet dasselbe Leuchten – zu einem deutlich zugänglicheren Preis.\n\n_Handgefertigt in Bayern. Konzentration — extrait de parfum._`,

      aromaRive: `🌸 *RIVE DROITE — Julii & Aron*\n_extrait de parfum_\n\nOft wurden wir gefragt: „Kommt dieser leichte, strahlende, saubere Pariser Blumenstrauß?“ — und ja, wir haben ihn erschaffen. Rive Droite fängt die Essenz dieses Dufts ein — klar, elegant und modern.\n\nWas wir getan haben: etwas Süße reduziert, mehr Frische im Auftakt und eine sauberere Basis – damit der Duft heller, reiner und länger anhält.\n\n*Duftpyramide:*\n• Kopf: Bergamotte, Litschi, Weißer Pfirsich\n• Herz: Jasmin Sambac, Pfingstrose, Orangenblüte\n• Basis: Weißer Moschus, transparente Hölzer, Moos\n\n*Klangbild:*\nEin luftiger Blumen-Frucht-Akkord mit weicher Süße und viel Reinheit. Unisex. Tagsüber – ein dezentes Kompliment, abends – ein feiner, gepflegter Duftschleier.\n\n_Handgefertigt in Bayern. Konzentration — extrait de parfum._`,

      aromaNossi: `🔥 *NOSSI — Julii & Aron*\n_extrait de parfum_\n\n*Nossi* ist ein Duft, in den wir nicht nur Erfahrung, sondern Herzblut gelegt haben. Wir suchten lange nach der Balance zwischen fruchtiger Verspieltheit und zarter Blumigkeit, zwischen Frische und Tiefe.\n\n🍐 Saftige Fruchtnoten schenken einen fröhlichen Auftakt.\n🌺 Das Blumenherz entfaltet sich sanft mit einem Hauch von Glanz.\n🌲 Die holzige Basis verleiht Wärme und Geborgenheit.\n\n✨ *Nossi* klingt romantisch und feminin, aber nie aufdringlich. Jung und doch reif im Charme. Vielseitig: leicht am Tag, verführerisch am Abend.\n\n_Handgefertigt in Bayern. Konzentration — extrait de parfum._`,
    back: "🔙 Zurück"
  },

  en: {
    askName: "Please enter your full name (First + Last):",
    askAddress: "Please enter your delivery address:",
    askEmail: "Please enter your email:",
    askPhone: "Please enter your phone number in international format (+44...):",
    askPayment: "Choose payment method:",
    changePayment: "🔄 Change payment method",
    payPaypal: "💳 PayPal",
    paySepa: "🏦 SEPA Transfer",
    errorName: "❌ Name must contain at least 2 words.",
    errorLatinName: "❌ Please use only Latin letters in your name.",
    errorLatinAddress: "❌ Please use only Latin letters and numbers in the address.",
    errorEmail: "❌ Invalid email address.",
    errorPhone: "❌ Invalid phone format. Example: +441234567890",
    paypalMsg: (price, id) =>
      `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nPlease pay and send a screenshot.\n🆔 Order ID: ${id}`,
    sepaMsg: (price, id) =>
      `🏦 SEPA Transfer\nRecipient: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nAmount: ${price} €\nPurpose: Julii & Aron Order ${price}\n\nPlease pay and send a screenshot.\n🆔 Order ID: ${id}`,
    orderNotFound: "⚠️ We couldn't find your active order.",
    paymentSent: "✅ Thank you! Your payment confirmation has been sent.",
    paymentConfirmed: "✅ Your payment has been confirmed. Please wait for the tracking number.",

    subscribe: "Please subscribe to our channel to receive your discount 👇",
    subscribeBtn: "📢 Subscribe to the channel",
    checkSub: "✅ I’ve subscribed",
    buyNoSub: "💰 Buy without discount (€70)",
    notSubscribed: "❌ You are not subscribed yet. Please subscribe first.",

    paymentInfo: `💳 *Payment terms*
We accept payments via:  
- PayPal  
- Bank transfer (SEPA)  

After placing your order, you will receive detailed instructions.  
Payment should be made within 24 hours.`,

    shippingInfo: `🚚 *Delivery Services*
We ship orders with DHL — across Germany and the EU.
- Germany: 1–3 business days  
- EU: 3–8 business days  
💰 Shipping: €4.90 (DE) / €9.90 (EU)
Not subject to VAT.`,

    questionsInfo: `❓ *Questions*
If you have any questions — write to us in chat.`,
    chooseAroma: "💠 Choose a fragrance to learn more:",
      aromaRed: `💎 *RED CRYSTAL — Julii & Aron*\n_extrait de parfum_\n\nThere are scents that become legends — like Baccarat Rouge 540: crystal-clear, amber, radiant. Yet some find it too intense for everyday wear.\n\nAt Julii & Aron, we re-imagined this legend and created *RED CRYSTAL*.\nWe kept its DNA but made subtle refinements:\n\n- removed the “medical” undertone,\n- softened the amber,\n- refined the base.\n\nThe result: a crystal-clear trail — gentler, lighter, yet unmistakably luxurious.\n\n💎 Baccarat Rouge 540 costs hundreds of euros.\n🔥 Our *RED CRYSTAL* offers the same brilliance at a far more approachable price.\n\n_Handcrafted in Bavaria. Concentration — extrait de parfum._`,

      aromaRive: `🌸 *RIVE DROITE — Julii & Aron*\n_extrait de parfum_\n\nWe were often asked, “Is there that radiant, airy Parisian bouquet?” — and yes, we created it. *Rive Droite* captures the essence of that fragrance — fresh, elegant, modern.\n\nWhat we did: reduced sweetness, added freshness on top, and refined the base for a cleaner, longer lasting trail.\n\n*Fragrance Pyramid:*\n• Top: Bergamot, Lychee, White Peach\n• Heart: Jasmine Sambac, Peony, Orange Blossom\n• Base: White Musk, Transparent Woods, Moss\n\n*Aroma Profile:*\nAn airy floral-fruity accord with soft sweetness and purity. Unisex. Day – a delicate compliment, Evening – a refined veil of elegance.\n\n_Handcrafted in Bavaria. Concentration — extrait de parfum._`,

      aromaNossi: `🔥 *NOSSI — Julii & Aron*\n_extrait de parfum_\n\n*Nossi* is a fragrance born of emotion. We sought the perfect balance between playful fruit and gentle floral tones, freshness and depth.\n\n🍐 Juicy fruits bring a cheerful start.\n🌺 A soft floral heart unfolds with a touch of sparkle.\n🌲 Woody base adds warmth and comfort.\n\n✨ Romantic yet not sweet, youthful yet sophisticated. Versatile: light for the day, captivating for the evening.\n\n_Handcrafted in Bavaria. Concentration — extrait de parfum._`,
    back: "🔙 Back"
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
    paypalMsg: (price, id) =>
      `🔗 [${price} € → PayPal](https://www.paypal.com/paypalme/JuliiAron/${price})\n\nПожалуйста, оплатите и отправьте скриншот.\n🆔 Номер заказа: ${id}`,
    sepaMsg: (price, id) =>
      `🏦 SEPA-перевод\nПолучатель: Iuliia Troshina\nIBAN: DE77 7505 0000 0027 9627 45\nBIC: BYLADEM1RBG\nСумма: ${price} €\nНазначение: Julii & Aron Bestellung ${price}\n\nПожалуйста, оплатите и отправьте скриншот.\n🆔 Номер заказа: ${id}`,
    orderNotFound: "⚠️ У нас нет вашего активного заказа.",
    paymentSent: "✅ Спасибо! Ваше подтверждение отправлено администратору.",
    paymentConfirmed: "✅ Ваша оплата подтверждена. Ожидайте трек-номер.",

    subscribe: "Пожалуйста, подпишись на наш канал, чтобы получить скидку 👇",
    subscribeBtn: "📢 Подписаться на канал",
    checkSub: "✅ Я подписался",
    buyNoSub: "💰 Купить без скидки (70 €)",
    notSubscribed: "❌ Вы ещё не подписаны. Подпишитесь, чтобы получить скидку.",

    paymentInfo: `💳 *Условия оплаты*
Мы принимаем оплату через:  
- PayPal  
- Банковский перевод (SEPA)
Оплата должна быть произведена в течение 24 часов.`,

    shippingInfo: `🚚 *Службы доставки*
Мы отправляем заказы с помощью DHL по Германии и ЕС.
- Германия: 1–3 рабочих дня  
- ЕС: 3–8 рабочих дней  
💰 Германия: 4,90 €, ЕС: 9,90 €
Мы не являемся плательщиками НДС.`,

    questionsInfo: `❓ *Вопросы*
Если у вас возникли вопросы — напишите нам прямо в чат.`,
    chooseAroma: "💠 Выберите аромат, чтобы узнать больше:",
      aromaRed: `💎 *RED CRYSTAL — Julii & Aron*\n_extrait de parfum_\n\nЕсть ароматы-легенды. Один из них — Baccarat Rouge 540: кристально-амбровый, сияющий, узнаваемый с первого вздоха. Но для повседневного носа многим он слишком интенсивен.\n\nМы в Julii & Aron вдохновились этой легендой и создали *RED CRYSTAL*.\nСохранили ДНК, но смягчили нотки и очистили базу.\n\n💎 Тот же блеск, та же роскошь — но по доступной цене.\n\n_Сделано вручную в Баварии. Концентрация — extrait de parfum._`,

      aromaRive: `🌸 *RIVE DROITE — Julii & Aron*\n_extrait de parfum_\n\nЛёгкий, сияющий парижский букет с чистым шлейфом. Мы уменьшили сладость, добавили свежести и сделали базу чище.\n\n*Пирамида:*\n• Верх: бергамот, личи, белый персик\n• Сердце: жасмин самбак, пион, апельсиновый цвет\n• База: белый мускус, прозрачные древесные ноты, мох\n\nВоздушный, универсальный аромат для дня и вечера.\n\n_Сделано в Баварии. Концентрация — extrait de parfum._`,

      aromaNossi: `🔥 *NOSSI — Julii & Aron*\n_extrait de parfum_\n\nФруктово-цветочный аромат с древесной базой. Игривый, нежный, но уверенный. Подходит на каждый день и особенные вечера.\n\n_Сделано вручную в Баварии. Концентрация — extrait de parfum._`,
    back: "🔙 Назад"
  }
};

module.exports = { translations, formTranslations };
