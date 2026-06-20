import SQLFormatterPage from '@/pages/SQLFormatterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'SQL Formatter – Format & Beautify SQL Online | DevToolz',
  description:
    'Format, beautify, and minify SQL queries online. Supports MySQL, PostgreSQL, SQLite, T-SQL, PL/SQL, and BigQuery. Choose keyword case and indent style. Runs entirely in your browser.',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does formatting change how a query executes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. SQL is case-insensitive for keywords and whitespace-insensitive. Formatting only affects how the query looks — the database query planner sees the exact same logical structure regardless of indentation."
      }
    },
    {
      "@type": "Question",
      "name": "Why do I need to select a SQL dialect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Different databases have different reserved words and syntax extensions. Selecting the correct dialect ensures that database-specific keywords (like PostgreSQL's RETURNING or MySQL's LIMIT placement) are handled correctly."
      }
    },
    {
      "@type": "Question",
      "name": "Should SQL keywords be uppercase or lowercase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Convention favours uppercase keywords (SELECT, FROM, WHERE) to visually distinguish them from table and column names. Most style guides and linters enforce this, though it is purely aesthetic."
      }
    }
  ]
};

export default function SQLFormatter() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <SQLFormatterPage />
    </>
  );
}
