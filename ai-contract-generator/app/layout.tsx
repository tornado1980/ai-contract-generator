import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '1-Click Contract Generator',
  description: 'Create professional freelance agreements in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}