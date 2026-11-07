import './globals.css';
import siteData from '../data/siteData.json';

export const metadata = {
  title: siteData.meta.title,
  description: siteData.meta.description,
  icons: {
    icon: siteData.meta.favicon,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900 font-lato antialiased">
        {children}
      </body>
    </html>
  );
}
