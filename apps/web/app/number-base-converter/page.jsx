import NumberBaseConverterPage from '@/pages/NumberBaseConverterPage';

export const metadata = {
  title: 'Number Base Converter – Decimal, Hex, Binary, Octal | DevToolz',
  description:
    'Convert numbers between decimal, hexadecimal, octal, and binary. BigInt precision, nibble-grouped binary output, and bit-width indicators.',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is hexadecimal used so often in programming?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hexadecimal is a compact representation of binary — one hex digit maps exactly to four bits (a nibble). This makes hex ideal for representing memory addresses, byte values, colour codes, and bitmasks. Reading 0xFF is much easier than reading 11111111."
      }
    },
    {
      "@type": "Question",
      "name": "How do I convert a negative number to binary?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Negative integers in computers are most commonly represented in two's complement. To convert: invert all bits of the positive value and add 1. The result's most significant bit is 1 for negative numbers. The bit width (8, 16, 32, 64) matters for the result."
      }
    },
    {
      "@type": "Question",
      "name": "Can I convert between any two bases, or only the common ones?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mathematically, conversion works between any bases 2–36 (using digits 0–9 and letters A–Z). This tool supports bases 2 through 36. Less common bases like base 3 (ternary) and base 60 (sexagesimal, used for time) are valid inputs."
      }
    }
  ]
};

export default function NumberBaseConverter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <NumberBaseConverterPage />
    </>
  );
}
