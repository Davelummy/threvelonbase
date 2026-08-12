export const faqItems = [
  {
    id: "devices",
    question: "What devices do you repair?",
    answer:
      "Phones, laptops, tablets, power banks, Bluetooth devices, speakers, MP3 players and other everyday electronics. Typical work includes screens and touch, charging ports and batteries, liquid damage, board-level and microsoldering, software, flashing and formatting, speakers, cameras and buttons, network and signal issues, and general diagnostics.",
  },
  {
    id: "start",
    question: "How do I start a repair?",
    answer:
      "Use the repair request form on this website. It prepares a WhatsApp draft you can review, edit and send. You can also call, message on WhatsApp, or visit Shop 12A, Cash Hold Shopping Complex, Arakale Road, Akure during workshop hours.",
  },
  {
    id: "price",
    question: "Do I get a price before work starts?",
    answer:
      "Yes. Every job starts with diagnosis. The workshop explains the required work, and work begins only after you agree the price, deposit and expected timing.",
  },
  {
    id: "timing",
    question: "How long will a repair take?",
    answer:
      "Timing depends on the fault, the required part and the work involved. The workshop confirms the expected timing after diagnosis.",
  },
  {
    id: "location",
    question: "Where is the workshop?",
    answer:
      "Shop 12A, Cash Hold Shopping Complex, Arakale Road, Akure, Ondo State, Nigeria. The footer map opens the same location in Google Maps.",
  },
  {
    id: "hours",
    question: "When are you open?",
    answer: "Monday-Saturday, 8:00 AM-6:00 PM.",
  },
  {
    id: "contact",
    question: "How can I contact you?",
    answer:
      "WhatsApp is usually the fastest path. You can also call +234 803 772 2368 or +234 903 608 8295, email threvelonbase@gmail.com, visit during workshop hours, or reach the shop on Instagram at @threvelonbase.",
  },
  {
    id: "devices-sale",
    question: "Do you sell phones and accessories?",
    answer:
      "Yes. Ask what is currently available and speak with the team before you buy. Say whether you want a new or used phone so the workshop has the right context. Accessories include chargers, cables, batteries, cases, screen protection, audio accessories and laptop add-ons.",
  },
  {
    id: "training",
    question: "Do you offer training?",
    answer:
      "Threvelonbase Academy combines supervised mobile-phone repair practice with customer service, business ethics, punctuality and professional conduct. Ask about the academy on WhatsApp.",
  },
  {
    id: "website",
    question: "Does this website take payment or store my repair details?",
    answer:
      "No. This website does not collect online payment, keep a customer account, or store repair form submissions. Form details open as a WhatsApp draft on your device. You control that draft before it is sent.",
  },
] as const;

export type FaqItem = (typeof faqItems)[number];
