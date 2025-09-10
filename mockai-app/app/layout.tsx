import { Poppins } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MockAI",
  description:
    "MockAI is a interview guide and companion that will help you ace your next interview with confidence",
  icons: {
    icon: "mockai-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
