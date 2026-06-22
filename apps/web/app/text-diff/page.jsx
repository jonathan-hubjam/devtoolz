import TextDiffPage from '@/pages/TextDiffPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Text Diff Tool – Compare Text Online | DevToolz',
  description:
    'Compare two blocks of text side by side. Highlights added, removed, and unchanged lines using a fast LCS algorithm. Supports unified and split view. Runs entirely in your browser.',
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Text Diff",
  "description": "Compare two blocks of text side by side. Highlights added, removed, and unchanged lines using a fast LCS algorithm. Supports unified and split view. Runs entirely in your browser.",
  "url": "https://devtoolz.net/text-diff",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function TextDiff() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <TextDiffPage />
    </>
  );
}
