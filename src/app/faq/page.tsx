import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'FAQ | JOY Celebrations Vijayawada',
  description: 'Frequently asked questions about booking a private party theatre in Vijayawada at JOY Celebrations.',
  keywords: ['FAQ Joy Celebrations', 'Private Party Theatre in Vijayawada FAQ', 'Couple Theatre Rules'],
};

const faqs = [
  {
    question: "What is a private party theatre?",
    answer: "A private party theatre is an exclusive cinema hall booked just for you and your guests. At JOY Celebrations in Vijayawada, we offer a luxury 4K screening experience combined with premium decorations for birthdays, anniversaries, and romantic dates."
  },
  {
    question: "How do I book the theatre?",
    answer: "You can book directly through our website by clicking the 'Book Now' button, selecting your package, date, and time, and completing the payment. You can also contact us via WhatsApp for assistance."
  },
  {
    question: "Can we bring outside food?",
    answer: "Yes, you can bring your own food and non-alcoholic beverages. We also offer cakes and special snacks as add-ons if you prefer."
  },
  {
    question: "Is it safe for couples?",
    answer: "Absolutely! JOY Celebrations is a highly secure, family-friendly, and private environment perfect for couple date nights, proposals, and family gatherings."
  },
  {
    question: "Are decorations included?",
    answer: "Basic decorations are included in some packages, and premium themed decorations (like balloons, LED names, rose petals, fog effects) are included in our higher-tier plans or available as add-ons."
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
    <div className={styles.container} style={{ padding: '8rem 5% 5rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="heading-luxury" style={{ textAlign: 'center', marginBottom: '1rem', color: '#d4af37' }}>Frequently Asked Questions</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Everything you need to know about Vijayawada's best private theatre experience.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>{faq.question}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
