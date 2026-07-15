import FAQClient from "./faq/FAQClient";
import SEO from "@/components/SEO";

const faqs = [
  {
    question: "What is a private party theatre?",
    answer: "A private party theatre is an exclusive cinema hall booked just for you and your guests. At JOY Celebrations in Vijayawada, we offer a luxury 4K screening experience combined with premium decorations for birthdays, anniversaries, and romantic dates."
  },
  {
    question: "How do I book the private theatre?",
    answer: "You can easily book directly through our website by clicking the 'Book Now' button. Select your preferred package, date, and time slot, and securely complete the payment. You can also contact our team via WhatsApp for any booking assistance."
  },
  {
    question: "Where is JOY Celebrations located in Vijayawada?",
    answer: "Our premium private theatre is conveniently located in the heart of Gunadala, Vijayawada. We provide a safe, accessible, and luxurious space for all your celebration needs with ample parking space."
  },
  {
    question: "Can we bring outside food and drinks?",
    answer: "Yes, you are welcome to bring your own outside food and non-alcoholic beverages. We also offer delicious add-ons like customized cakes, snacks, and refreshing mocktails when you book your slot."
  },
  {
    question: "Is it safe and private for couples?",
    answer: "Absolutely! JOY Celebrations guarantees 100% privacy and security. Our venue is highly secure, family-friendly, and provides an intimate, undisturbed environment perfect for romantic couple date nights, surprise proposals, and peaceful movie screenings."
  },
  {
    question: "Are custom decorations included in the packages?",
    answer: "Basic beautiful decorations are included in all our standard packages. For more elaborate setups—like premium balloon arches, LED name boards, rose petal pathways, and cinematic fog effects—we offer premium packages or customizable add-ons."
  },
  {
    question: "Can I bring my own cake for a birthday celebration?",
    answer: "Yes, you can absolutely bring your own birthday or anniversary cake! If you'd rather not carry one, you can pre-order a fresh, customized cake directly through our booking add-ons."
  },
  {
    question: "How many guests are allowed in the private theatre?",
    answer: "Our luxury private theatre is designed to comfortably accommodate up to 6-8 guests depending on the package chosen, making it perfect for couples, small families, or close friend groups."
  },
  {
    question: "What is your cancellation and refund policy?",
    answer: "We understand that plans change. We offer flexible rescheduling if you notify us at least 24 hours in advance. For cancellations, please refer to our detailed cancellation policy page or contact our support team via WhatsApp for a partial refund."
  },
  {
    question: "Is parking available at the venue?",
    answer: "Yes, we provide safe and secure parking facilities for two-wheelers and four-wheelers directly at our location in Gunadala, Vijayawada, ensuring a hassle-free visit."
  },
  {
    question: "Do I need to book in advance?",
    answer: "Yes, advance booking is highly recommended. Since we offer an exclusive private theatre experience, slots fill up very quickly, especially on weekends and holidays. Book online early to secure your preferred date and time."
  },
  {
    question: "Can I connect my own phone or laptop to the screen?",
    answer: "Yes, we provide easy connectivity options including HDMI and wireless casting so you can seamlessly play your own surprise videos, photo slideshows, or stream your favorite movies directly on our massive 4K screen."
  },
  {
    question: "Do you organize surprise proposal decorations?",
    answer: "We specialize in surprise proposals! We can arrange everything from a romantic rose petal pathway and 'Marry Me' neon signs to cinematic fog effects, making your proposal in Vijayawada an unforgettable magical moment."
  },
  {
    question: "Are there any hidden charges?",
    answer: "No, we believe in 100% transparency. The final price you see during the checkout process on our website includes the theatre rental and selected decorations/add-ons. There are absolutely no hidden fees."
  },
  {
    question: "Can we play loud music inside?",
    answer: "Yes, our theatre features a premium, acoustically treated Dolby Atmos sound system. You can enjoy loud, immersive, theater-quality sound without worrying about disturbing others, as our rooms are fully soundproofed."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

export default function FAQPage() {
  return (
    <div style={{ padding: '8rem 5% 5rem', minHeight: '100vh' }}>
      <SEO 
        title="FAQ - Private Theatre Booking | JOY Celebrations"
        description="Have questions about booking a private theatre in Vijayawada? Read our FAQ regarding decorations, food, cakes, capacity, and cancellation policies at JOY Celebrations."
        keywords="Private theatre FAQ, Vijayawada party theatre questions, Private screening rules, Birthday celebration decorations, Proposal setup Vijayawada"
        canonicalUrl="/faq"
        schema={faqSchema}
      />
      
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="heading-luxury" style={{ textAlign: 'center', marginBottom: '1rem', color: '#d4af37' }}>Frequently Asked Questions</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Everything you need to know about Vijayawada's best private theatre experience.
        </p>

        <FAQClient faqs={faqs} />
      </main>
    </div>
  );
}
