import ColorConverterPage from '@/pages/ColorConverterPage';

export const metadata = {
  title: 'Color Converter – HEX, RGB, HSL, HSV, CMYK | DevToolz',
  description:
    'Convert colors between HEX, RGB, RGBA, HSL, HSLA, HSV, and CMYK. Includes a visual color picker and quick-copy for every format.',
};

export default function ColorConverter() {
  return <ColorConverterPage />;
}
