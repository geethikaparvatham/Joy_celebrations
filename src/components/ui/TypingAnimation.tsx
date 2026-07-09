"use client";

import { useState, useEffect } from "react";

const words = ["Birthday", "Anniversary", "Bride to Be", "Groom to Be"];

export default function TypingAnimation() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const timeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  // Typing logic
  useEffect(() => {
    if (subIndex === words[index].length && !isDeleting) {
      // Pause at the end of the word
      const timeout = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      // Move to next word
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  return (
    <span className="gold-text" style={{ display: "inline-block", minWidth: "180px", textAlign: "center" }}>
      {words[index].substring(0, subIndex)}
      <span style={{ opacity: blink ? 1 : 0, fontWeight: "normal" }}>|</span>
    </span>
  );
}
