import ColorConverterPage from '@/pages/ColorConverterPage';

export const metadata = {
  title: 'Color Converter – HEX, RGB, HSL, HSV, CMYK | DevToolz',
  description:
    'Convert colors between HEX, RGB, RGBA, HSL, HSLA, HSV, and CMYK. Includes a visual color picker and quick-copy for every format.',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between HSL and HSV?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Both use hue and saturation, but differ in the third component. HSL's lightness ranges from black (0%) to white (100%) with the pure colour at 50%. HSV's value ranges from black (0%) to the pure colour (100%) — white is represented by low saturation, not high value. HSV matches most design-tool colour pickers; HSL is native to CSS."
      }
    },
    {
      "@type": "Question",
      "name": "Why doesn't CMYK convert perfectly to RGB?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "RGB is an additive colour model (mixing light); CMYK is subtractive (mixing ink). The gamuts (ranges of representable colours) differ — some colours on a screen cannot be reproduced in print, and some printed colours cannot be displayed on a monitor. Conversion is an approximation."
      }
    },
    {
      "@type": "Question",
      "name": "What does the alpha channel control?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alpha controls opacity from 0 (fully transparent) to 1 (fully opaque). It appears in formats like rgba() and hsla() in CSS. An 8-digit HEX code (#RRGGBBAA) encodes alpha as the last two hex digits."
      }
    }
  ]
};

export default function ColorConverter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ColorConverterPage />
    </>
  );
}
