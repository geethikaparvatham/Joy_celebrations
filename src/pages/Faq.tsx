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
    question: "What is your cancellation and refund policy?",
    answer: "We understand that plans change. We offer flexible rescheduling if you notify us at least 24 hours in advance. For cancellations, please refer to our detailed cancellation policy page or contact our support team via WhatsApp for a partial refund."
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
