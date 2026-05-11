import NumberBaseConverterPage from '@/pages/NumberBaseConverterPage';

export const metadata = {
  title: 'Number Base Converter – Decimal, Hex, Binary, Octal | DevToolz',
  description:
    'Convert numbers between decimal, hexadecimal, octal, and binary. BigInt precision, nibble-grouped binary output, and bit-width indicators.',
};

export default function NumberBaseConverter() {
  return <NumberBaseConverterPage />;
}
