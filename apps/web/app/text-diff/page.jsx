import TextDiffPage from '@/pages/TextDiffPage';

export const metadata = {
  title: 'Text Diff Tool – Compare Text Online | DevToolz',
  description:
    'Compare two blocks of text side by side. Highlights added, removed, and unchanged lines using a fast LCS algorithm. Supports unified and split view. Runs entirely in your browser.',
};

export default function TextDiff() {
  return <TextDiffPage />;
}
