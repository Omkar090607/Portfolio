import { Geist, Geist_Mono, Baloo_2, Dancing_Script } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import { SITE_URL, withBasePath } from '@/lib/siteConfig';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Omkar Awaze | Full-Stack & Python Developer',
    template: '%s | Omkar Awaze',
  },
  description:
    'B.Tech Computer Technology student and Python Developer building full-stack and AI-powered applications with Python, React, Node.js, and FastAPI.',
  keywords: [
    'Omkar Awaze',
    'Full Stack Developer',
    'Python Developer',
    'Software Engineer',
    'React Developer',
    'Node.js',
    'AI Applications',
    'Portfolio',
    'Nagpur',
    'India',
  ],
  authors: [{ name: 'Omkar Awaze', url: SITE_URL }],
  creator: 'Omkar Awaze',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Omkar Awaze',
    title: 'Omkar Awaze | Full-Stack & Python Developer',
    description:
      'B.Tech Computer Technology student and Python Developer building full-stack and AI-powered applications with Python, React, Node.js, and FastAPI.',
    images: [
      {
        url: withBasePath('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: 'Omkar Awaze | Full-Stack & Python Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omkar Awaze | Full-Stack & Python Developer',
    description:
      'B.Tech Computer Technology student and Python Developer building full-stack and AI-powered applications with Python, React, Node.js, and FastAPI.',
    images: [withBasePath('/opengraph-image')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: withBasePath('/favicons/favicon-16x16.png'), sizes: '16x16', type: 'image/png' },
      { url: withBasePath('/favicons/favicon-32x32.png'), sizes: '32x32', type: 'image/png' },
      { url: withBasePath('/favicons/favicon-48x48.png'), sizes: '48x48', type: 'image/png' },
      { url: withBasePath('/favicons/favicon.ico'), sizes: 'any' },
    ],
    apple: [
      { url: withBasePath('/favicons/apple-touch-icon.png') },
      { url: withBasePath('/favicons/apple-touch-icon-180x180.png'), sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: withBasePath('/favicons/android-chrome-192x192.png'), sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: withBasePath('/favicons/android-chrome-512x512.png'), sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: withBasePath('/favicons/manifest.webmanifest'),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Omkar Awaze',
              url: SITE_URL,
              email: 'omkarawaze1915@gmail.com',
              jobTitle: 'Full-Stack & Python Developer',
              sameAs: [
                'https://github.com/Omkar090607',
                'https://www.linkedin.com/in/omkar-awaze-6322103b1/',
                'https://www.instagram.com/iam_omkar19/',
              ],
            }),
          }}
        />
        <Cursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
