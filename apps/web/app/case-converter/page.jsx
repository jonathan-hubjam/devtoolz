import CaseConverterPage from '@/pages/CaseConverterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Case Converter – Convert Text Case Online | DevToolz',
  description:
    'Convert text to lowercase, UPPERCASE, Title Case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and more. Live conversion, one click to copy.',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between camelCase and PascalCase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "camelCase starts with a lowercase letter (myVariable). PascalCase (also called UpperCamelCase) starts with an uppercase letter (MyVariable). PascalCase is typically used for class names and React components; camelCase for variables and function names."
      }
    },
    {
      "@type": "Question",
      "name": "Why do different languages use different naming conventions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Naming conventions are driven by community style guides and historical precedent. Python's PEP 8 mandates snake_case; JavaScript conventions favour camelCase; CSS uses kebab-case. These are not enforced by the languages themselves but by linters and peer review."
      }
    },
    {
      "@type": "Question",
      "name": "Can I convert multiple lines at once?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — paste multiple identifiers or words, one per line, and the converter will process each line independently, preserving the line structure in the output."
      }
    }
  ]
};

export default function CaseConverter() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <CaseConverterPage />
    </>
  );
}
