export const metadata = {
  title: 'NIF Store — QRIS Demo',
  description: 'Demo integrasi QRIS Duitku (Sandbox) di Vercel',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
