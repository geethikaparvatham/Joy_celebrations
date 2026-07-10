"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQClient({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div 
            key={index} 
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '12px', 
              border: '1px solid rgba(212, 175, 55, 0.1)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
              borderColor: isOpen ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0.1)'
            }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                padding: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              aria-expanded={isOpen}
            >
              <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 500, color: isOpen ? '#d4af37' : 'white', transition: 'color 0.3s ease' }}>
                {faq.question}
              </h2>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: '#d4af37' }}
              >
                <ChevronDown size={24} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div style={{ 
                    padding: '0 2rem 2rem 2rem', 
                    color: 'var(--text-secondary)', 
                    lineHeight: '1.6',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    marginTop: '-0.5rem',
                    paddingTop: '1.5rem'
                  }}>
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
