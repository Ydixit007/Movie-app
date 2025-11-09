import { Montserrat } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Movie App",
  description: "This is a movie app where you can store your movies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        {children}
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
