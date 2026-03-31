import JSONYAMLConverterPage from '@/pages/JSONYAMLConverterPage';

export const metadata = {
  title: 'JSON to YAML Converter – Free Online Tool | DevToolz',
  description: 'Convert JSON to YAML and YAML to JSON instantly. Two-way real-time conversion with syntax validation. No data stored.',
  openGraph: {
    title: 'JSON to YAML Converter – Free Online Tool | DevToolz',
    description: 'Convert JSON to YAML and YAML to JSON instantly. Two-way real-time conversion with syntax validation.',
  },
};

export default function JSONYAMLConverter() {
  return <JSONYAMLConverterPage />;
}
