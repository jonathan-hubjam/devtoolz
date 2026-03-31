import RegexTesterPage from '@/pages/RegexTesterPage';

export const metadata = {
  title: 'Regex Tester – Free Online Regular Expression Tool | DevToolz',
  description: 'Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags. All processing happens locally in your browser.',
  openGraph: {
    title: 'Regex Tester – Free Online Regular Expression Tool | DevToolz',
    description: 'Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags.',
  },
};

export default function RegexTester() {
  return <RegexTesterPage />;
}
