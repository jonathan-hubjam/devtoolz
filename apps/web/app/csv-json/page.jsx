import CSVJSONPage from '@/pages/CSVJSONPage';

export const metadata = {
  title: 'CSV to JSON Converter – Convert CSV ↔ JSON Online | DevToolz',
  description:
    'Convert CSV to JSON or JSON to CSV instantly online. Supports custom delimiters, quoted fields, header rows, and pretty-print output. Runs entirely in your browser.',
};

export default function CSVJSON() {
  return <CSVJSONPage />;
}
