import SQLFormatterPage from '@/pages/SQLFormatterPage';

export const metadata = {
  title: 'SQL Formatter – Format & Beautify SQL Online | DevToolz',
  description:
    'Format, beautify, and minify SQL queries online. Supports MySQL, PostgreSQL, SQLite, T-SQL, PL/SQL, and BigQuery. Choose keyword case and indent style. Runs entirely in your browser.',
};

export default function SQLFormatter() {
  return <SQLFormatterPage />;
}
