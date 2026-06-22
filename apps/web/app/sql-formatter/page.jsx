import SQLFormatterPage from '@/pages/SQLFormatterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'SQL Formatter – Format & Beautify SQL Online | DevToolz',
  description:
    'Format, beautify, and minify SQL queries online. Supports MySQL, PostgreSQL, SQLite, T-SQL, PL/SQL, and BigQuery. Choose keyword case and indent style. Runs entirely in your browser.',
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SQL Formatter",
  "description": "Format, beautify, and minify SQL queries online. Supports MySQL, PostgreSQL, SQLite, T-SQL, PL/SQL, and BigQuery. Choose keyword case and indent style. Runs entirely in your browser.",
  "url": "https://devtoolz.net/sql-formatter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function SQLFormatter() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <SQLFormatterPage />
    </>
  );
}
