import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Station - Free Online H5 Games",
  description: "Play the best HTML5 games in your browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}