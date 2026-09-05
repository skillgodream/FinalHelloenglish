import { Question } from '../types';

export const PRACTICE_QUESTIONS: Question[] = [
// =========================================================================
  // 1. WORKPLACE (Workplace, Shifts, Logistics, Supervisors, Duties)
  // =========================================================================
  // Level 1: Short Words
  {
    id: 'wp-l1-what-is-time',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'What is the time right now?',
    questionHi: 'अभी क्या समय हुआ है?',
    hintEn: 'Say: "It is 2:30 PM" or "Shift starts at 9 o\'clock."',
    hintHi: 'समय बताएं: "अभी 2:30 बजे हैं" या "शिफ्ट 9 बजे शुरू होगी।"',
    level: 'Level 1',
    samplePhrases: [
      'It is 3 o\'clock now.',
      'Current time is 4:15 PM.',
      'It is half past two.'
    ],
    sampleLearnerSpoken: 'Time is now 3 PM sir.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'clock'
  },
  {
    id: 'wp-l1-where-is-parcel',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Where is the customer parcel?',
    questionHi: 'ग्राहक का पार्सल कहाँ है?',
    hintEn: 'Say: "It is on shelf number 3" or "Inside the delivery bag."',
    hintHi: 'स्थान बताएं: "यह शेल्फ नंबर 3 पर है" या "डिलीवरी बैग में है।"',
    level: 'Level 1',
    samplePhrases: [
      'It is in my delivery bag.',
      'Placed on rack B near the gate.',
      'Parcel is at reception desk.'
    ],
    sampleLearnerSpoken: 'Parcel is inside my bag sir.',
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'package'
  },
  {
    id: 'wp-l1-is-task-done',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Is your packing task completed?',
    questionHi: 'क्या आपकी पैकिंग का काम पूरा हो गया है?',
    hintEn: 'Say: "Yes sir, all 20 boxes are packed!" or "Almost done, 5 minutes more."',
    hintHi: 'कहें: "हाँ सर, सभी 20 बॉक्स पैक हैं!" या "बस 5 मिनट में पूरा होगा।"',
    level: 'Level 1',
    samplePhrases: [
      'Yes sir, packing is finished.',
      'Almost done, 5 boxes left.',
      'All orders ready for dispatch.'
    ],
    sampleLearnerSpoken: 'Yes sir, packing done 100 percent.',
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'check'
  },
  {
    id: 'wp-l1-who-is-supervisor',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Who is the supervisor on duty today?',
    questionHi: 'आज ड्यूटी पर सुपरवाइजर कौन हैं?',
    hintEn: 'Say: "Mr. Sharma is managing today\'s morning shift."',
    hintHi: 'बताएं: "आज सुबह की शिफ्ट मिस्टर शर्मा देख रहे हैं।"',
    level: 'Level 1',
    samplePhrases: [
      'Sir Sharma is on duty.',
      'Supervisor Rajesh is in warehouse.',
      'Madam Priya is shift manager today.'
    ],
    sampleLearnerSpoken: 'Rajesh sir is shift manager today.',
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'user-check'
  },

  // Level 2: Little More Words (Sentences)
  {
    id: 'wp-l2-where-were-you-yesterday',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Where were you yesterday during the evening shift?',
    questionHi: 'आप कल शाम की शिफ्ट के दौरान कहाँ थे?',
    hintEn: 'Explain clearly: "I was unwell yesterday and had informed the shift lead."',
    hintHi: 'स्पष्ट कारण बताएं: "कल मेरी तबीयत ठीक नहीं थी और मैंने टीम को सूचित किया था।"',
    level: 'Level 2',
    samplePhrases: [
      'Sir, I had a doctor appointment yesterday.',
      'I was on approved sick leave yesterday.',
      'My bike had a breakdown on highway yesterday.'
    ],
    sampleLearnerSpoken: 'Yesterday I have fever so not came shift.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'help-circle'
  },
  {
    id: 'wp-l2-why-late-shift',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Why were you late for your shift this morning?',
    questionHi: 'आज सुबह आप अपनी शिफ्ट के लिए लेट क्यों हुए?',
    hintEn: 'Apologize politely: "Sorry sir, there was heavy traffic due to rain."',
    hintHi: 'विनम्रता से कारण बताएं: "माफ कीजिए सर, बारिश के कारण भारी ट्रैफिक था।"',
    level: 'Level 2',
    samplePhrases: [
      'Sorry sir, there was huge traffic jam.',
      'My bus got delayed due to heavy rain.',
      'Bike tyre got punctured on the way.'
    ],
    sampleLearnerSpoken: 'Sorry sir, heavy traffic road so 15 min late.',
    cardColor: 'from-[#FDF0F6] to-[#FCE1EE]',
    iconType: 'clock'
  },
  {
    id: 'wp-l2-ask-help-machine',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'How would you ask your senior colleague to teach you how to use this barcode scanner?',
    questionHi: 'आप अपने सीनियर सहकर्मी से इस बारकोड स्कैनर का उपयोग सिखाने का अनुरोध कैसे करेंगे?',
    hintEn: 'Ask politely: "Could you please show me how this scanner works?"',
    hintHi: 'विनम्रता से पूछें: "क्या आप कृपया मुझे दिखा सकते हैं कि यह स्कैनर कैसे काम करता है?"',
    level: 'Level 2',
    samplePhrases: [
      'Bhaiya, can you please show me scanner steps once?',
      'Could you demonstrate how to scan parcels?',
      'I am new to this machine, please help me.'
    ],
    sampleLearnerSpoken: 'Sir please teach me barcode machine one time.',
    cardColor: 'from-[#EBF3FF] to-[#DBE8FD]',
    iconType: 'help-circle'
  },
  {
    id: 'wp-l2-shift-handover',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'How would you explain the pending tasks to the colleague taking over your next shift?',
    questionHi: 'अगली शिफ्ट संभालने वाले अपने साथी को आप बचे हुए काम कैसे समझाएंगे?',
    hintEn: 'Explain clearly: "Rack A is completed, Rack B needs barcode scanning."',
    hintHi: 'स्पष्ट बताएं: "रैक A पूरा हो गया है, रैक B की स्कैनिंग बाकी है।"',
    level: 'Level 2',
    samplePhrases: [
      'I finished 50 orders, 10 orders pending for invoice.',
      'Rack A is done, please complete rack B scanning.',
      'All urgent packages are dispatched already.'
    ],
    sampleLearnerSpoken: 'Rack 1 finished, you please scan rack 2.',
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'repeat'
  },

  // Level 3: Hard - Scenarios ("What will you do if this happens?")
  {
    id: 'wp-l3-damaged-parcel-scenario',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you do if a customer parcel arrives heavily torn and leaking oil or liquid?',
    questionHi: 'अगर कोई ग्राहक पार्सल बुरी तरह फटा हुआ और उसमें से लिक्विड लीक होता हुआ मिले, तो आप क्या करेंगे?',
    hintEn: 'Explain: Take photos, inform supervisor, mark as damaged in system, and do not dispatch.',
    hintHi: 'समझाएं: फोटो खींचेंगे, सुपरवाइजर को बताएंगे, सिस्टम में डैमेज मार्क करेंगे और आगे नहीं भेजेंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will take photos and report to supervisor immediately.',
      'I will hold the parcel and raise a damaged ticket.',
      'I will not deliver it and inform customer care.'
    ],
    sampleLearnerSpoken: 'I take photo of broken box and call supervisor not deliver.',
    cardColor: 'from-[#FFE4E6] to-[#FECDD3]',
    iconType: 'alert-triangle'
  },
  {
    id: 'wp-l3-bike-breakdown-delivery',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you do if your delivery bike gets a flat tyre during an urgent express parcel delivery?',
    questionHi: 'अगर एक जरूरी पार्सल डिलीवरी के दौरान आपकी बाइक का टायर पंक्चर हो जाए, तो आप क्या करेंगे?',
    hintEn: 'State actions: Call rider support for reassignment or find nearest mechanic quickly.',
    hintHi: 'कदम बताएं: सपोर्ट टीम को कॉल करके पार्सल री-असाइन कराएंगे या तुरंत मैकेनिक ढूंढेंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will immediately inform team lead and call rider support.',
      'I will request reassignment so customer gets it on time.',
      'I will find a nearby puncture shop within 10 minutes.'
    ],
    sampleLearnerSpoken: 'I call support center to send another rider for urgent box.',
    cardColor: 'from-[#E8F8F2] to-[#D5F3E8]',
    iconType: 'navigation'
  },
  {
    id: 'wp-l3-unallowed-discount-request',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you say if a store customer firmly demands an extra discount that is not allowed by policy?',
    questionHi: 'अगर कोई ग्राहक दुकान में ऐसा एक्स्ट्रा डिस्काउंट मांगता है जो पॉलिसी के खिलाफ है, तो आप उसे क्या समझाएंगे?',
    hintEn: 'Politely explain company policy and offer existing available coupon offers.',
    hintHi: 'विनम्रता से कंपनी पॉलिसी समझाएं और उपलब्ध अन्य ऑफर्स की जानकारी दें।',
    level: 'Level 3',
    samplePhrases: [
      'Sir, our prices are fixed, but you can use this 5% app coupon.',
      'I understand sir, but company system does not permit extra discount.',
      'I am really sorry sir, billing software automatically locks final prices.'
    ],
    sampleLearnerSpoken: 'Sir company policy not allow manual discount, sorry for inconvenience.',
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'help-circle'
  },
  {
    id: 'wp-l3-two-urgent-tasks',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you do if two different supervisors give you two urgent tasks at the exact same time?',
    questionHi: 'अगर दो अलग-अलग सुपरवाइजर आपको एक ही समय में दो जरूरी काम दे दें, तो आप क्या करेंगे?',
    hintEn: 'Explain: Inform both supervisors transparently and ask which task to complete first.',
    hintHi: 'समझाएं: दोनों सुपरवाइजरों को स्पष्ट बताएंगे और पूछेंगे कि पहले किसे पूरा करना है।',
    level: 'Level 3',
    samplePhrases: [
      'Sir, supervisor Amit gave me dispatch packing, which task is top priority?',
      'I will inform both supervisors so they can decide priority.',
      'I can complete task A in 15 minutes, then start task B.'
    ],
    sampleLearnerSpoken: 'I tell both managers and ask which job first I should finish.',
    cardColor: 'from-[#FFEBEF] to-[#FFD8E3]',
    iconType: 'repeat'
  },

  // =========================================================================
  // 2. DAILY ROUTINE (Commute, Shopping, Appointments, Orders, Travel)
  // =========================================================================
  // Level 1: Short Words
  {
    id: 'dr-l1-are-you-coming',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'Are you coming today?',
    questionHi: 'क्या आप आज आ रहे हैं?',
    hintEn: 'Say: "Yes, I am coming in 10 minutes" or "No, I am on leave today."',
    hintHi: 'सरल उत्तर दें: "हाँ, मैं 10 मिनट में आ रहा हूँ" या "नहीं, मैं आज नहीं आ रहा।"',
    level: 'Level 1',
    samplePhrases: [
      'Yes, I am coming right now.',
      'Yes, reaching in 5 minutes.',
      'Sorry, I cannot come today.'
    ],
    sampleLearnerSpoken: 'Yes I am coming 10 minutes.',
    cardColor: 'from-[#FFF0F0] to-[#FFE0E0]',
    iconType: 'clock'
  },
  {
    id: 'dr-l1-where-are-you-going',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'Where are you going right now?',
    questionHi: 'आप अभी कहाँ जा रहे हैं?',
    hintEn: 'Say: "I am going to the market" or "I am heading home."',
    hintHi: 'बताएं: "मैं बाजार जा रहा हूँ" या "मैं घर जा रहा हूँ।"',
    level: 'Level 1',
    samplePhrases: [
      'I am going for delivery now.',
      'Heading to the tea stall.',
      'Going home after my shift.'
    ],
    sampleLearnerSpoken: 'I go to market now.',
    cardColor: 'from-[#E8F8F2] to-[#D5F3E8]',
    iconType: 'navigation'
  },
  {
    id: 'dr-l1-what-time-bus',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'What time is the next bus arriving?',
    questionHi: 'अगली बस कितने बजे आ रही है?',
    hintEn: 'Say: "The next bus is in 10 minutes" or "Bus number 201 arrives at 5 PM."',
    hintHi: 'बताएं: "अगली बस 10 मिनट में है" या "बस नंबर 201 शाम 5 बजे आएगी।"',
    level: 'Level 1',
    samplePhrases: [
      'Next bus is in 10 minutes.',
      'Bus arrives at 5:30 PM.',
      'It comes every 15 minutes.'
    ],
    sampleLearnerSpoken: 'Bus coming in 10 minutes bhaiya.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'clock'
  },
  {
    id: 'dr-l1-how-much-tea',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How much for this cup of tea and biscuit?',
    questionHi: 'इस चाय और बिस्कुट के कितने रुपये हुए?',
    hintEn: 'Say: "It is 15 rupees in total. Do you accept UPI?"',
    hintHi: 'पूछें: "कुल 15 रुपये हुए। क्या आप यूपीआई लेते हैं?"',
    level: 'Level 1',
    samplePhrases: [
      'Total is 15 rupees.',
      '20 rupees for tea and snack.',
      'Can I pay via PhonePe QR code?'
    ],
    sampleLearnerSpoken: 'How much for tea, 10 rupees?',
    cardColor: 'from-[#FFEDD5] to-[#FED7AA]',
    iconType: 'coffee'
  },

  // Level 2: Little More Words (Sentences)
  {
    id: 'dr-l2-send-delivery-address',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'Can you please send me your exact delivery address and landmark?',
    questionHi: 'क्या आप कृपया मुझे अपना सही डिलीवरी पता और लैंडमार्क भेज सकते हैं?',
    hintEn: 'Request politely: "Sir, please share your building name and flat number on WhatsApp."',
    hintHi: 'अनुरोध करें: "सर, कृपया अपनी बिल्डिंग का नाम और फ्लैट नंबर भेजें।"',
    level: 'Level 2',
    samplePhrases: [
      'Please send flat number and nearby landmark.',
      'Could you share your live location on WhatsApp?',
      'I am near the gate, which tower is yours?'
    ],
    sampleLearnerSpoken: 'Sir please send WhatsApp location and house number.',
    cardColor: 'from-[#E8F8F2] to-[#D5F3E8]',
    iconType: 'map-pin'
  },
  {
    id: 'dr-l2-how-much-bill',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How much is the total bill for these grocery items?',
    questionHi: 'इन किराना सामान का कुल बिल कितना हुआ?',
    hintEn: 'State total & payment method: "The total is 450 rupees. You can pay by UPI or cash."',
    hintHi: 'कुल राशि बताएं: "कुल 450 रुपये हुए। आप यूपीआई या कैश से भुगतान कर सकते हैं।"',
    level: 'Level 2',
    samplePhrases: [
      'Total amount is 450 rupees sir.',
      'It comes to 320 rupees, UPI QR code is here.',
      'After discount, total is 500 rupees.'
    ],
    sampleLearnerSpoken: 'Total bill 450 rupees, you can do GPay.',
    cardColor: 'from-[#FFF6D6] to-[#FFECA8]',
    iconType: 'help-circle'
  },
  {
    id: 'dr-l2-daily-commute',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How do you travel to work every day, and how long does it take?',
    questionHi: 'आप रोज़ काम पर कैसे जाते हैं, और इसमें कितना समय लगता है?',
    hintEn: 'Mention your transport (bike, bus, metro) and time in minutes or hours.',
    hintHi: 'अपने वाहन (बाइक, बस, मेट्रो) और लगने वाले समय (मिनट/घंटे) का उल्लेख करें।',
    level: 'Level 2',
    samplePhrases: [
      'I go by metro, takes 30 minutes every morning.',
      'Daily I ride my bike, about 45 minutes in traffic.',
      'Bus takes one hour from my home to the hub.'
    ],
    sampleLearnerSpoken: 'Daily I go on bike, taking 45 minutes in traffic.',
    cardColor: 'from-[#FDF2F8] to-[#FCE7F3]',
    iconType: 'navigation'
  },
  {
    id: 'dr-l2-doctor-appointment',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How would you ask the clinic receptionist for a doctor appointment this evening?',
    questionHi: 'आप क्लिनिक के रिसेप्शनिस्ट से आज शाम के डॉक्टर अपॉइंटमेंट के लिए कैसे पूछेंगे?',
    hintEn: 'Ask politely: "Hello, is Dr. Verma available for consultation at 6 PM today?"',
    hintHi: 'पूछें: "नमस्ते, क्या डॉक्टर आज शाम 6 बजे उपलब्ध हैं?"',
    level: 'Level 2',
    samplePhrases: [
      'Hello, can I book an appointment for fever checkup?',
      'Is the doctor available between 6 and 8 PM?',
      'I need a token for general physician consultation.'
    ],
    sampleLearnerSpoken: 'Hello sister, I want doctor token for evening 6 PM.',
    cardColor: 'from-[#EFF6FF] to-[#DBEAFE]',
    iconType: 'calendar'
  },

  // Level 3: Hard - Scenarios ("What will you do if this happens?")
  {
    id: 'dr-l3-angry-delayed-customer',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine Scenarios',
    categoryHindi: 'दैनिक ग्राहक स्थितियां',
    questionEn: 'What will you tell an angry customer whose food delivery order is 25 minutes late because of heavy rain?',
    questionHi: 'अगर भारी बारिश के कारण खाने का ऑर्डर 25 मिनट लेट हो जाए और ग्राहक नाराज हो, तो आप क्या कहेंगे?',
    hintEn: 'Apologize sincerely, explain rain delay respectfully, and reassure fresh delivery.',
    hintHi: 'सच्चे दिल से क्षमा मांगें, बारिश की वजह बताएं और सुरक्षित डिलीवरी का भरोसा दें।',
    level: 'Level 3',
    samplePhrases: [
      'I sincerely apologize for the delay due to waterlogging.',
      'Sir, safety on flooded roads caused delay, food is packed hot.',
      'Extremely sorry sir, I rode carefully in heavy rain.'
    ],
    sampleLearnerSpoken: 'Sorry sir, road is full water and heavy rain, please understand.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'utensils'
  },
  {
    id: 'dr-l3-wrong-medicine-delivered',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine Scenarios',
    categoryHindi: 'दैनिक ग्राहक स्थितियां',
    questionEn: 'What will you do if an online pharmacy delivers the wrong medicine package to your house for your parents?',
    questionHi: 'अगर ऑनलाइन फार्मेसी आपके घर माता-पिता के लिए गलत दवा का पैकेट डिलीवर कर दे, तो आप क्या करेंगे?',
    hintEn: 'Explain: Check bill, do not open medicine seals, contact helpline, and request urgent replacement.',
    hintHi: 'समझाएं: बिल चेक करेंगे, सील नहीं खोलेंगे, कस्टमर केयर पर कॉल करके तुरंत सही दवा मंगाएंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will check invoice, contact customer care, and ask for urgent replacement.',
      'I will not open the seal and raise an immediate wrong item ticket.',
      'I will explain to support that it is urgent medicine for my parents.'
    ],
    sampleLearnerSpoken: 'I call pharmacy helpline and tell send correct tablet immediately.',
    cardColor: 'from-[#FFE4E6] to-[#FECDD3]',
    iconType: 'alert-triangle'
  },
  {
    id: 'dr-l3-lost-wallet-metro',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine Scenarios',
    categoryHindi: 'दैनिक ग्राहक स्थितियां',
    questionEn: 'What will you do if you realize you lost your wallet with cash and ID cards inside a crowded metro station?',
    questionHi: 'अगर आपको पता चले कि भीड़भाड़ वाले मेट्रो स्टेशन पर आपका पर्स, कैश और आईडी कार्ड खो गया है, तो आप क्या करेंगे?',
    hintEn: 'Explain: Report to Metro Station Control Room, check lost and found, and block bank cards via phone app.',
    hintHi: 'समझाएं: मेट्रो कंट्रोल रूम को बताएंगे, लॉस्ट एंड फाउंड चेक करेंगे और फोन ऐप से बैंक कार्ड ब्लॉक करेंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will immediately go to station customer care and report lost wallet.',
      'I will use mobile banking app to block my ATM cards immediately.',
      'I will file a lost report with metro security police.'
    ],
    sampleLearnerSpoken: 'I go to metro office and block my debit card on mobile.',
    cardColor: 'from-[#FDF2F8] to-[#FCE7F3]',
    iconType: 'help-circle'
  },

  // =========================================================================
  // 3. FRIENDS CONVERSATION (Casual Chats, Weekend Plans, Social Situations)
  // =========================================================================
  // Level 1: Short Words
  {
    id: 'fr-l1-how-are-you',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'How are you doing today?',
    questionHi: 'आप आज कैसे हैं?',
    hintEn: 'Say: "I am good, thank you! How about you?"',
    hintHi: 'कहें: "मैं अच्छा हूँ, धन्यवाद! आप कैसे हैं?"',
    level: 'Level 1',
    samplePhrases: [
      'I am doing great, thank you!',
      'All good brother, how are you?',
      'I am fine today, what about you?'
    ],
    sampleLearnerSpoken: 'I am good, you tell brother.',
    cardColor: 'from-[#EBF3FF] to-[#DBE8FD]',
    iconType: 'users'
  },
  {
    id: 'fr-l1-what-is-your-name',
    category: 'friends',
    categoryLabel: 'Friends & Intro',
    categoryHindi: 'परिचय',
    questionEn: 'What is your name and where do you live?',
    questionHi: 'आपका क्या नाम है और आप कहाँ रहते हैं?',
    hintEn: 'Say: "My name is [Name] and I live in [Area]."',
    hintHi: 'अपना नाम और इलाका बताएं: "मेरा नाम [नाम] है और मैं [स्थान] में रहता हूँ।"',
    level: 'Level 1',
    samplePhrases: [
      'My name is Rahul, I live in Bangalore.',
      'I am Amit from Delhi.',
      'Hi, I am Priya, staying near metro station.'
    ],
    sampleLearnerSpoken: 'My name is Suresh, living in Mumbai.',
    cardColor: 'from-[#F3EDFD] to-[#E5D7FA]',
    iconType: 'users'
  },
  {
    id: 'fr-l1-did-you-have-lunch',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'Did you finish your lunch?',
    questionHi: 'क्या आपने दोपहर का खाना खा लिया?',
    hintEn: 'Say: "Yes, I just had lunch" or "Not yet, let\'s eat together."',
    hintHi: 'कहें: "हाँ, मैंने अभी लंच किया" या "अभी नहीं, चलो साथ खाते हैं।"',
    level: 'Level 1',
    samplePhrases: [
      'Yes, I had lunch just now.',
      'Not yet, let us eat together!',
      'Yes, had roti and sabzi.'
    ],
    sampleLearnerSpoken: 'Yes lunch finish already, you ate?',
    cardColor: 'from-[#FFF6D6] to-[#FFECA8]',
    iconType: 'utensils'
  },
  {
    id: 'fr-l1-what-are-you-doing-evening',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What are you doing this evening after 7 PM?',
    questionHi: 'आज शाम 7 बजे के बाद आप क्या कर रहे हैं?',
    hintEn: 'Say: "I am free, let\'s catch up for tea" or "I am going to the gym."',
    hintHi: 'कहें: "मैं फ्री हूँ, चलो चाय पीते हैं" या "मैं जिम जा रहा हूँ।"',
    level: 'Level 1',
    samplePhrases: [
      'I am free, let us meet for tea.',
      'Going home to relax and watch cricket.',
      'Heading to market with family.'
    ],
    sampleLearnerSpoken: 'Evening I am free brother, we drink tea.',
    cardColor: 'from-[#E0E7FF] to-[#C7D2FE]',
    iconType: 'coffee'
  },

  // Level 2: Little More Words (Sentences)
  {
    id: 'fr-l2-weekend-plans',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'Are we meeting this Sunday for a cricket match or tea?',
    questionHi: 'क्या हम इस रविवार को क्रिकेट मैच या चाय के लिए मिल रहे हैं?',
    hintEn: 'Reply with your availability: "Yes, I am free on Sunday afternoon!"',
    hintHi: 'अपनी उपलब्धता बताएं: "हाँ, मैं रविवार दोपहर में फ्री हूँ!"',
    level: 'Level 2',
    samplePhrases: [
      'Yes, let us meet at 4 PM in the ground!',
      'Sunday evening is perfect for cricket.',
      'I have shift till 2 PM, then I can join.'
    ],
    sampleLearnerSpoken: 'Yes brother Sunday 4 PM we meet ground.',
    cardColor: 'from-[#F3EDFD] to-[#E5D7FA]',
    iconType: 'users'
  },
  {
    id: 'fr-l2-recommend-movie',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'Which new movie or web series did you watch recently, and was it good?',
    questionHi: 'आपने हाल ही में कौन सी नई फिल्म या वेब सीरीज देखी, और क्या वह अच्छी थी?',
    hintEn: 'Share your review: "I watched an action movie on Netflix, the story was very exciting!"',
    hintHi: 'बताएं: "मैंने नेटफ्लिक्स पर एक एक्शन फिल्म देखी, कहानी बहुत रोमांचक थी!"',
    level: 'Level 2',
    samplePhrases: [
      'I watched the new action movie, acting was amazing.',
      'I saw a comedy series, it was super entertaining.',
      'I watched cricket highlights, great match yesterday.'
    ],
    sampleLearnerSpoken: 'I watch new movie on phone, very nice action.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'users'
  },
  {
    id: 'fr-l2-new-phone-advice',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'How would you ask your tech-savvy friend for advice before buying a new smartphone under 15,000 rupees?',
    questionHi: '15,000 रुपये के बजट में नया स्मार्टफोन खरीदने से पहले आप अपने समझदार दोस्त से सलाह कैसे मांगेंगे?',
    hintEn: 'Ask: "Brother, which phone has the best battery and camera in this budget?"',
    hintHi: 'पूछें: "भाई, इस बजट में सबसे अच्छी बैटरी और कैमरे वाला कौन सा फोन है?"',
    level: 'Level 2',
    samplePhrases: [
      'Bhaiya, which phone should I buy under 15k with good battery?',
      'Can you recommend a reliable phone for delivery work and camera?',
      'Is 5G phone worth buying right now?'
    ],
    sampleLearnerSpoken: 'Brother please tell good mobile under 15 thousand for heavy use.',
    cardColor: 'from-[#E0F2FE] to-[#BAE6FD]',
    iconType: 'help-circle'
  },

  // Level 3: Hard - Scenarios ("What will you do if this happens?")
  {
    id: 'fr-l3-friend-money-refusal',
    category: 'friends',
    categoryLabel: 'Friends Scenarios',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What will you do if a close friend asks you to lend ten thousand rupees, but you do not have extra money this month?',
    questionHi: 'अगर कोई करीबी दोस्त आपसे दस हजार रुपये उधार मांगे, लेकिन इस महीने आपके पास अतिरिक्त पैसे न हों, तो आप क्या कहेंगे?',
    hintEn: 'Politely and honestly explain your tight monthly budget without feeling guilty.',
    hintHi: 'ईमानदारी से अपनी महीने की तंगी बताएं ताकि दोस्ती में गलतफहमी न हो।',
    level: 'Level 3',
    samplePhrases: [
      'Brother, I have tight medical expenses this month so I cannot lend.',
      'I wish I could help, but all my salary went into family rent.',
      'Sorry my friend, I am completely tight on funds right now.'
    ],
    sampleLearnerSpoken: 'Brother I really want to help, but this month my salary already finished in rent.',
    cardColor: 'from-[#F3EDFD] to-[#E5D7FA]',
    iconType: 'users'
  },
  {
    id: 'fr-l3-friend-missed-wedding',
    category: 'friends',
    categoryLabel: 'Friends Scenarios',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What will you say to apologize and make it up to your best friend whose wedding you missed due to an urgent job shift?',
    questionHi: 'अगर जरूरी जॉब शिफ्ट के कारण आप अपने सबसे अच्छे दोस्त की शादी में न जा पाए हों, तो आप उससे माफी कैसे मांगेंगे और रिश्ते को कैसे संभालेंगे?',
    hintEn: 'Congratulate warmly, explain the unavoidable work constraint sincerely, and plan an in-person dinner visit.',
    hintHi: 'बधाई दें, मजबूरी बताएं और घर जाकर साथ खाना खाने व गिफ्ट देने का प्लान बनाएं।',
    level: 'Level 3',
    samplePhrases: [
      'I am truly sorry I missed your big day due to urgent work; let me take you and bhabhi out for dinner this weekend!',
      'Congratulations brother! I felt terrible missing the wedding, coming to your house on Sunday.',
      'Please forgive me brother, company emergency duty got locked; sending lots of love and gifts.'
    ],
    sampleLearnerSpoken: 'Sorry brother I could not come wedding because shift emergency, I come your house Sunday.',
    cardColor: 'from-[#FFE4E6] to-[#FECDD3]',
    iconType: 'users'
  },
  {
    id: 'fr-l3-friend-risky-business',
    category: 'friends',
    categoryLabel: 'Friends Scenarios',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What will you tell your friend who is pressuring you to leave your stable job and invest all your savings into a risky new business?',
    questionHi: 'अगर आपका दोस्त आप पर अपनी स्थिर नौकरी छोड़ने और सारी बचत एक जोखिम भरे नए बिजनेस में लगाने का दबाव डाले, तो आप उसे समझदारी से क्या कहेंगे?',
    hintEn: 'Respect their enthusiasm, explain your family financial responsibilities, and suggest starting part-time first.',
    hintHi: 'उनके विचार का सम्मान करें, अपनी पारिवारिक जिम्मेदारियां बताएं और पहले पार्ट-टाइम शुरू करने की सलाह दें।',
    level: 'Level 3',
    samplePhrases: [
      'I support your dream brother, but I have family responsibilities and cannot risk my full savings.',
      'Why don\'t we test this business part-time on weekends first before quitting jobs?',
      'I appreciate the offer, but right now I need monthly fixed salary stability.'
    ],
    sampleLearnerSpoken: 'Your idea is good brother, but I have family loan so I cannot leave job right now.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'alert-triangle'
  },

  // =========================================================================
  // 4. SHEEKO (Stories, Real Life Experiences, Anecdotes & Storytelling)
  // =========================================================================
  // Level 1: Story Words & Beginner Story Moments
  {
    id: 'sh-l1-favorite-childhood-memory',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां और यादें',
    questionEn: 'Can you tell a short story about your favorite childhood game?',
    questionHi: 'क्या आप अपने बचपन के पसंदीदा खेल की एक छोटी कहानी सुना सकते हैं?',
    hintEn: 'Say: "When I was young, we played cricket every evening in the street with friends."',
    hintHi: 'बताएं: "जब मैं छोटा था, हम रोज़ शाम को गली में दोस्तों के साथ क्रिकेट खेलते थे।"',
    level: 'Level 1',
    samplePhrases: [
      'When I was small, we played hide and seek.',
      'We played football in the village ground.',
      'My favorite game was street cricket with friends.'
    ],
    sampleLearnerSpoken: 'When I was small child, we played cricket daily evening.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'book-open'
  },
  {
    id: 'sh-l1-rainy-day-story',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां और यादें',
    questionEn: 'What happened on a heavy rainy day when you were going outside?',
    questionHi: 'एक भारी बारिश वाले दिन क्या हुआ जब आप बाहर जा रहे थे?',
    hintEn: 'Say: "Suddenly heavy rain started, water filled the streets, and we took shelter under a shop."',
    hintHi: 'बताएं: "अचानक भारी बारिश शुरू हुई और हमने एक दुकान के नीचे शरण ली।"',
    level: 'Level 1',
    samplePhrases: [
      'Heavy rain started and my umbrella broke.',
      'Water was everywhere so we drank hot tea at a stall.',
      'We got totally wet but had great fun.'
    ],
    sampleLearnerSpoken: 'Suddenly big rain came and road full water.',
    cardColor: 'from-[#E0F2FE] to-[#BAE6FD]',
    iconType: 'cloud-rain'
  },
  {
    id: 'sh-l1-funny-moment-lunch',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां और यादें',
    questionEn: 'What was a funny thing that happened while having food with friends?',
    questionHi: 'दोस्तों के साथ खाना खाते समय क्या मजेदार बात हुई थी?',
    hintEn: 'Say: "My friend accidentally ate extra spicy chili and everyone started laughing."',
    hintHi: 'बताएं: "मेरे दोस्त ने गलती से बहुत तीखी मिर्च खा ली और सब हंसने लगे।"',
    level: 'Level 1',
    samplePhrases: [
      'My friend ate hot chili by mistake.',
      'We shared one lunch box among four friends.',
      'Everyone laughed so loudly in the canteen.'
    ],
    sampleLearnerSpoken: 'My friend ate red chili and drank one jug water.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'smile'
  },

  // Level 2: Story Sentences & Event Narration
  {
    id: 'sh-l2-first-job-interview',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां और अनुभव',
    questionEn: 'Tell the story of how you prepared for your first job interview and what you felt.',
    questionHi: 'बताएं कि आपने अपने पहले जॉब इंटरव्यू की तैयारी कैसे की और आपको कैसा लगा था।',
    hintEn: 'Describe your feeling: "I was nervous before the interview, but answered confidently and got selected."',
    hintHi: 'बताएं: "मैं पहले थोड़ा घबराया हुआ था, लेकिन आत्मविश्वास से उत्तर दिया और चुना गया।"',
    level: 'Level 2',
    samplePhrases: [
      'I was nervous in the morning, but the interviewer was very kind.',
      'I practiced introducing myself ten times before entering the room.',
      'When they said "You are hired", I felt extremely proud.'
    ],
    sampleLearnerSpoken: 'First time interview I was very nervous, but I spoke clearly and got job.',
    cardColor: 'from-[#EDE9FE] to-[#DDD6FE]',
    iconType: 'briefcase'
  },
  {
    id: 'sh-l2-helpful-stranger',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां और अनुभव',
    questionEn: 'Tell the story of a helpful stranger who assisted you when you were lost or stuck.',
    questionHi: 'एक मददगार अजनबी की कहानी बताएं जिसने रास्ता भटकने या गाड़ी खराब होने पर आपकी मदद की।',
    hintEn: 'Narrate: "My bike broke down at night, and a kind auto driver stopped and helped me find a mechanic."',
    hintHi: 'सुनाएं: "रात में मेरी बाइक रुक गई, और एक दयालु ऑटो चालक ने मुझे मैकेनिक ढूंढने में मदद की।"',
    level: 'Level 2',
    samplePhrases: [
      'My phone battery died, and a kind shopkeeper showed me the correct route.',
      'When my bike broke down, a passerby helped me push it to the garage.',
      'I was new to the city, and a college student guided me to the metro.'
    ],
    sampleLearnerSpoken: 'My bike stopped at night, one uncle helped me to fix tyre.',
    cardColor: 'from-[#D1FAE5] to-[#A7F3D0]',
    iconType: 'heart'
  },
  {
    id: 'sh-l2-cooking-experience',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां और अनुभव',
    questionEn: 'How would you narrate the story of the first time you tried cooking a special dish?',
    questionHi: 'पहली बार जब आपने कोई खास डिश पकाने की कोशिश की थी, उसकी कहानी कैसे सुनाएंगे?',
    hintEn: 'Share: "I tried making tea and omelette for my family; it burned slightly but everyone enjoyed it!"',
    hintHi: 'बताएं: "मैंने पहली बार चाय और आमलेट बनाया; थोड़ा जल गया था लेकिन सबने खुशी से खाया!"',
    level: 'Level 2',
    samplePhrases: [
      'I followed a YouTube recipe to make biryani for Sunday dinner.',
      'The salt was a little high, but my mother praised my sincere effort.',
      'It took two hours to prepare, and it smelled delicious.'
    ],
    sampleLearnerSpoken: 'First time I made chicken curry, little spicy but family liked it.',
    cardColor: 'from-[#FEE2E2] to-[#FECACA]',
    iconType: 'utensils'
  },

  // Level 3: Moral Stories, Life Lessons & Dramatic Narratives
  {
    id: 'sh-l3-hard-work-success-story',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'प्रेरणादायक कहानियां',
    questionEn: 'Tell the inspiring story of someone you know who overcame great difficulties through continuous hard work.',
    questionHi: 'किसी ऐसे व्यक्ति की प्रेरणादायक कहानी सुनाएं जिसने कड़ी मेहनत से बड़ी मुश्किलों को पार किया।',
    hintEn: 'Explain: Describe their starting hardship, their daily perseverance, and how their life transformed.',
    hintHi: 'समझाएं: उनकी शुरुआती कठिनाइयों, रोज़ की मेहनत और जीवन में आई सफलता का वर्णन करें।',
    level: 'Level 3',
    samplePhrases: [
      'My uncle started with a small tea stall and worked twelve hours daily to build a successful shop.',
      'Despite financial struggles, my friend studied late at night and cleared his government exam.',
      'Their dedication taught me that honesty and continuous effort always lead to success.'
    ],
    sampleLearnerSpoken: 'My brother worked day shift and studied night, now he is senior manager in company.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'award'
  },
  {
    id: 'sh-l3-moral-story-kids',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'प्रेरणादायक कहानियां',
    questionEn: 'How would you tell a moral story about honesty and teamwork to a group of young children?',
    questionHi: 'आप छोटे बच्चों को ईमानदारी और मिलजुल कर काम करने की एक नैतिक कहानी कैसे सुनाएंगे?',
    hintEn: 'Story arc: Introduce two animal friends or village kids, a tempting choice, doing the right thing, and the valuable lesson.',
    hintHi: 'सुनाएं: दो दोस्तों की कहानी, सही निर्णय और सच्चाई से मिलने वाले सुकून की सीख।',
    level: 'Level 3',
    samplePhrases: [
      'Once in a forest, two birds found a bag of grain and decided to share it equally with all animals.',
      'When the farmer lost his gold ring, a little boy returned it honestly and received blessings and a reward.',
      'The moral of the story is that truthfulness gives peace of mind and builds lifelong trust.'
    ],
    sampleLearnerSpoken: 'Two friends found wallet in garden, they gave to police station honestly, everyone praised them.',
    cardColor: 'from-[#EDE9FE] to-[#DDD6FE]',
    iconType: 'book-open'
  },
  {
    id: 'sh-l3-rollercoaster-day',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'प्रेरणादायक कहानियां',
    questionEn: 'Tell the story of a day when everything seemed to go wrong initially, but ended with an unexpected happy moment.',
    questionHi: 'एक ऐसे दिन की कहानी सुनाएं जब शुरुआत में सब कुछ गलत हो रहा था, लेकिन अंत में एक सुखद सरप्राइज मिला।',
    hintEn: 'Describe the stressful morning (delays, misses) and the turning point that made the whole day memorable.',
    hintHi: 'वर्णन करें: सुबह की परेशानी और अंत में मिली राहत व खुशियों की कहानी।',
    level: 'Level 3',
    samplePhrases: [
      'I missed my morning train and was very worried, but caught a special express and met an old school friend.',
      'My bike broke down in the morning, but my colleagues supported me and we celebrated our team target victory.',
      'It taught me that patience and a positive mindset can turn any stressful day into a great memory.'
    ],
    sampleLearnerSpoken: 'Morning my bike punctured and rain came, but evening company announced promotion for our team.',
    cardColor: 'from-[#D1FAE5] to-[#A7F3D0]',
    iconType: 'sparkles'
  },
  {
    id: 'logistics-level1-what-is-the-delivery-otp--1',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "What is the delivery OTP for this parcel?",
    questionHi: "इस पार्सल के लिए डिलीवरी ओटीपी क्या है?",
    hintEn: "Say: \"Sir, please share the 4-digit OTP sent on your SMS.\"",
    hintHi: "कहें: \"सर, कृपया अपने एसएमएस पर आया 4 अंकों का ओटीपी साझा करें।\"",
    level: 'Level 1',
    samplePhrases: [
          "OTP is 5821 sir.",
          "Please check SMS on registered phone.",
          "OTP verified, here is your package."
    ],
    sampleLearnerSpoken: "Please share 4 digit OTP for parcel.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'package'
  },
  {
    id: 'logistics-level1-where-should-i-unload-the-1',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "Where should I unload these 10 heavy cartons?",
    questionHi: "मुझे ये 10 भारी कार्टन कहाँ उतारने चाहिए?",
    hintEn: "Say: \"Please stack them near Bay 3 on wooden pallets.\"",
    hintHi: "कहें: \"कृपया इन्हें लकड़ी के पैलेट पर बे 3 के पास रखें।\"",
    level: 'Level 1',
    samplePhrases: [
          "Keep near bay three.",
          "Stack on wooden pallet.",
          "Move to storage shelf B."
    ],
    sampleLearnerSpoken: "Stack 10 boxes near bay three pallet.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'truck'
  },
  {
    id: 'logistics-level1-is-the-delivery-vehicle-f-1',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "Is the delivery vehicle fuel tank full for today's route?",
    questionHi: "क्या आज के रूट के लिए डिलीवरी वाहन का फ्यूल टैंक फुल है?",
    hintEn: "Say: \"Yes, filled diesel at Indian Oil pump this morning.\"",
    hintHi: "कहें: \"हाँ, आज सुबह पेट्रोल पंप पर डीजल भरवा लिया था।\"",
    level: 'Level 1',
    samplePhrases: [
          "Full tank diesel filled.",
          "Fuel is at 80 percent.",
          "Receipt attached in logbook."
    ],
    sampleLearnerSpoken: "Full tank fuel filled morning time.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'truck'
  },
  {
    id: 'logistics-level2-how-will-you-explain-a-30-1',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "How will you explain a 30-minute delivery delay caused by waterlogging?",
    questionHi: "जलभराव के कारण हुई 30-मिनट की देरी की जानकारी कैसे देंगे?",
    hintEn: "Say: \"Sir, underpass was waterlogged after heavy downpour, reaching your location in 20 minutes.\"",
    hintHi: "कहें: \"सर, बारिश से अंडरपास में पानी भर गया था, 20 मिनट में पहुँच रहा हूँ।\"",
    level: 'Level 2',
    samplePhrases: [
          "Heavy rain caused road blockage on main flyover.",
          "Took bypass route to deliver parcel safely.",
          "Reaching your apartment gate in fifteen minutes."
    ],
    sampleLearnerSpoken: "Underpass waterlogged sir, taking diversion, reaching shortly.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'umbrella'
  },
  {
    id: 'logistics-level2-what-procedure-do-you-fol-1',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "What procedure do you follow when barcode scanner stops reading labels?",
    questionHi: "जब बारकोड स्कैनर लेबल पढ़ना बंद कर देता है तो आप क्या प्रक्रिया अपनाते हैं?",
    hintEn: "Say: \"Clean scanner lens, type 12-digit airway bill manually, and report to IT support desk.\"",
    hintHi: "कहें: \"लेंस साफ करें, 12 अंकों का बिल नंबर हाथ से टाइप करें और सपोर्ट को बताएं।\"",
    level: 'Level 2',
    samplePhrases: [
          "Wipe camera lens with clean microfiber cloth.",
          "Type tracking consignment number manually on touchpad.",
          "Switch to spare scanner kept at charging station."
    ],
    sampleLearnerSpoken: "Clean lens and type 12 digit tracking number manually.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'smartphone'
  },
  {
    id: 'logistics-level3-how-do-you-coordinate-wit-1',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "How do you coordinate with the night shift supervisor during parcel handoff?",
    questionHi: "पार्सल हैंडऑफ के दौरान नाइट शिफ्ट सुपरवाइजर के साथ तालमेल कैसे बिठाते हैं?",
    hintEn: "Review dispatch manifests, tally physical carton count, flag return orders, and sign handover sheet.",
    hintHi: "लिस्ट देखें, कार्टन गिनें, रिटर्न पार्सल अलग करें और हस्ताक्षर करें।",
    level: 'Level 3',
    samplePhrases: [
          "We physically verify total count of 350 parcels against the system manifest.",
          "Damaged items and pending OTP orders are highlighted in red ink.",
          "Both shift supervisors sign the official handover register before departure."
    ],
    sampleLearnerSpoken: "Verify 350 boxes count, check return parcels, sign handover register.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'file-text'
  },
  {
    id: 'workplace-level1-can-you-print-five-copies-1',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "Can you print five copies of today's shift schedule?",
    questionHi: "क्या आप आज के शिफ्ट शेड्यूल की पांच प्रतियां प्रिंट कर सकते हैं?",
    hintEn: "Say: \"Sure, printing them on printer 2 right now.\"",
    hintHi: "कहें: \"ज़रूर, प्रिंटर 2 से अभी प्रिंट निकालता हूँ।\"",
    level: 'Level 1',
    samplePhrases: [
          "Printing five copies now.",
          "Printout is ready at front desk.",
          "Here are your schedule copies."
    ],
    sampleLearnerSpoken: "Yes sir, printing 5 copies right now.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'printer'
  },
  {
    id: 'workplace-level1-where-are-the-spare-therm-1',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "Where are the spare thermal paper rolls kept?",
    questionHi: "स्पेयर थर्मल पेपर रोल कहाँ रखे हैं?",
    hintEn: "Say: \"They are in cabinet number 4 under the billing desk.\"",
    hintHi: "कहें: \"वे बिलिंग डेस्क के नीचे कैबिनेट नंबर 4 में हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Inside cabinet number four.",
          "Underneath the POS computer.",
          "Two boxes are left in storage."
    ],
    sampleLearnerSpoken: "In cabinet 4 under billing counter.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'file'
  },
  {
    id: 'workplace-level2-how-do-you-politely-ask-a-1',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "How do you politely ask a coworker to speak softly during a client call?",
    questionHi: "क्लाइंट कॉल के दौरान साथी से धीरे बोलने के लिए विनम्रता से कैसे कहेंगे?",
    hintEn: "Say: \"Excuse me brother, I am on an urgent client audio call, could you speak a little softer please?\"",
    hintHi: "कहें: \"क्षमा करें भाई, मेरी क्लाइंट कॉल चल रही है, क्या थोड़ा धीरे बोल सकते हैं?\"",
    level: 'Level 2',
    samplePhrases: [
          "Could you please lower voice for five minutes?",
          "I am on client discussion line.",
          "Thank you so much for understanding brother."
    ],
    sampleLearnerSpoken: "Brother please talk little soft, client on call.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'volume-x'
  },
  {
    id: 'workplace-level2-what-will-you-say-when-as-1',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "What will you say when asking your manager for a salary slip certificate?",
    questionHi: "मैनेजर से सैलरी स्लिप सर्टिफिकेट मांगते समय क्या कहेंगे?",
    hintEn: "Say: \"Good morning sir, I need my last 3 months stamped salary slips for a bank loan application.\"",
    hintHi: "कहें: \"नमस्ते सर, बैंक लोन के लिए पिछले 3 महीने की सैलरी स्लिप चाहिए।\"",
    level: 'Level 2',
    samplePhrases: [
          "Sir, could HR please email last three months pay slips?",
          "Need signed salary slips for bike loan approval.",
          "Submitted formal request on employee portal."
    ],
    sampleLearnerSpoken: "Sir please email last 3 months stamped salary slips.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'file-text'
  },
  {
    id: 'workplace-level3-how-do-you-welcome-and-on-1',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "How do you welcome and onboard a newly joined team member on their first morning?",
    questionHi: "काम के पहले दिन नए जुड़े साथी का स्वागत और मार्गदर्शन कैसे करेंगे?",
    hintEn: "Introduce yourself warmly, show locker room, biometric punch machine, water dispenser, and shift buddies.",
    hintHi: "गर्मजोशी से स्वागत करें, लॉकर, हाजिरी मशीन और टीम से परिचय कराएं।",
    level: 'Level 3',
    samplePhrases: [
          "Welcome to our logistics center Rahul, let me show you where our team sits.",
          "Here is our attendance fingerprint scanner and tea break area.",
          "Feel free to ask me any questions throughout your initial training week."
    ],
    sampleLearnerSpoken: "Welcome to team Rahul, I show lockers, biometric and work process.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'user-plus'
  },
  {
    id: 'qsr_retail-level1-do-you-need-a-carry-bag-f-1',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Do you need a carry bag for these purchases?",
    questionHi: "क्या आपको इन सामानों के लिए कैरी बैग चाहिए?",
    hintEn: "Say: \"Small cloth bag is 7 rupees and large is 12 rupees.\"",
    hintHi: "कहें: \"छोटा कपड़ा बैग 7 रुपये का है और बड़ा 12 रुपये का।\"",
    level: 'Level 1',
    samplePhrases: [
          "Do you want carry bag sir?",
          "Small cloth bag is seven rupees.",
          "I have brought my own bag."
    ],
    sampleLearnerSpoken: "Need carry bag sir? Seven rupees cloth bag.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'shopping-bag'
  },
  {
    id: 'qsr_retail-level1-where-can-i-find-cooking--1',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Where can I find cooking oil and basmati rice?",
    questionHi: "मुझे कुकिंग ऑयल और बासमती चावल कहाँ मिलेंगे?",
    hintEn: "Say: \"Cooking oils are in Aisle 2 and rice bags are in Aisle 3.\"",
    hintHi: "कहें: \"कुकिंग ऑयल आइल 2 में हैं और चावल के बैग आइल 3 में हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Cooking oil is in aisle two.",
          "Rice packets are right behind you.",
          "Follow the grocery signboard."
    ],
    sampleLearnerSpoken: "Oil in aisle 2 and basmati rice in aisle 3.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'search'
  },
  {
    id: 'qsr_retail-level2-how-do-you-inform-a-shopp-1',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "How do you inform a shopper that their card transaction was declined?",
    questionHi: "ग्राहक को कैसे बताएंगे कि उनका कार्ड पेमेंट फेल हो गया है?",
    hintEn: "Politely say: \"Sir, machine shows bank server timed out. Could we try inserting card again or scan UPI?\"",
    hintHi: "कहें: \"सर, बैंक सर्वर टाइमआउट हुआ है। क्या दोबारा कार्ड लगाएं या यूपीआई करें?\"",
    level: 'Level 2',
    samplePhrases: [
          "Card transaction did not go through, sir.",
          "Please check if international or online swipe is active.",
          "Would you like to scan our PhonePe QR stand?"
    ],
    sampleLearnerSpoken: "Sir transaction declined by bank, please try UPI or retry card.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'credit-card'
  },
  {
    id: 'qsr_retail-level2-a-customer-is-asking-for--1',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "A customer is asking for a discount on a fixed price branded item. How do you respond?",
    questionHi: "ग्राहक फिक्स्ड प्राइस ब्रांडेड सामान पर छूट मांग रहा है। आप क्या जवाब देंगे?",
    hintEn: "Say: \"Sir, prices are computer fixed by brand, but you earn 5% loyalty reward points on your mobile number.\"",
    hintHi: "कहें: \"सर, रेट फिक्स हैं, लेकिन आपको नंबर पर 5% रिवॉर्ड पॉइंट मिलेंगे।\"",
    level: 'Level 2',
    samplePhrases: [
          "Sir, these are system-locked brand prices.",
          "We have buy one get one offer on rack three.",
          "You will get 50 rupees cashback on our membership app."
    ],
    sampleLearnerSpoken: "Sir prices system fixed, but you get membership points.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'percent'
  },
  {
    id: 'qsr_retail-level3-describe-how-you-maintain-1',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Describe how you maintain food hygiene and cleanliness at a fast-food serving station.",
    questionHi: "फास्ट-फूड सर्विंग स्टेशन पर खाद्य स्वच्छता और सफाई कैसे बनाए रखते हैं?",
    hintEn: "Mention wearing fresh gloves and hairnets, sanitizing counters every 30 minutes, and checking food thermometer temps.",
    hintHi: "दस्ताने, हेयरनेट, हर 30 मिनट में काउंटर सैनिटाइजेशन और तापमान की जांच बताएं।",
    level: 'Level 3',
    samplePhrases: [
          "We sanitize food preparation slabs every half hour with food-grade disinfectant.",
          "Staff strictly wear disposable hairnets, aprons, and nitrile gloves.",
          "Hot food is maintained above 65 degrees Celsius to guarantee safety."
    ],
    sampleLearnerSpoken: "Wear hairnet and gloves, clean counters every 30 min, check hot food temp.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'shield-check'
  },
  {
    id: 'daily_routine-level1-how-much-is-the-auto-rick-1',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "How much is the auto rickshaw fare to the railway station by meter?",
    questionHi: "मीटर से रेलवे स्टेशन तक का ऑटो किराया कितना है?",
    hintEn: "Say: \"Meter fare will be around 70 to 80 rupees.\"",
    hintHi: "कहें: \"मीटर का किराया लगभग 70 से 80 रुपये होगा।\"",
    level: 'Level 1',
    samplePhrases: [
          "Please turn on the meter bhaiya.",
          "Meter shows 75 rupees.",
          "Here is exact eighty rupees."
    ],
    sampleLearnerSpoken: "Please run meter bhaiya, around 75 rupees.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'navigation'
  },
  {
    id: 'daily_routine-level1-did-you-lock-the-kitchen--1',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Did you lock the kitchen balcony door before leaving home?",
    questionHi: "क्या आपने घर से निकलने से पहले किचन बालकनी का दरवाजा बंद किया था?",
    hintEn: "Say: \"Yes, I double-locked both balcony and front door latch.\"",
    hintHi: "कहें: \"हाँ, मैंने बालकनी और मुख्य दरवाजा दोनों अच्छी तरह बंद किए।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes, balcony door is locked.",
          "Latched all windows tightly.",
          "Double checked lock before leaving."
    ],
    sampleLearnerSpoken: "Yes, balcony door locked properly.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'lock'
  },
  {
    id: 'daily_routine-level2-how-do-you-navigate-a-cro-1',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "How do you navigate a crowded metro interchange station like Rajiv Chowk?",
    questionHi: "राजीव चौक जैसे भीड़भाड़ वाले मेट्रो स्टेशन पर आप कैसे रास्ता तय करते हैं?",
    hintEn: "Say: \"Follow yellow floor stickers towards Yellow Line Platform 2 and keep left on escalators.\"",
    hintHi: "कहें: \"येलो लाइन के पीले निशानों का पालन करें और एस्केलेटर पर बाईं ओर रहें।\"",
    level: 'Level 2',
    samplePhrases: [
          "Follow the overhead signboards carefully.",
          "Walk on left side of staircases to avoid stampede.",
          "Listen to station announcements for train arrival."
    ],
    sampleLearnerSpoken: "Follow yellow line signage, walk left on escalator.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'compass'
  },
  {
    id: 'daily_routine-level2-explain-how-you-budget-yo-1',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Explain how you budget your monthly salary between rent, groceries, and savings.",
    questionHi: "बताएं कि आप किराए, राशन और बचत के बीच अपनी तनख्वाह का बजट कैसे बनाते हैं।",
    hintEn: "Say: \"40% goes for house rent and electricity, 30% for food and commute, and 30% goes directly into recurring deposit savings.\"",
    hintHi: "कहें: \"40% किराया, 30% खाना व आवागमन, और 30% बैंक बचत में जाता है।\"",
    level: 'Level 2',
    samplePhrases: [
          "I transfer savings amount on the day salary credits.",
          "Keep strict limit on online food orders.",
          "Use UPI passbook to track small daily spends."
    ],
    sampleLearnerSpoken: "40% rent, 30% food and travel, 30% bank savings.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'pie-chart'
  },
  {
    id: 'daily_routine-level3-describe-your-sunday-morn-1',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Describe your Sunday morning routine when you have a full day off with family.",
    questionHi: "रविवार की सुबह की अपनी दिनचर्या बताएं जब परिवार के साथ पूरी छुट्टी होती है।",
    hintEn: "Wake up without alarm, prepare special breakfast like aloo parathas, clean rooms, and wash scooter together.",
    hintHi: "आराम से उठना, आलू पराठे बनाना, कमरे साफ करना और मिलकर काम करना।",
    level: 'Level 3',
    samplePhrases: [
          "Sunday morning starts with hot aloo parathas and homemade curd.",
          "I wash my motorcycle and do laundry while listening to old Hindi songs.",
          "Afterwards, the whole family sits together to plan grocery shopping."
    ],
    sampleLearnerSpoken: "Wake late, make hot paratha breakfast, clean bike, spend time family.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'smile'
  },
  {
    id: 'friends-level1-what-street-food-snack-wo-1',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "What street food snack would you like to eat today?",
    questionHi: "आज आप कौन सा स्ट्रीट फूड स्नैक खाना चाहेंगे?",
    hintEn: "Say: \"Let us eat crispy pani puri with spicy mint water.\"",
    hintHi: "कहें: \"चलो तीखे पुदीना पानी के साथ पानी पूरी खाते हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Let us eat pani puri.",
          "Hot samosa and jalebi.",
          "One plate pav bhaji please."
    ],
    sampleLearnerSpoken: "Crispy pani puri with spicy water please.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'coffee'
  },
  {
    id: 'friends-level1-are-you-free-to-play-badm-1',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "Are you free to play badminton in the society park this evening?",
    questionHi: "क्या आज शाम आप पार्क में बैडमिंटन खेलने के लिए खाली हैं?",
    hintEn: "Say: \"Yes! Let us meet at the court at 5:30 PM.\"",
    hintHi: "कहें: \"हाँ! चलो शाम 5:30 बजे कोर्ट पर मिलते हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes, I am free at 5:30.",
          "Bring your racket along.",
          "Let us play 3 sets."
    ],
    sampleLearnerSpoken: "Yes free, meet at badminton court 5:30 PM.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'activity'
  },
  {
    id: 'friends-level2-how-do-you-invite-your-ap-1',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "How do you invite your apartment neighbors for Diwali sweets exchange?",
    questionHi: "अपार्टमेंट के पड़ोसियों को दिवाली की मिठाई के लिए कैसे आमंत्रित करेंगे?",
    hintEn: "Say: \"Namaste uncle, wishing you a happy Diwali! Please visit our flat this evening for sweets and snacks.\"",
    hintHi: "कहें: \"नमस्ते अंकल, दिवाली की शुभकामनाएं! शाम को मिठाई के लिए घर पधारें।\"",
    level: 'Level 2',
    samplePhrases: [
          "Happy Diwali to your entire family uncle!",
          "Please come over for homemade kaju katli.",
          "Looking forward to celebrating festival together."
    ],
    sampleLearnerSpoken: "Happy Diwali uncle, please come our home evening for sweets.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'sparkles'
  },
  {
    id: 'friends-level2-your-friend-is-nervous-ab-1',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "Your friend is nervous about their driving license test. How do you motivate them?",
    questionHi: "दोस्त ड्राइविंग लाइसेंस टेस्ट को लेकर घबराया हुआ है। उसका हौसला कैसे बढ़ाएंगे?",
    hintEn: "Say: \"Relax brother, you practiced parallel parking well; just check mirrors, use indicators, and stay calm.\"",
    hintHi: "कहें: \"शांत रहो भाई, तुमने अच्छी प्रैक्टिस की है; शीशे और इंडिकेटर सही रखना।\"",
    level: 'Level 2',
    samplePhrases: [
          "Take deep breaths, you are an excellent driver.",
          "Keep speed steady and wear seatbelt first.",
          "You will clear the track test easily brother!"
    ],
    sampleLearnerSpoken: "Relax bhai, you practiced well, drive slow and check mirrors.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'thumbs-up'
  },
  {
    id: 'friends-level3-how-would-you-organize-a--1',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "How would you organize a surprise birthday treat for your roommate on a small budget?",
    questionHi: "कम बजट में अपने रूममेट के लिए सरप्राइज बर्थडे ट्रीट कैसे आयोजित करेंगे?",
    hintEn: "Bake or buy a small pastry, decorate room with balloons, invite two close friends, and play acoustic guitar music.",
    hintHi: "पेस्ट्री, गुब्बारे, दो करीबी दोस्त और गाने बजाकर सरप्राइज देना।",
    level: 'Level 3',
    samplePhrases: [
          "We pooled 200 rupees each for chocolate truffle cake and streamers.",
          "Turned off room lights and greeted him with birthday song at midnight.",
          "Simple heartfelt celebrations create deeper memories than expensive parties."
    ],
    sampleLearnerSpoken: "Pooled money for cake, decorated room, midnight surprise birthday song.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'gift'
  },
  {
    id: 'supervisors-level1-have-you-verified-all-ret-1',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "Have you verified all return items in the computer system?",
    questionHi: "क्या आपने कंप्यूटर सिस्टम में सभी रिटर्न सामान सत्यापित कर लिए हैं?",
    hintEn: "Say: \"Yes sir, updated all 8 return items in portal.\"",
    hintHi: "कहें: \"हाँ सर, पोर्टल में सभी 8 रिटर्न आइटम अपडेट कर दिए हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes sir, system updated.",
          "All eight items logged.",
          "Printout attached to folder."
    ],
    sampleLearnerSpoken: "Yes sir, all return items verified in system.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'check-circle'
  },
  {
    id: 'supervisors-level1-can-you-work-the-early-mo-1',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "Can you work the early morning 6 AM shift tomorrow?",
    questionHi: "क्या आप कल सुबह 6 बजे की शिफ्ट में आ सकते हैं?",
    hintEn: "Say: \"Yes sir, I will report at 5:45 AM sharp.\"",
    hintHi: "कहें: \"हाँ सर, मैं ठीक 5:45 बजे रिपोर्ट करूँगा।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes sir, I will arrive on time.",
          "Will report at 5:45 AM.",
          "Available for early shift."
    ],
    sampleLearnerSpoken: "Yes sir, reporting 5:45 AM morning.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'clock'
  },
  {
    id: 'supervisors-level2-how-do-you-report-a-stock-1',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "How do you report a stock discrepancy of five missing jackets to your supervisor?",
    questionHi: "पांच जैकेटों की कमी की सूचना सुपरवाइजर को कैसे देंगे?",
    hintEn: "Say: \"Sir, during evening audit, physical count shows 45 jackets but inventory software shows 50. I am rechecking Rack 2.\"",
    hintHi: "कहें: \"सर, स्टॉक में 45 जैकेट हैं लेकिन सिस्टम में 50। मैं रैक 2 दोबारा चेक कर रहा हूँ।\"",
    level: 'Level 2',
    samplePhrases: [
          "Found difference of five pieces during shelf audit.",
          "Checking billing logs to see if dispatched without scan.",
          "Will cross verify with dispatch counter security CCTV."
    ],
    sampleLearnerSpoken: "Sir physical count 45 but system shows 50, rechecking rack.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'alert-triangle'
  },
  {
    id: 'supervisors-level2-in-a-job-interview-how-do-1',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "In a job interview, how do you answer: \"Why do you want to join our company?\"",
    questionHi: "इंटरव्यू में जवाब कैसे देंगे: \"आप हमारी कंपनी में क्यों शामिल होना चाहते हैं?\"",
    hintEn: "Highlight company growth, learning professional logistics systems, disciplined culture, and long-term career growth.",
    hintHi: "कंपनी की प्रगति, सीखने के अवसर और करियर की उन्नति बताएं।",
    level: 'Level 2',
    samplePhrases: [
          "Your company is recognized as an industry leader in logistics innovation.",
          "I want to build my career here because you value punctuality and hard work.",
          "This role matches my experience in warehouse management perfectly."
    ],
    sampleLearnerSpoken: "Your company has good reputation and growth, I want long term career here.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'award'
  },
  {
    id: 'supervisors-level3-how-do-you-discuss-with-y-1',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "How do you discuss with your manager about wanting promotion to Assistant Shift Supervisor?",
    questionHi: "असिस्टेंट शिफ्ट सुपरवाइजर पद पर प्रमोशन के लिए मैनेजर से बात कैसे करेंगे?",
    hintEn: "Highlight 2 years zero-error record, training 10 junior pickers, managing attendance logs, and readiness for leadership.",
    hintHi: "2 साल का बेदाग रिकॉर्ड, नए लड़कों को सिखाना और जिम्मेदारी लेने की इच्छा बताएं।",
    level: 'Level 3',
    samplePhrases: [
          "Sir, over the past two years, I have maintained zero dispatch errors and trained ten new packers.",
          "I am eager to take on higher shift management responsibilities as Assistant Supervisor.",
          "I would be grateful for the opportunity to demonstrate my leadership skills."
    ],
    sampleLearnerSpoken: "Sir, 2 years zero errors and trained team, ready for Assistant Supervisor role.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'trending-up'
  },
  {
    id: 'customer-level1-what-is-your-registered-m-1',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "What is your registered mobile number for bill invoice?",
    questionHi: "बिल इनवॉइस के लिए आपका रजिस्टर्ड मोबाइल नंबर क्या है?",
    hintEn: "Say: \"My 10-digit mobile number is 9 8 7 6 5 4 3 2 1 0.\"",
    hintHi: "कहें: \"मेरा 10 अंकों का मोबाइल नंबर 9876543210 है।\"",
    level: 'Level 1',
    samplePhrases: [
          "Please tell mobile number.",
          "Invoice sent via WhatsApp.",
          "Number entered in system."
    ],
    sampleLearnerSpoken: "My mobile number is 9876543210 sir.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'phone'
  },
  {
    id: 'customer-level1-do-you-want-the-bill-rece-1',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "Do you want the bill receipt on WhatsApp or printed paper?",
    questionHi: "क्या आपको बिल रसीद व्हाट्सएप पर चाहिए या प्रिंट पेपर पर?",
    hintEn: "Say: \"Please send green e-bill on my WhatsApp.\"",
    hintHi: "कहें: \"कृपया मेरे व्हाट्सएप पर ई-बिल भेज दीजिए।\"",
    level: 'Level 1',
    samplePhrases: [
          "WhatsApp e-bill please.",
          "Paper printout needed.",
          "Eco-friendly message received."
    ],
    sampleLearnerSpoken: "WhatsApp e-bill is good sir.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'message-square'
  },
  {
    id: 'customer-level2-how-do-you-handle-a-custo-1',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "How do you handle a customer claiming they were charged twice for one bottle of shampoo?",
    questionHi: "ग्राहक का कहना है कि एक शैम्पू के दो बार पैसे कट गए। आप इसे कैसे सुलझाएंगे?",
    hintEn: "Say: \"Let me check invoice copy on POS system, cross check payment gateway, and process immediate cash refund if doubled.\"",
    hintHi: "कहें: \"सिस्टम में बिल चेक करता हूँ, अगर डबल कटा है तो तुरंत रिफंड करूँगा।\"",
    level: 'Level 2',
    samplePhrases: [
          "Let me inspect your printed bill and system log.",
          "Apologies sir, scanner beeped twice by mistake, processing refund right away.",
          "Here is fifty rupees cash refund and corrected tax invoice."
    ],
    sampleLearnerSpoken: "Let me check bill sir, if double scanned, refunding immediately.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'repeat'
  },
  {
    id: 'customer-level2-how-do-you-explain-warran-1',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "How do you explain warranty terms for an electronic kettle to a buyer?",
    questionHi: "इलेक्ट्रिक केतली की वारंटी शर्तें खरीदार को कैसे समझाएंगे?",
    hintEn: "Say: \"This product carries 1-year replacement warranty for heating element. Keep this stamped bill safely.\"",
    hintHi: "कहें: \"इस पर हीटिंग एलिमेंट की 1 साल की वारंटी है, स्टैम्प्ड बिल संभाल कर रखें।\"",
    level: 'Level 2',
    samplePhrases: [
          "One year manufacturer warranty included.",
          "Covers heating coil defects.",
          "Keep invoice slip for free service at authorized center."
    ],
    sampleLearnerSpoken: "One year warranty on coil, keep stamped bill for service.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'shield'
  },
  {
    id: 'customer-level3-a-customer-is-upset-becau-1',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "A customer is upset because home delivery arrived 2 hours after their birthday party started. How do you resolve this?",
    questionHi: "ग्राहक नाराज है क्योंकि जन्मदिन पार्टी शुरू होने के 2 घंटे बाद डिलीवरी पहुंची। आप इसे कैसे संभालेंगे?",
    hintEn: "Listen without arguing, apologize sincerely, waive delivery fee, offer complimentary dessert voucher, and update delivery logs.",
    hintHi: "बिना बहस सुने, दिल से माफी मांगें, डिलीवरी फीस माफ करें और कूपन दें।",
    level: 'Level 3',
    samplePhrases: [
          "I understand completely how upsetting this delay was for your party celebration.",
          "We are waiving your delivery fee and issuing a 200 rupee voucher for your next order.",
          "I am personally taking steps with our dispatch team so this never recurs."
    ],
    sampleLearnerSpoken: "So sorry for party delay sir, waiving delivery fee and giving discount voucher.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'smile'
  },
  {
    id: 'sheeko-level1-what-did-you-buy-with-you-1',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "What did you buy with your very first festival Diwali bonus?",
    questionHi: "दिवाली के पहले बोनस से आपने क्या खरीदा था?",
    hintEn: "Say: \"I bought a new ceiling fan for my parents' bedroom.\"",
    hintHi: "कहें: \"मैंने माता-पिता के कमरे के लिए नया पंखा खरीदा।\"",
    level: 'Level 1',
    samplePhrases: [
          "Bought sweets and clothes.",
          "Purchased mixer grinder for home.",
          "Gave bonus cash to father."
    ],
    sampleLearnerSpoken: "Bought new ceiling fan for parents room.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'gift'
  },
  {
    id: 'sheeko-level1-which-is-your-favorite-st-1',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Which is your favorite street in your hometown and why?",
    questionHi: "आपके शहर की पसंदीदा सड़क कौन सी है और क्यों?",
    hintEn: "Say: \"Gandhi Chowk market road because of the fresh samosas and book stalls.\"",
    hintHi: "कहें: \"गांधी चौक मार्केट रोड, क्योंकि वहाँ समोसे और किताबों की दुकानें हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Market road near clock tower.",
          "Peaceful temple street.",
          "Main bazaar filled with lights."
    ],
    sampleLearnerSpoken: "Gandhi Chowk market because best samosa and books.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'map'
  },
  {
    id: 'sheeko-level2-tell-the-story-of-how-you-1',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Tell the story of how you learned to ride a geared motorcycle.",
    questionHi: "गियर वाली मोटरसाइकिल चलाना सीखने की कहानी बताएं।",
    hintEn: "Describe elder brother teaching clutch balance, engine stalling on slope, and gaining confidence after one week.",
    hintHi: "बड़े भाई का सिखाना, क्लच का संतुलन, ढलान पर बंद होना और 1 हफ्ते में सीखना।",
    level: 'Level 2',
    samplePhrases: [
          "My uncle taught me clutch balance in open playground.",
          "Motorcycle engine stopped five times initially.",
          "Within ten days, I was riding smoothly in highway traffic."
    ],
    sampleLearnerSpoken: "Elder brother taught clutch balance, stalled early, then rode smoothly.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'compass'
  },
  {
    id: 'sheeko-level2-narrate-a-day-when-a-sudd-1',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Narrate a day when a sudden rainstorm forced everyone to seek shelter under a chai tapri.",
    questionHi: "उस दिन का वर्णन करें जब अचानक आई बारिश ने सबको चाय की टपरी पर रुकने को मजबूर किया।",
    hintEn: "Describe stranger office workers and delivery boys drinking hot tea together, laughing at thunder.",
    hintHi: "डिलीवरी लड़कों और दफ्तर के लोगों का साथ चाय पीना और बादलों की गड़गड़ाहट पर हंसना।",
    level: 'Level 2',
    samplePhrases: [
          "Sudden monsoon shower drenched everyone on main road.",
          "Twenty people crowded under small blue tin shed.",
          "Shared hot ginger tea and pakoras while waiting for rain to stop."
    ],
    sampleLearnerSpoken: "Heavy sudden rain, all strangers under chai tapri drinking hot tea.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'coffee'
  },
  {
    id: 'sheeko-level3-describe-an-inspiring-inc-1',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Describe an inspiring incident where your village community came together to solve a crisis.",
    questionHi: "उस प्रेरक घटना का वर्णन करें जब आपके गांव वालों ने मिलकर किसी संकट का समाधान किया।",
    hintEn: "Explain broken irrigation canal or village road repair where youth and elders worked together without waiting for contractors.",
    hintHi: "नहर या सड़क टूटने पर युवाओं और बुजुर्गों का मिलकर खुद मरम्मत करना।",
    level: 'Level 3',
    samplePhrases: [
          "When monsoon flood washed away our wooden bridge, the youth mobilized sandbags.",
          "Every family contributed bamboo poles and tools to restore school connectivity.",
          "It proved that united teamwork can overcome any obstacle without waiting."
    ],
    sampleLearnerSpoken: "Village flood broke pathway, all families brought sandbags and rebuilt bridge.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'users'
  },
  {
    id: 'logistics-level1-what-is-the-delivery-otp--2',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "What is the delivery OTP for this parcel?",
    questionHi: "इस पार्सल के लिए डिलीवरी ओटीपी क्या है?",
    hintEn: "Say: \"Sir, please share the 4-digit OTP sent on your SMS.\"",
    hintHi: "कहें: \"सर, कृपया अपने एसएमएस पर आया 4 अंकों का ओटीपी साझा करें।\"",
    level: 'Level 1',
    samplePhrases: [
          "OTP is 5821 sir.",
          "Please check SMS on registered phone.",
          "OTP verified, here is your package."
    ],
    sampleLearnerSpoken: "Please share 4 digit OTP for parcel.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'package'
  },
  {
    id: 'logistics-level1-where-should-i-unload-the-2',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "Where should I unload these 10 heavy cartons?",
    questionHi: "मुझे ये 10 भारी कार्टन कहाँ उतारने चाहिए?",
    hintEn: "Say: \"Please stack them near Bay 3 on wooden pallets.\"",
    hintHi: "कहें: \"कृपया इन्हें लकड़ी के पैलेट पर बे 3 के पास रखें।\"",
    level: 'Level 1',
    samplePhrases: [
          "Keep near bay three.",
          "Stack on wooden pallet.",
          "Move to storage shelf B."
    ],
    sampleLearnerSpoken: "Stack 10 boxes near bay three pallet.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'truck'
  },
  {
    id: 'logistics-level1-is-the-delivery-vehicle-f-2',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "Is the delivery vehicle fuel tank full for today's route?",
    questionHi: "क्या आज के रूट के लिए डिलीवरी वाहन का फ्यूल टैंक फुल है?",
    hintEn: "Say: \"Yes, filled diesel at Indian Oil pump this morning.\"",
    hintHi: "कहें: \"हाँ, आज सुबह पेट्रोल पंप पर डीजल भरवा लिया था।\"",
    level: 'Level 1',
    samplePhrases: [
          "Full tank diesel filled.",
          "Fuel is at 80 percent.",
          "Receipt attached in logbook."
    ],
    sampleLearnerSpoken: "Full tank fuel filled morning time.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'truck'
  },
  {
    id: 'logistics-level2-how-will-you-explain-a-30-2',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "How will you explain a 30-minute delivery delay caused by waterlogging?",
    questionHi: "जलभराव के कारण हुई 30-मिनट की देरी की जानकारी कैसे देंगे?",
    hintEn: "Say: \"Sir, underpass was waterlogged after heavy downpour, reaching your location in 20 minutes.\"",
    hintHi: "कहें: \"सर, बारिश से अंडरपास में पानी भर गया था, 20 मिनट में पहुँच रहा हूँ।\"",
    level: 'Level 2',
    samplePhrases: [
          "Heavy rain caused road blockage on main flyover.",
          "Took bypass route to deliver parcel safely.",
          "Reaching your apartment gate in fifteen minutes."
    ],
    sampleLearnerSpoken: "Underpass waterlogged sir, taking diversion, reaching shortly.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'umbrella'
  },
  {
    id: 'logistics-level2-what-procedure-do-you-fol-2',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "What procedure do you follow when barcode scanner stops reading labels?",
    questionHi: "जब बारकोड स्कैनर लेबल पढ़ना बंद कर देता है तो आप क्या प्रक्रिया अपनाते हैं?",
    hintEn: "Say: \"Clean scanner lens, type 12-digit airway bill manually, and report to IT support desk.\"",
    hintHi: "कहें: \"लेंस साफ करें, 12 अंकों का बिल नंबर हाथ से टाइप करें और सपोर्ट को बताएं।\"",
    level: 'Level 2',
    samplePhrases: [
          "Wipe camera lens with clean microfiber cloth.",
          "Type tracking consignment number manually on touchpad.",
          "Switch to spare scanner kept at charging station."
    ],
    sampleLearnerSpoken: "Clean lens and type 12 digit tracking number manually.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'smartphone'
  },
  {
    id: 'logistics-level3-how-do-you-coordinate-wit-2',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "How do you coordinate with the night shift supervisor during parcel handoff?",
    questionHi: "पार्सल हैंडऑफ के दौरान नाइट शिफ्ट सुपरवाइजर के साथ तालमेल कैसे बिठाते हैं?",
    hintEn: "Review dispatch manifests, tally physical carton count, flag return orders, and sign handover sheet.",
    hintHi: "लिस्ट देखें, कार्टन गिनें, रिटर्न पार्सल अलग करें और हस्ताक्षर करें।",
    level: 'Level 3',
    samplePhrases: [
          "We physically verify total count of 350 parcels against the system manifest.",
          "Damaged items and pending OTP orders are highlighted in red ink.",
          "Both shift supervisors sign the official handover register before departure."
    ],
    sampleLearnerSpoken: "Verify 350 boxes count, check return parcels, sign handover register.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'file-text'
  },
  {
    id: 'workplace-level1-can-you-print-five-copies-2',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "Can you print five copies of today's shift schedule?",
    questionHi: "क्या आप आज के शिफ्ट शेड्यूल की पांच प्रतियां प्रिंट कर सकते हैं?",
    hintEn: "Say: \"Sure, printing them on printer 2 right now.\"",
    hintHi: "कहें: \"ज़रूर, प्रिंटर 2 से अभी प्रिंट निकालता हूँ।\"",
    level: 'Level 1',
    samplePhrases: [
          "Printing five copies now.",
          "Printout is ready at front desk.",
          "Here are your schedule copies."
    ],
    sampleLearnerSpoken: "Yes sir, printing 5 copies right now.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'printer'
  },
  {
    id: 'workplace-level1-where-are-the-spare-therm-2',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "Where are the spare thermal paper rolls kept?",
    questionHi: "स्पेयर थर्मल पेपर रोल कहाँ रखे हैं?",
    hintEn: "Say: \"They are in cabinet number 4 under the billing desk.\"",
    hintHi: "कहें: \"वे बिलिंग डेस्क के नीचे कैबिनेट नंबर 4 में हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Inside cabinet number four.",
          "Underneath the POS computer.",
          "Two boxes are left in storage."
    ],
    sampleLearnerSpoken: "In cabinet 4 under billing counter.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'file'
  },
  {
    id: 'workplace-level2-how-do-you-politely-ask-a-2',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "How do you politely ask a coworker to speak softly during a client call?",
    questionHi: "क्लाइंट कॉल के दौरान साथी से धीरे बोलने के लिए विनम्रता से कैसे कहेंगे?",
    hintEn: "Say: \"Excuse me brother, I am on an urgent client audio call, could you speak a little softer please?\"",
    hintHi: "कहें: \"क्षमा करें भाई, मेरी क्लाइंट कॉल चल रही है, क्या थोड़ा धीरे बोल सकते हैं?\"",
    level: 'Level 2',
    samplePhrases: [
          "Could you please lower voice for five minutes?",
          "I am on client discussion line.",
          "Thank you so much for understanding brother."
    ],
    sampleLearnerSpoken: "Brother please talk little soft, client on call.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'volume-x'
  },
  {
    id: 'workplace-level2-what-will-you-say-when-as-2',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "What will you say when asking your manager for a salary slip certificate?",
    questionHi: "मैनेजर से सैलरी स्लिप सर्टिफिकेट मांगते समय क्या कहेंगे?",
    hintEn: "Say: \"Good morning sir, I need my last 3 months stamped salary slips for a bank loan application.\"",
    hintHi: "कहें: \"नमस्ते सर, बैंक लोन के लिए पिछले 3 महीने की सैलरी स्लिप चाहिए।\"",
    level: 'Level 2',
    samplePhrases: [
          "Sir, could HR please email last three months pay slips?",
          "Need signed salary slips for bike loan approval.",
          "Submitted formal request on employee portal."
    ],
    sampleLearnerSpoken: "Sir please email last 3 months stamped salary slips.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'file-text'
  },
  {
    id: 'workplace-level3-how-do-you-welcome-and-on-2',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "How do you welcome and onboard a newly joined team member on their first morning?",
    questionHi: "काम के पहले दिन नए जुड़े साथी का स्वागत और मार्गदर्शन कैसे करेंगे?",
    hintEn: "Introduce yourself warmly, show locker room, biometric punch machine, water dispenser, and shift buddies.",
    hintHi: "गर्मजोशी से स्वागत करें, लॉकर, हाजिरी मशीन और टीम से परिचय कराएं।",
    level: 'Level 3',
    samplePhrases: [
          "Welcome to our logistics center Rahul, let me show you where our team sits.",
          "Here is our attendance fingerprint scanner and tea break area.",
          "Feel free to ask me any questions throughout your initial training week."
    ],
    sampleLearnerSpoken: "Welcome to team Rahul, I show lockers, biometric and work process.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'user-plus'
  },
  {
    id: 'qsr_retail-level1-do-you-need-a-carry-bag-f-2',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Do you need a carry bag for these purchases?",
    questionHi: "क्या आपको इन सामानों के लिए कैरी बैग चाहिए?",
    hintEn: "Say: \"Small cloth bag is 7 rupees and large is 12 rupees.\"",
    hintHi: "कहें: \"छोटा कपड़ा बैग 7 रुपये का है और बड़ा 12 रुपये का।\"",
    level: 'Level 1',
    samplePhrases: [
          "Do you want carry bag sir?",
          "Small cloth bag is seven rupees.",
          "I have brought my own bag."
    ],
    sampleLearnerSpoken: "Need carry bag sir? Seven rupees cloth bag.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'shopping-bag'
  },
  {
    id: 'qsr_retail-level1-where-can-i-find-cooking--2',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Where can I find cooking oil and basmati rice?",
    questionHi: "मुझे कुकिंग ऑयल और बासमती चावल कहाँ मिलेंगे?",
    hintEn: "Say: \"Cooking oils are in Aisle 2 and rice bags are in Aisle 3.\"",
    hintHi: "कहें: \"कुकिंग ऑयल आइल 2 में हैं और चावल के बैग आइल 3 में हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Cooking oil is in aisle two.",
          "Rice packets are right behind you.",
          "Follow the grocery signboard."
    ],
    sampleLearnerSpoken: "Oil in aisle 2 and basmati rice in aisle 3.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'search'
  },
  {
    id: 'qsr_retail-level2-how-do-you-inform-a-shopp-2',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "How do you inform a shopper that their card transaction was declined?",
    questionHi: "ग्राहक को कैसे बताएंगे कि उनका कार्ड पेमेंट फेल हो गया है?",
    hintEn: "Politely say: \"Sir, machine shows bank server timed out. Could we try inserting card again or scan UPI?\"",
    hintHi: "कहें: \"सर, बैंक सर्वर टाइमआउट हुआ है। क्या दोबारा कार्ड लगाएं या यूपीआई करें?\"",
    level: 'Level 2',
    samplePhrases: [
          "Card transaction did not go through, sir.",
          "Please check if international or online swipe is active.",
          "Would you like to scan our PhonePe QR stand?"
    ],
    sampleLearnerSpoken: "Sir transaction declined by bank, please try UPI or retry card.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'credit-card'
  },
  {
    id: 'qsr_retail-level2-a-customer-is-asking-for--2',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "A customer is asking for a discount on a fixed price branded item. How do you respond?",
    questionHi: "ग्राहक फिक्स्ड प्राइस ब्रांडेड सामान पर छूट मांग रहा है। आप क्या जवाब देंगे?",
    hintEn: "Say: \"Sir, prices are computer fixed by brand, but you earn 5% loyalty reward points on your mobile number.\"",
    hintHi: "कहें: \"सर, रेट फिक्स हैं, लेकिन आपको नंबर पर 5% रिवॉर्ड पॉइंट मिलेंगे।\"",
    level: 'Level 2',
    samplePhrases: [
          "Sir, these are system-locked brand prices.",
          "We have buy one get one offer on rack three.",
          "You will get 50 rupees cashback on our membership app."
    ],
    sampleLearnerSpoken: "Sir prices system fixed, but you get membership points.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'percent'
  },
  {
    id: 'qsr_retail-level3-describe-how-you-maintain-2',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Describe how you maintain food hygiene and cleanliness at a fast-food serving station.",
    questionHi: "फास्ट-फूड सर्विंग स्टेशन पर खाद्य स्वच्छता और सफाई कैसे बनाए रखते हैं?",
    hintEn: "Mention wearing fresh gloves and hairnets, sanitizing counters every 30 minutes, and checking food thermometer temps.",
    hintHi: "दस्ताने, हेयरनेट, हर 30 मिनट में काउंटर सैनिटाइजेशन और तापमान की जांच बताएं।",
    level: 'Level 3',
    samplePhrases: [
          "We sanitize food preparation slabs every half hour with food-grade disinfectant.",
          "Staff strictly wear disposable hairnets, aprons, and nitrile gloves.",
          "Hot food is maintained above 65 degrees Celsius to guarantee safety."
    ],
    sampleLearnerSpoken: "Wear hairnet and gloves, clean counters every 30 min, check hot food temp.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'shield-check'
  },
  {
    id: 'daily_routine-level1-how-much-is-the-auto-rick-2',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "How much is the auto rickshaw fare to the railway station by meter?",
    questionHi: "मीटर से रेलवे स्टेशन तक का ऑटो किराया कितना है?",
    hintEn: "Say: \"Meter fare will be around 70 to 80 rupees.\"",
    hintHi: "कहें: \"मीटर का किराया लगभग 70 से 80 रुपये होगा।\"",
    level: 'Level 1',
    samplePhrases: [
          "Please turn on the meter bhaiya.",
          "Meter shows 75 rupees.",
          "Here is exact eighty rupees."
    ],
    sampleLearnerSpoken: "Please run meter bhaiya, around 75 rupees.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'navigation'
  },
  {
    id: 'daily_routine-level1-did-you-lock-the-kitchen--2',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Did you lock the kitchen balcony door before leaving home?",
    questionHi: "क्या आपने घर से निकलने से पहले किचन बालकनी का दरवाजा बंद किया था?",
    hintEn: "Say: \"Yes, I double-locked both balcony and front door latch.\"",
    hintHi: "कहें: \"हाँ, मैंने बालकनी और मुख्य दरवाजा दोनों अच्छी तरह बंद किए।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes, balcony door is locked.",
          "Latched all windows tightly.",
          "Double checked lock before leaving."
    ],
    sampleLearnerSpoken: "Yes, balcony door locked properly.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'lock'
  },
  {
    id: 'daily_routine-level2-how-do-you-navigate-a-cro-2',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "How do you navigate a crowded metro interchange station like Rajiv Chowk?",
    questionHi: "राजीव चौक जैसे भीड़भाड़ वाले मेट्रो स्टेशन पर आप कैसे रास्ता तय करते हैं?",
    hintEn: "Say: \"Follow yellow floor stickers towards Yellow Line Platform 2 and keep left on escalators.\"",
    hintHi: "कहें: \"येलो लाइन के पीले निशानों का पालन करें और एस्केलेटर पर बाईं ओर रहें।\"",
    level: 'Level 2',
    samplePhrases: [
          "Follow the overhead signboards carefully.",
          "Walk on left side of staircases to avoid stampede.",
          "Listen to station announcements for train arrival."
    ],
    sampleLearnerSpoken: "Follow yellow line signage, walk left on escalator.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'compass'
  },
  {
    id: 'daily_routine-level2-explain-how-you-budget-yo-2',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Explain how you budget your monthly salary between rent, groceries, and savings.",
    questionHi: "बताएं कि आप किराए, राशन और बचत के बीच अपनी तनख्वाह का बजट कैसे बनाते हैं।",
    hintEn: "Say: \"40% goes for house rent and electricity, 30% for food and commute, and 30% goes directly into recurring deposit savings.\"",
    hintHi: "कहें: \"40% किराया, 30% खाना व आवागमन, और 30% बैंक बचत में जाता है।\"",
    level: 'Level 2',
    samplePhrases: [
          "I transfer savings amount on the day salary credits.",
          "Keep strict limit on online food orders.",
          "Use UPI passbook to track small daily spends."
    ],
    sampleLearnerSpoken: "40% rent, 30% food and travel, 30% bank savings.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'pie-chart'
  },
  {
    id: 'daily_routine-level3-describe-your-sunday-morn-2',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Describe your Sunday morning routine when you have a full day off with family.",
    questionHi: "रविवार की सुबह की अपनी दिनचर्या बताएं जब परिवार के साथ पूरी छुट्टी होती है।",
    hintEn: "Wake up without alarm, prepare special breakfast like aloo parathas, clean rooms, and wash scooter together.",
    hintHi: "आराम से उठना, आलू पराठे बनाना, कमरे साफ करना और मिलकर काम करना।",
    level: 'Level 3',
    samplePhrases: [
          "Sunday morning starts with hot aloo parathas and homemade curd.",
          "I wash my motorcycle and do laundry while listening to old Hindi songs.",
          "Afterwards, the whole family sits together to plan grocery shopping."
    ],
    sampleLearnerSpoken: "Wake late, make hot paratha breakfast, clean bike, spend time family.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'smile'
  },
  {
    id: 'friends-level1-what-street-food-snack-wo-2',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "What street food snack would you like to eat today?",
    questionHi: "आज आप कौन सा स्ट्रीट फूड स्नैक खाना चाहेंगे?",
    hintEn: "Say: \"Let us eat crispy pani puri with spicy mint water.\"",
    hintHi: "कहें: \"चलो तीखे पुदीना पानी के साथ पानी पूरी खाते हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Let us eat pani puri.",
          "Hot samosa and jalebi.",
          "One plate pav bhaji please."
    ],
    sampleLearnerSpoken: "Crispy pani puri with spicy water please.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'coffee'
  },
  {
    id: 'friends-level1-are-you-free-to-play-badm-2',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "Are you free to play badminton in the society park this evening?",
    questionHi: "क्या आज शाम आप पार्क में बैडमिंटन खेलने के लिए खाली हैं?",
    hintEn: "Say: \"Yes! Let us meet at the court at 5:30 PM.\"",
    hintHi: "कहें: \"हाँ! चलो शाम 5:30 बजे कोर्ट पर मिलते हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes, I am free at 5:30.",
          "Bring your racket along.",
          "Let us play 3 sets."
    ],
    sampleLearnerSpoken: "Yes free, meet at badminton court 5:30 PM.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'activity'
  },
  {
    id: 'friends-level2-how-do-you-invite-your-ap-2',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "How do you invite your apartment neighbors for Diwali sweets exchange?",
    questionHi: "अपार्टमेंट के पड़ोसियों को दिवाली की मिठाई के लिए कैसे आमंत्रित करेंगे?",
    hintEn: "Say: \"Namaste uncle, wishing you a happy Diwali! Please visit our flat this evening for sweets and snacks.\"",
    hintHi: "कहें: \"नमस्ते अंकल, दिवाली की शुभकामनाएं! शाम को मिठाई के लिए घर पधारें।\"",
    level: 'Level 2',
    samplePhrases: [
          "Happy Diwali to your entire family uncle!",
          "Please come over for homemade kaju katli.",
          "Looking forward to celebrating festival together."
    ],
    sampleLearnerSpoken: "Happy Diwali uncle, please come our home evening for sweets.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'sparkles'
  },
  {
    id: 'friends-level2-your-friend-is-nervous-ab-2',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "Your friend is nervous about their driving license test. How do you motivate them?",
    questionHi: "दोस्त ड्राइविंग लाइसेंस टेस्ट को लेकर घबराया हुआ है। उसका हौसला कैसे बढ़ाएंगे?",
    hintEn: "Say: \"Relax brother, you practiced parallel parking well; just check mirrors, use indicators, and stay calm.\"",
    hintHi: "कहें: \"शांत रहो भाई, तुमने अच्छी प्रैक्टिस की है; शीशे और इंडिकेटर सही रखना।\"",
    level: 'Level 2',
    samplePhrases: [
          "Take deep breaths, you are an excellent driver.",
          "Keep speed steady and wear seatbelt first.",
          "You will clear the track test easily brother!"
    ],
    sampleLearnerSpoken: "Relax bhai, you practiced well, drive slow and check mirrors.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'thumbs-up'
  },
  {
    id: 'friends-level3-how-would-you-organize-a--2',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "How would you organize a surprise birthday treat for your roommate on a small budget?",
    questionHi: "कम बजट में अपने रूममेट के लिए सरप्राइज बर्थडे ट्रीट कैसे आयोजित करेंगे?",
    hintEn: "Bake or buy a small pastry, decorate room with balloons, invite two close friends, and play acoustic guitar music.",
    hintHi: "पेस्ट्री, गुब्बारे, दो करीबी दोस्त और गाने बजाकर सरप्राइज देना।",
    level: 'Level 3',
    samplePhrases: [
          "We pooled 200 rupees each for chocolate truffle cake and streamers.",
          "Turned off room lights and greeted him with birthday song at midnight.",
          "Simple heartfelt celebrations create deeper memories than expensive parties."
    ],
    sampleLearnerSpoken: "Pooled money for cake, decorated room, midnight surprise birthday song.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'gift'
  },
  {
    id: 'supervisors-level1-have-you-verified-all-ret-2',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "Have you verified all return items in the computer system?",
    questionHi: "क्या आपने कंप्यूटर सिस्टम में सभी रिटर्न सामान सत्यापित कर लिए हैं?",
    hintEn: "Say: \"Yes sir, updated all 8 return items in portal.\"",
    hintHi: "कहें: \"हाँ सर, पोर्टल में सभी 8 रिटर्न आइटम अपडेट कर दिए हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes sir, system updated.",
          "All eight items logged.",
          "Printout attached to folder."
    ],
    sampleLearnerSpoken: "Yes sir, all return items verified in system.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'check-circle'
  },
  {
    id: 'supervisors-level1-can-you-work-the-early-mo-2',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "Can you work the early morning 6 AM shift tomorrow?",
    questionHi: "क्या आप कल सुबह 6 बजे की शिफ्ट में आ सकते हैं?",
    hintEn: "Say: \"Yes sir, I will report at 5:45 AM sharp.\"",
    hintHi: "कहें: \"हाँ सर, मैं ठीक 5:45 बजे रिपोर्ट करूँगा।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes sir, I will arrive on time.",
          "Will report at 5:45 AM.",
          "Available for early shift."
    ],
    sampleLearnerSpoken: "Yes sir, reporting 5:45 AM morning.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'clock'
  },
  {
    id: 'supervisors-level2-how-do-you-report-a-stock-2',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "How do you report a stock discrepancy of five missing jackets to your supervisor?",
    questionHi: "पांच जैकेटों की कमी की सूचना सुपरवाइजर को कैसे देंगे?",
    hintEn: "Say: \"Sir, during evening audit, physical count shows 45 jackets but inventory software shows 50. I am rechecking Rack 2.\"",
    hintHi: "कहें: \"सर, स्टॉक में 45 जैकेट हैं लेकिन सिस्टम में 50। मैं रैक 2 दोबारा चेक कर रहा हूँ।\"",
    level: 'Level 2',
    samplePhrases: [
          "Found difference of five pieces during shelf audit.",
          "Checking billing logs to see if dispatched without scan.",
          "Will cross verify with dispatch counter security CCTV."
    ],
    sampleLearnerSpoken: "Sir physical count 45 but system shows 50, rechecking rack.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'alert-triangle'
  },
  {
    id: 'supervisors-level2-in-a-job-interview-how-do-2',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "In a job interview, how do you answer: \"Why do you want to join our company?\"",
    questionHi: "इंटरव्यू में जवाब कैसे देंगे: \"आप हमारी कंपनी में क्यों शामिल होना चाहते हैं?\"",
    hintEn: "Highlight company growth, learning professional logistics systems, disciplined culture, and long-term career growth.",
    hintHi: "कंपनी की प्रगति, सीखने के अवसर और करियर की उन्नति बताएं।",
    level: 'Level 2',
    samplePhrases: [
          "Your company is recognized as an industry leader in logistics innovation.",
          "I want to build my career here because you value punctuality and hard work.",
          "This role matches my experience in warehouse management perfectly."
    ],
    sampleLearnerSpoken: "Your company has good reputation and growth, I want long term career here.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'award'
  },
  {
    id: 'supervisors-level3-how-do-you-discuss-with-y-2',
    category: 'supervisors',
    categoryLabel: 'Supervisor Talk',
    categoryHindi: 'सुपरवाइजर बातचीत',
    questionEn: "How do you discuss with your manager about wanting promotion to Assistant Shift Supervisor?",
    questionHi: "असिस्टेंट शिफ्ट सुपरवाइजर पद पर प्रमोशन के लिए मैनेजर से बात कैसे करेंगे?",
    hintEn: "Highlight 2 years zero-error record, training 10 junior pickers, managing attendance logs, and readiness for leadership.",
    hintHi: "2 साल का बेदाग रिकॉर्ड, नए लड़कों को सिखाना और जिम्मेदारी लेने की इच्छा बताएं।",
    level: 'Level 3',
    samplePhrases: [
          "Sir, over the past two years, I have maintained zero dispatch errors and trained ten new packers.",
          "I am eager to take on higher shift management responsibilities as Assistant Supervisor.",
          "I would be grateful for the opportunity to demonstrate my leadership skills."
    ],
    sampleLearnerSpoken: "Sir, 2 years zero errors and trained team, ready for Assistant Supervisor role.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'trending-up'
  },
  {
    id: 'customer-level1-what-is-your-registered-m-2',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "What is your registered mobile number for bill invoice?",
    questionHi: "बिल इनवॉइस के लिए आपका रजिस्टर्ड मोबाइल नंबर क्या है?",
    hintEn: "Say: \"My 10-digit mobile number is 9 8 7 6 5 4 3 2 1 0.\"",
    hintHi: "कहें: \"मेरा 10 अंकों का मोबाइल नंबर 9876543210 है।\"",
    level: 'Level 1',
    samplePhrases: [
          "Please tell mobile number.",
          "Invoice sent via WhatsApp.",
          "Number entered in system."
    ],
    sampleLearnerSpoken: "My mobile number is 9876543210 sir.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'phone'
  },
  {
    id: 'customer-level1-do-you-want-the-bill-rece-2',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "Do you want the bill receipt on WhatsApp or printed paper?",
    questionHi: "क्या आपको बिल रसीद व्हाट्सएप पर चाहिए या प्रिंट पेपर पर?",
    hintEn: "Say: \"Please send green e-bill on my WhatsApp.\"",
    hintHi: "कहें: \"कृपया मेरे व्हाट्सएप पर ई-बिल भेज दीजिए।\"",
    level: 'Level 1',
    samplePhrases: [
          "WhatsApp e-bill please.",
          "Paper printout needed.",
          "Eco-friendly message received."
    ],
    sampleLearnerSpoken: "WhatsApp e-bill is good sir.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'message-square'
  },
  {
    id: 'customer-level2-how-do-you-handle-a-custo-2',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "How do you handle a customer claiming they were charged twice for one bottle of shampoo?",
    questionHi: "ग्राहक का कहना है कि एक शैम्पू के दो बार पैसे कट गए। आप इसे कैसे सुलझाएंगे?",
    hintEn: "Say: \"Let me check invoice copy on POS system, cross check payment gateway, and process immediate cash refund if doubled.\"",
    hintHi: "कहें: \"सिस्टम में बिल चेक करता हूँ, अगर डबल कटा है तो तुरंत रिफंड करूँगा।\"",
    level: 'Level 2',
    samplePhrases: [
          "Let me inspect your printed bill and system log.",
          "Apologies sir, scanner beeped twice by mistake, processing refund right away.",
          "Here is fifty rupees cash refund and corrected tax invoice."
    ],
    sampleLearnerSpoken: "Let me check bill sir, if double scanned, refunding immediately.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'repeat'
  },
  {
    id: 'customer-level2-how-do-you-explain-warran-2',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "How do you explain warranty terms for an electronic kettle to a buyer?",
    questionHi: "इलेक्ट्रिक केतली की वारंटी शर्तें खरीदार को कैसे समझाएंगे?",
    hintEn: "Say: \"This product carries 1-year replacement warranty for heating element. Keep this stamped bill safely.\"",
    hintHi: "कहें: \"इस पर हीटिंग एलिमेंट की 1 साल की वारंटी है, स्टैम्प्ड बिल संभाल कर रखें।\"",
    level: 'Level 2',
    samplePhrases: [
          "One year manufacturer warranty included.",
          "Covers heating coil defects.",
          "Keep invoice slip for free service at authorized center."
    ],
    sampleLearnerSpoken: "One year warranty on coil, keep stamped bill for service.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'shield'
  },
  {
    id: 'customer-level3-a-customer-is-upset-becau-2',
    category: 'customer',
    categoryLabel: 'Customer Care',
    categoryHindi: 'ग्राहक सेवा',
    questionEn: "A customer is upset because home delivery arrived 2 hours after their birthday party started. How do you resolve this?",
    questionHi: "ग्राहक नाराज है क्योंकि जन्मदिन पार्टी शुरू होने के 2 घंटे बाद डिलीवरी पहुंची। आप इसे कैसे संभालेंगे?",
    hintEn: "Listen without arguing, apologize sincerely, waive delivery fee, offer complimentary dessert voucher, and update delivery logs.",
    hintHi: "बिना बहस सुने, दिल से माफी मांगें, डिलीवरी फीस माफ करें और कूपन दें।",
    level: 'Level 3',
    samplePhrases: [
          "I understand completely how upsetting this delay was for your party celebration.",
          "We are waiving your delivery fee and issuing a 200 rupee voucher for your next order.",
          "I am personally taking steps with our dispatch team so this never recurs."
    ],
    sampleLearnerSpoken: "So sorry for party delay sir, waiving delivery fee and giving discount voucher.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'smile'
  },
  {
    id: 'sheeko-level1-what-did-you-buy-with-you-2',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "What did you buy with your very first festival Diwali bonus?",
    questionHi: "दिवाली के पहले बोनस से आपने क्या खरीदा था?",
    hintEn: "Say: \"I bought a new ceiling fan for my parents' bedroom.\"",
    hintHi: "कहें: \"मैंने माता-पिता के कमरे के लिए नया पंखा खरीदा।\"",
    level: 'Level 1',
    samplePhrases: [
          "Bought sweets and clothes.",
          "Purchased mixer grinder for home.",
          "Gave bonus cash to father."
    ],
    sampleLearnerSpoken: "Bought new ceiling fan for parents room.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'gift'
  },
  {
    id: 'sheeko-level1-which-is-your-favorite-st-2',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Which is your favorite street in your hometown and why?",
    questionHi: "आपके शहर की पसंदीदा सड़क कौन सी है और क्यों?",
    hintEn: "Say: \"Gandhi Chowk market road because of the fresh samosas and book stalls.\"",
    hintHi: "कहें: \"गांधी चौक मार्केट रोड, क्योंकि वहाँ समोसे और किताबों की दुकानें हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Market road near clock tower.",
          "Peaceful temple street.",
          "Main bazaar filled with lights."
    ],
    sampleLearnerSpoken: "Gandhi Chowk market because best samosa and books.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'map'
  },
  {
    id: 'sheeko-level2-tell-the-story-of-how-you-2',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Tell the story of how you learned to ride a geared motorcycle.",
    questionHi: "गियर वाली मोटरसाइकिल चलाना सीखने की कहानी बताएं।",
    hintEn: "Describe elder brother teaching clutch balance, engine stalling on slope, and gaining confidence after one week.",
    hintHi: "बड़े भाई का सिखाना, क्लच का संतुलन, ढलान पर बंद होना और 1 हफ्ते में सीखना।",
    level: 'Level 2',
    samplePhrases: [
          "My uncle taught me clutch balance in open playground.",
          "Motorcycle engine stopped five times initially.",
          "Within ten days, I was riding smoothly in highway traffic."
    ],
    sampleLearnerSpoken: "Elder brother taught clutch balance, stalled early, then rode smoothly.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'compass'
  },
  {
    id: 'sheeko-level2-narrate-a-day-when-a-sudd-2',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Narrate a day when a sudden rainstorm forced everyone to seek shelter under a chai tapri.",
    questionHi: "उस दिन का वर्णन करें जब अचानक आई बारिश ने सबको चाय की टपरी पर रुकने को मजबूर किया।",
    hintEn: "Describe stranger office workers and delivery boys drinking hot tea together, laughing at thunder.",
    hintHi: "डिलीवरी लड़कों और दफ्तर के लोगों का साथ चाय पीना और बादलों की गड़गड़ाहट पर हंसना।",
    level: 'Level 2',
    samplePhrases: [
          "Sudden monsoon shower drenched everyone on main road.",
          "Twenty people crowded under small blue tin shed.",
          "Shared hot ginger tea and pakoras while waiting for rain to stop."
    ],
    sampleLearnerSpoken: "Heavy sudden rain, all strangers under chai tapri drinking hot tea.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'coffee'
  },
  {
    id: 'sheeko-level3-describe-an-inspiring-inc-2',
    category: 'sheeko',
    categoryLabel: 'Sheeko Stories',
    categoryHindi: 'कहानियां',
    questionEn: "Describe an inspiring incident where your village community came together to solve a crisis.",
    questionHi: "उस प्रेरक घटना का वर्णन करें जब आपके गांव वालों ने मिलकर किसी संकट का समाधान किया।",
    hintEn: "Explain broken irrigation canal or village road repair where youth and elders worked together without waiting for contractors.",
    hintHi: "नहर या सड़क टूटने पर युवाओं और बुजुर्गों का मिलकर खुद मरम्मत करना।",
    level: 'Level 3',
    samplePhrases: [
          "When monsoon flood washed away our wooden bridge, the youth mobilized sandbags.",
          "Every family contributed bamboo poles and tools to restore school connectivity.",
          "It proved that united teamwork can overcome any obstacle without waiting."
    ],
    sampleLearnerSpoken: "Village flood broke pathway, all families brought sandbags and rebuilt bridge.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'users'
  },
  {
    id: 'logistics-level1-what-is-the-delivery-otp--3',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "What is the delivery OTP for this parcel?",
    questionHi: "इस पार्सल के लिए डिलीवरी ओटीपी क्या है?",
    hintEn: "Say: \"Sir, please share the 4-digit OTP sent on your SMS.\"",
    hintHi: "कहें: \"सर, कृपया अपने एसएमएस पर आया 4 अंकों का ओटीपी साझा करें।\"",
    level: 'Level 1',
    samplePhrases: [
          "OTP is 5821 sir.",
          "Please check SMS on registered phone.",
          "OTP verified, here is your package."
    ],
    sampleLearnerSpoken: "Please share 4 digit OTP for parcel.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'package'
  },
  {
    id: 'logistics-level1-where-should-i-unload-the-3',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "Where should I unload these 10 heavy cartons?",
    questionHi: "मुझे ये 10 भारी कार्टन कहाँ उतारने चाहिए?",
    hintEn: "Say: \"Please stack them near Bay 3 on wooden pallets.\"",
    hintHi: "कहें: \"कृपया इन्हें लकड़ी के पैलेट पर बे 3 के पास रखें।\"",
    level: 'Level 1',
    samplePhrases: [
          "Keep near bay three.",
          "Stack on wooden pallet.",
          "Move to storage shelf B."
    ],
    sampleLearnerSpoken: "Stack 10 boxes near bay three pallet.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'truck'
  },
  {
    id: 'logistics-level1-is-the-delivery-vehicle-f-3',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "Is the delivery vehicle fuel tank full for today's route?",
    questionHi: "क्या आज के रूट के लिए डिलीवरी वाहन का फ्यूल टैंक फुल है?",
    hintEn: "Say: \"Yes, filled diesel at Indian Oil pump this morning.\"",
    hintHi: "कहें: \"हाँ, आज सुबह पेट्रोल पंप पर डीजल भरवा लिया था।\"",
    level: 'Level 1',
    samplePhrases: [
          "Full tank diesel filled.",
          "Fuel is at 80 percent.",
          "Receipt attached in logbook."
    ],
    sampleLearnerSpoken: "Full tank fuel filled morning time.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'truck'
  },
  {
    id: 'logistics-level2-how-will-you-explain-a-30-3',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "How will you explain a 30-minute delivery delay caused by waterlogging?",
    questionHi: "जलभराव के कारण हुई 30-मिनट की देरी की जानकारी कैसे देंगे?",
    hintEn: "Say: \"Sir, underpass was waterlogged after heavy downpour, reaching your location in 20 minutes.\"",
    hintHi: "कहें: \"सर, बारिश से अंडरपास में पानी भर गया था, 20 मिनट में पहुँच रहा हूँ।\"",
    level: 'Level 2',
    samplePhrases: [
          "Heavy rain caused road blockage on main flyover.",
          "Took bypass route to deliver parcel safely.",
          "Reaching your apartment gate in fifteen minutes."
    ],
    sampleLearnerSpoken: "Underpass waterlogged sir, taking diversion, reaching shortly.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'umbrella'
  },
  {
    id: 'logistics-level2-what-procedure-do-you-fol-3',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "What procedure do you follow when barcode scanner stops reading labels?",
    questionHi: "जब बारकोड स्कैनर लेबल पढ़ना बंद कर देता है तो आप क्या प्रक्रिया अपनाते हैं?",
    hintEn: "Say: \"Clean scanner lens, type 12-digit airway bill manually, and report to IT support desk.\"",
    hintHi: "कहें: \"लेंस साफ करें, 12 अंकों का बिल नंबर हाथ से टाइप करें और सपोर्ट को बताएं।\"",
    level: 'Level 2',
    samplePhrases: [
          "Wipe camera lens with clean microfiber cloth.",
          "Type tracking consignment number manually on touchpad.",
          "Switch to spare scanner kept at charging station."
    ],
    sampleLearnerSpoken: "Clean lens and type 12 digit tracking number manually.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'smartphone'
  },
  {
    id: 'logistics-level3-how-do-you-coordinate-wit-3',
    category: 'logistics',
    categoryLabel: 'Logistics',
    categoryHindi: 'लॉजिस्टिक्स',
    questionEn: "How do you coordinate with the night shift supervisor during parcel handoff?",
    questionHi: "पार्सल हैंडऑफ के दौरान नाइट शिफ्ट सुपरवाइजर के साथ तालमेल कैसे बिठाते हैं?",
    hintEn: "Review dispatch manifests, tally physical carton count, flag return orders, and sign handover sheet.",
    hintHi: "लिस्ट देखें, कार्टन गिनें, रिटर्न पार्सल अलग करें और हस्ताक्षर करें।",
    level: 'Level 3',
    samplePhrases: [
          "We physically verify total count of 350 parcels against the system manifest.",
          "Damaged items and pending OTP orders are highlighted in red ink.",
          "Both shift supervisors sign the official handover register before departure."
    ],
    sampleLearnerSpoken: "Verify 350 boxes count, check return parcels, sign handover register.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'file-text'
  },
  {
    id: 'workplace-level1-can-you-print-five-copies-3',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "Can you print five copies of today's shift schedule?",
    questionHi: "क्या आप आज के शिफ्ट शेड्यूल की पांच प्रतियां प्रिंट कर सकते हैं?",
    hintEn: "Say: \"Sure, printing them on printer 2 right now.\"",
    hintHi: "कहें: \"ज़रूर, प्रिंटर 2 से अभी प्रिंट निकालता हूँ।\"",
    level: 'Level 1',
    samplePhrases: [
          "Printing five copies now.",
          "Printout is ready at front desk.",
          "Here are your schedule copies."
    ],
    sampleLearnerSpoken: "Yes sir, printing 5 copies right now.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'printer'
  },
  {
    id: 'workplace-level1-where-are-the-spare-therm-3',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "Where are the spare thermal paper rolls kept?",
    questionHi: "स्पेयर थर्मल पेपर रोल कहाँ रखे हैं?",
    hintEn: "Say: \"They are in cabinet number 4 under the billing desk.\"",
    hintHi: "कहें: \"वे बिलिंग डेस्क के नीचे कैबिनेट नंबर 4 में हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Inside cabinet number four.",
          "Underneath the POS computer.",
          "Two boxes are left in storage."
    ],
    sampleLearnerSpoken: "In cabinet 4 under billing counter.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'file'
  },
  {
    id: 'workplace-level2-how-do-you-politely-ask-a-3',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "How do you politely ask a coworker to speak softly during a client call?",
    questionHi: "क्लाइंट कॉल के दौरान साथी से धीरे बोलने के लिए विनम्रता से कैसे कहेंगे?",
    hintEn: "Say: \"Excuse me brother, I am on an urgent client audio call, could you speak a little softer please?\"",
    hintHi: "कहें: \"क्षमा करें भाई, मेरी क्लाइंट कॉल चल रही है, क्या थोड़ा धीरे बोल सकते हैं?\"",
    level: 'Level 2',
    samplePhrases: [
          "Could you please lower voice for five minutes?",
          "I am on client discussion line.",
          "Thank you so much for understanding brother."
    ],
    sampleLearnerSpoken: "Brother please talk little soft, client on call.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'volume-x'
  },
  {
    id: 'workplace-level2-what-will-you-say-when-as-3',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "What will you say when asking your manager for a salary slip certificate?",
    questionHi: "मैनेजर से सैलरी स्लिप सर्टिफिकेट मांगते समय क्या कहेंगे?",
    hintEn: "Say: \"Good morning sir, I need my last 3 months stamped salary slips for a bank loan application.\"",
    hintHi: "कहें: \"नमस्ते सर, बैंक लोन के लिए पिछले 3 महीने की सैलरी स्लिप चाहिए।\"",
    level: 'Level 2',
    samplePhrases: [
          "Sir, could HR please email last three months pay slips?",
          "Need signed salary slips for bike loan approval.",
          "Submitted formal request on employee portal."
    ],
    sampleLearnerSpoken: "Sir please email last 3 months stamped salary slips.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'file-text'
  },
  {
    id: 'workplace-level3-how-do-you-welcome-and-on-3',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: "How do you welcome and onboard a newly joined team member on their first morning?",
    questionHi: "काम के पहले दिन नए जुड़े साथी का स्वागत और मार्गदर्शन कैसे करेंगे?",
    hintEn: "Introduce yourself warmly, show locker room, biometric punch machine, water dispenser, and shift buddies.",
    hintHi: "गर्मजोशी से स्वागत करें, लॉकर, हाजिरी मशीन और टीम से परिचय कराएं।",
    level: 'Level 3',
    samplePhrases: [
          "Welcome to our logistics center Rahul, let me show you where our team sits.",
          "Here is our attendance fingerprint scanner and tea break area.",
          "Feel free to ask me any questions throughout your initial training week."
    ],
    sampleLearnerSpoken: "Welcome to team Rahul, I show lockers, biometric and work process.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'user-plus'
  },
  {
    id: 'qsr_retail-level1-do-you-need-a-carry-bag-f-3',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Do you need a carry bag for these purchases?",
    questionHi: "क्या आपको इन सामानों के लिए कैरी बैग चाहिए?",
    hintEn: "Say: \"Small cloth bag is 7 rupees and large is 12 rupees.\"",
    hintHi: "कहें: \"छोटा कपड़ा बैग 7 रुपये का है और बड़ा 12 रुपये का।\"",
    level: 'Level 1',
    samplePhrases: [
          "Do you want carry bag sir?",
          "Small cloth bag is seven rupees.",
          "I have brought my own bag."
    ],
    sampleLearnerSpoken: "Need carry bag sir? Seven rupees cloth bag.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'shopping-bag'
  },
  {
    id: 'qsr_retail-level1-where-can-i-find-cooking--3',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Where can I find cooking oil and basmati rice?",
    questionHi: "मुझे कुकिंग ऑयल और बासमती चावल कहाँ मिलेंगे?",
    hintEn: "Say: \"Cooking oils are in Aisle 2 and rice bags are in Aisle 3.\"",
    hintHi: "कहें: \"कुकिंग ऑयल आइल 2 में हैं और चावल के बैग आइल 3 में हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Cooking oil is in aisle two.",
          "Rice packets are right behind you.",
          "Follow the grocery signboard."
    ],
    sampleLearnerSpoken: "Oil in aisle 2 and basmati rice in aisle 3.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'search'
  },
  {
    id: 'qsr_retail-level2-how-do-you-inform-a-shopp-3',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "How do you inform a shopper that their card transaction was declined?",
    questionHi: "ग्राहक को कैसे बताएंगे कि उनका कार्ड पेमेंट फेल हो गया है?",
    hintEn: "Politely say: \"Sir, machine shows bank server timed out. Could we try inserting card again or scan UPI?\"",
    hintHi: "कहें: \"सर, बैंक सर्वर टाइमआउट हुआ है। क्या दोबारा कार्ड लगाएं या यूपीआई करें?\"",
    level: 'Level 2',
    samplePhrases: [
          "Card transaction did not go through, sir.",
          "Please check if international or online swipe is active.",
          "Would you like to scan our PhonePe QR stand?"
    ],
    sampleLearnerSpoken: "Sir transaction declined by bank, please try UPI or retry card.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'credit-card'
  },
  {
    id: 'qsr_retail-level2-a-customer-is-asking-for--3',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "A customer is asking for a discount on a fixed price branded item. How do you respond?",
    questionHi: "ग्राहक फिक्स्ड प्राइस ब्रांडेड सामान पर छूट मांग रहा है। आप क्या जवाब देंगे?",
    hintEn: "Say: \"Sir, prices are computer fixed by brand, but you earn 5% loyalty reward points on your mobile number.\"",
    hintHi: "कहें: \"सर, रेट फिक्स हैं, लेकिन आपको नंबर पर 5% रिवॉर्ड पॉइंट मिलेंगे।\"",
    level: 'Level 2',
    samplePhrases: [
          "Sir, these are system-locked brand prices.",
          "We have buy one get one offer on rack three.",
          "You will get 50 rupees cashback on our membership app."
    ],
    sampleLearnerSpoken: "Sir prices system fixed, but you get membership points.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'percent'
  },
  {
    id: 'qsr_retail-level3-describe-how-you-maintain-3',
    category: 'qsr_retail',
    categoryLabel: 'Retail & Store',
    categoryHindi: 'रिटेल स्टोर',
    questionEn: "Describe how you maintain food hygiene and cleanliness at a fast-food serving station.",
    questionHi: "फास्ट-फूड सर्विंग स्टेशन पर खाद्य स्वच्छता और सफाई कैसे बनाए रखते हैं?",
    hintEn: "Mention wearing fresh gloves and hairnets, sanitizing counters every 30 minutes, and checking food thermometer temps.",
    hintHi: "दस्ताने, हेयरनेट, हर 30 मिनट में काउंटर सैनिटाइजेशन और तापमान की जांच बताएं।",
    level: 'Level 3',
    samplePhrases: [
          "We sanitize food preparation slabs every half hour with food-grade disinfectant.",
          "Staff strictly wear disposable hairnets, aprons, and nitrile gloves.",
          "Hot food is maintained above 65 degrees Celsius to guarantee safety."
    ],
    sampleLearnerSpoken: "Wear hairnet and gloves, clean counters every 30 min, check hot food temp.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'shield-check'
  },
  {
    id: 'daily_routine-level1-how-much-is-the-auto-rick-3',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "How much is the auto rickshaw fare to the railway station by meter?",
    questionHi: "मीटर से रेलवे स्टेशन तक का ऑटो किराया कितना है?",
    hintEn: "Say: \"Meter fare will be around 70 to 80 rupees.\"",
    hintHi: "कहें: \"मीटर का किराया लगभग 70 से 80 रुपये होगा।\"",
    level: 'Level 1',
    samplePhrases: [
          "Please turn on the meter bhaiya.",
          "Meter shows 75 rupees.",
          "Here is exact eighty rupees."
    ],
    sampleLearnerSpoken: "Please run meter bhaiya, around 75 rupees.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'navigation'
  },
  {
    id: 'daily_routine-level1-did-you-lock-the-kitchen--3',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Did you lock the kitchen balcony door before leaving home?",
    questionHi: "क्या आपने घर से निकलने से पहले किचन बालकनी का दरवाजा बंद किया था?",
    hintEn: "Say: \"Yes, I double-locked both balcony and front door latch.\"",
    hintHi: "कहें: \"हाँ, मैंने बालकनी और मुख्य दरवाजा दोनों अच्छी तरह बंद किए।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes, balcony door is locked.",
          "Latched all windows tightly.",
          "Double checked lock before leaving."
    ],
    sampleLearnerSpoken: "Yes, balcony door locked properly.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'lock'
  },
  {
    id: 'daily_routine-level2-how-do-you-navigate-a-cro-3',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "How do you navigate a crowded metro interchange station like Rajiv Chowk?",
    questionHi: "राजीव चौक जैसे भीड़भाड़ वाले मेट्रो स्टेशन पर आप कैसे रास्ता तय करते हैं?",
    hintEn: "Say: \"Follow yellow floor stickers towards Yellow Line Platform 2 and keep left on escalators.\"",
    hintHi: "कहें: \"येलो लाइन के पीले निशानों का पालन करें और एस्केलेटर पर बाईं ओर रहें।\"",
    level: 'Level 2',
    samplePhrases: [
          "Follow the overhead signboards carefully.",
          "Walk on left side of staircases to avoid stampede.",
          "Listen to station announcements for train arrival."
    ],
    sampleLearnerSpoken: "Follow yellow line signage, walk left on escalator.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'compass'
  },
  {
    id: 'daily_routine-level2-explain-how-you-budget-yo-3',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Explain how you budget your monthly salary between rent, groceries, and savings.",
    questionHi: "बताएं कि आप किराए, राशन और बचत के बीच अपनी तनख्वाह का बजट कैसे बनाते हैं।",
    hintEn: "Say: \"40% goes for house rent and electricity, 30% for food and commute, and 30% goes directly into recurring deposit savings.\"",
    hintHi: "कहें: \"40% किराया, 30% खाना व आवागमन, और 30% बैंक बचत में जाता है।\"",
    level: 'Level 2',
    samplePhrases: [
          "I transfer savings amount on the day salary credits.",
          "Keep strict limit on online food orders.",
          "Use UPI passbook to track small daily spends."
    ],
    sampleLearnerSpoken: "40% rent, 30% food and travel, 30% bank savings.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'pie-chart'
  },
  {
    id: 'daily_routine-level3-describe-your-sunday-morn-3',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक जीवन',
    questionEn: "Describe your Sunday morning routine when you have a full day off with family.",
    questionHi: "रविवार की सुबह की अपनी दिनचर्या बताएं जब परिवार के साथ पूरी छुट्टी होती है।",
    hintEn: "Wake up without alarm, prepare special breakfast like aloo parathas, clean rooms, and wash scooter together.",
    hintHi: "आराम से उठना, आलू पराठे बनाना, कमरे साफ करना और मिलकर काम करना।",
    level: 'Level 3',
    samplePhrases: [
          "Sunday morning starts with hot aloo parathas and homemade curd.",
          "I wash my motorcycle and do laundry while listening to old Hindi songs.",
          "Afterwards, the whole family sits together to plan grocery shopping."
    ],
    sampleLearnerSpoken: "Wake late, make hot paratha breakfast, clean bike, spend time family.",
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'smile'
  },
  {
    id: 'friends-level1-what-street-food-snack-wo-3',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "What street food snack would you like to eat today?",
    questionHi: "आज आप कौन सा स्ट्रीट फूड स्नैक खाना चाहेंगे?",
    hintEn: "Say: \"Let us eat crispy pani puri with spicy mint water.\"",
    hintHi: "कहें: \"चलो तीखे पुदीना पानी के साथ पानी पूरी खाते हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Let us eat pani puri.",
          "Hot samosa and jalebi.",
          "One plate pav bhaji please."
    ],
    sampleLearnerSpoken: "Crispy pani puri with spicy water please.",
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'coffee'
  },
  {
    id: 'friends-level1-are-you-free-to-play-badm-3',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "Are you free to play badminton in the society park this evening?",
    questionHi: "क्या आज शाम आप पार्क में बैडमिंटन खेलने के लिए खाली हैं?",
    hintEn: "Say: \"Yes! Let us meet at the court at 5:30 PM.\"",
    hintHi: "कहें: \"हाँ! चलो शाम 5:30 बजे कोर्ट पर मिलते हैं।\"",
    level: 'Level 1',
    samplePhrases: [
          "Yes, I am free at 5:30.",
          "Bring your racket along.",
          "Let us play 3 sets."
    ],
    sampleLearnerSpoken: "Yes free, meet at badminton court 5:30 PM.",
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'activity'
  },
  {
    id: 'friends-level2-how-do-you-invite-your-ap-3',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "How do you invite your apartment neighbors for Diwali sweets exchange?",
    questionHi: "अपार्टमेंट के पड़ोसियों को दिवाली की मिठाई के लिए कैसे आमंत्रित करेंगे?",
    hintEn: "Say: \"Namaste uncle, wishing you a happy Diwali! Please visit our flat this evening for sweets and snacks.\"",
    hintHi: "कहें: \"नमस्ते अंकल, दिवाली की शुभकामनाएं! शाम को मिठाई के लिए घर पधारें।\"",
    level: 'Level 2',
    samplePhrases: [
          "Happy Diwali to your entire family uncle!",
          "Please come over for homemade kaju katli.",
          "Looking forward to celebrating festival together."
    ],
    sampleLearnerSpoken: "Happy Diwali uncle, please come our home evening for sweets.",
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'sparkles'
  },
  {
    id: 'friends-level2-your-friend-is-nervous-ab-3',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "Your friend is nervous about their driving license test. How do you motivate them?",
    questionHi: "दोस्त ड्राइविंग लाइसेंस टेस्ट को लेकर घबराया हुआ है। उसका हौसला कैसे बढ़ाएंगे?",
    hintEn: "Say: \"Relax brother, you practiced parallel parking well; just check mirrors, use indicators, and stay calm.\"",
    hintHi: "कहें: \"शांत रहो भाई, तुमने अच्छी प्रैक्टिस की है; शीशे और इंडिकेटर सही रखना।\"",
    level: 'Level 2',
    samplePhrases: [
          "Take deep breaths, you are an excellent driver.",
          "Keep speed steady and wear seatbelt first.",
          "You will clear the track test easily brother!"
    ],
    sampleLearnerSpoken: "Relax bhai, you practiced well, drive slow and check mirrors.",
    cardColor: 'from-[#FEF2F2] to-[#FEE2E2]',
    iconType: 'thumbs-up'
  },
  {
    id: 'friends-level3-how-would-you-organize-a--3',
    category: 'friends',
    categoryLabel: 'Friends',
    categoryHindi: 'दोस्त',
    questionEn: "How would you organize a surprise birthday treat for your roommate on a small budget?",
    questionHi: "कम बजट में अपने रूममेट के लिए सरप्राइज बर्थडे ट्रीट कैसे आयोजित करेंगे?",
    hintEn: "Bake or buy a small pastry, decorate room with balloons, invite two close friends, and play acoustic guitar music.",
    hintHi: "पेस्ट्री, गुब्बारे, दो करीबी दोस्त और गाने बजाकर सरप्राइज देना।",
    level: 'Level 3',
    samplePhrases: [
          "We pooled 200 rupees each for chocolate truffle cake and streamers.",
          "Turned off room lights and greeted him with birthday song at midnight.",
          "Simple heartfelt celebrations create deeper memories than expensive parties."
    ],
    sampleLearnerSpoken: "Pooled money for cake, decorated room, midnight surprise birthday song.",
    cardColor: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconType: 'gift'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Situations', hindi: 'सभी स्थितियां', icon: 'sparkles' },
  { id: 'workplace', label: 'Workplace', hindi: 'कार्यस्थल', icon: 'briefcase' },
  { id: 'daily_routine', label: 'Daily Routine', hindi: 'दैनिक जीवन', icon: 'coffee' },
  { id: 'friends', label: 'Friends Conversation', hindi: 'दोस्तों से बातचीत', icon: 'users' },
  { id: 'sheeko', label: 'My Day (Stories)', hindi: 'दैनिक दिनचर्या और कहानियां', icon: 'book-open' },
];


