import TextDiffPage from '@/pages/TextDiffPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Text Diff Tool – Compare Text Online | DevToolz',
  description:
    'Compare two blocks of text side by side. Highlights added, removed, and unchanged lines using a fast LCS algorithm. Supports unified and split view. Runs entirely in your browser.',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between unified and side-by-side diff?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unified diff shows both versions interleaved in a single column with + and - markers — compact and good for terminals. Side-by-side diff shows the two versions in parallel columns — easier to read for longer files or prose comparisons."
      }
    },
    {
      "@type": "Question",
      "name": "Does whitespace matter in the comparison?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By default, trailing whitespace and line-ending differences (CRLF vs LF) are included in the diff. Most tools offer an \"ignore whitespace\" option that skips purely cosmetic whitespace changes so you can focus on meaningful content differences."
      }
    },
    {
      "@type": "Question",
      "name": "How large a file can I diff in the browser?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Browser-based diff tools handle files up to a few hundred kilobytes comfortably. For very large files (megabytes), the diff algorithm can become slow due to the quadratic nature of LCS computation. Use command-line tools like diff or git diff for large files."
      }
    }
  ]
};

export default function TextDiff() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <TextDiffPage />
    </>
  );
}
