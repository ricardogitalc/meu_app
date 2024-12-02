import { Inter as InterVariable } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { metadata } from "./metadata";
import { Providers } from "./provider";

const inter = InterVariable({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        <Providers>
          <Navbar />
          <div className="flex justify-center items-center">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
