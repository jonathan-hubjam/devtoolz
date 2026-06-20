import RegexTesterPage from '@/pages/RegexTesterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Regex Tester – Free Online Regular Expression Tool | DevToolz',
  description: 'Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags. All processing happens locally in your browser.',
  openGraph: {
    title: 'Regex Tester – Free Online Regular Expression Tool | DevToolz',
    description: 'Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why does my regex work here but not in Python?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Different languages implement slightly different regex flavours. JavaScript lacks lookbehind assertions in older engines, uses different escape sequences, and does not support POSIX classes. Test your pattern in the language you will actually deploy it in if exact matching matters."
      }
    },
    {
      "@type": "Question",
      "name": "What is catastrophic backtracking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Certain regex patterns (especially nested quantifiers like (a+)+) can cause the engine to explore an exponential number of paths before determining there is no match — this can freeze your application. Test with long, non-matching inputs to check for backtracking issues."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a greedy and a lazy quantifier?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Greedy quantifiers (*, +, ?) match as much as possible. Lazy quantifiers (*?, +?, ??) match as little as possible. Use lazy quantifiers when you want to stop at the first match rather than the last."
      }
    }
  ]
};

export default function RegexTester() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <RegexTesterPage />
    </>
  );
}
