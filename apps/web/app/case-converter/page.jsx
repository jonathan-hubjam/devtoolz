import CaseConverterPage from '@/pages/CaseConverterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Case Converter – Convert Text Case Online | DevToolz',
  description:
    'Convert text to lowercase, UPPERCASE, Title Case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and more. Live conversion, one click to copy.',
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Case Converter",
  "description": "Convert text to lowercase, UPPERCASE, Title Case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and more. Live conversion, one click to copy.",
  "url": "https://devtoolz.net/case-converter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function CaseConverter() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <CaseConverterPage />
    </>
  );
}
