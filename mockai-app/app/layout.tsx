import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MockAI - AI-Powered Interview Practice",
    template: "%s | MockAI",
  },
  description:
    "Your AI-powered interview companion that helps you prepare, practice, and excel in any job interview with personalized guidance and real-time feedback.",
  keywords: [
    "interview practice",
    "AI interview",
    "job interview",
    "interview preparation",
    "mock interview",
    "career coaching",
  ],
  authors: [{ name: "MockAI Team" }],
  creator: "MockAI",
  publisher: "MockAI",
  icons: {
    icon: [
      { url: "/mockai-trans-bg.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/mockai-trans-bg.png" }],
  },
  openGraph: {
    title: "MockAI - AI-Powered Interview Practice",
    description: "Master your job interviews with AI-powered practice sessions",
    type: "website",
    locale: "en_US",
    siteName: "MockAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "MockAI - AI-Powered Interview Practice",
    description: "Master your job interviews with AI-powered practice sessions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/mockai-trans-bg.png" type="image/png" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
