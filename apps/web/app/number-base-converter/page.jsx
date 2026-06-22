import NumberBaseConverterPage from '@/pages/NumberBaseConverterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Number Base Converter – Decimal, Hex, Binary, Octal | DevToolz',
  description:
    'Convert numbers between decimal, hexadecimal, octal, and binary. BigInt precision, nibble-grouped binary output, and bit-width indicators.',
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Number Base Converter",
  "description": "Convert numbers between decimal, hexadecimal, octal, and binary. BigInt precision, nibble-grouped binary output, and bit-width indicators.",
  "url": "https://devtoolz.net/number-base-converter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function NumberBaseConverter() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <NumberBaseConverterPage />
    </>
  );
}
