import ColorConverterPage from '@/pages/ColorConverterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Color Converter – HEX, RGB, HSL, HSV, CMYK | DevToolz',
  description:
    'Convert colors between HEX, RGB, RGBA, HSL, HSLA, HSV, and CMYK. Includes a visual color picker and quick-copy for every format.',
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Color Converter",
  "description": "Convert colors between HEX, RGB, RGBA, HSL, HSLA, HSV, and CMYK. Includes a visual color picker and quick-copy for every format.",
  "url": "https://devtoolz.net/color-converter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function ColorConverter() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <ColorConverterPage />
    </>
  );
}
