import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { DataProvider } from "@/context/DataContext";
import GrammarlyWarningSuppressor from "@/components/GrammarlyWarningSuppressor";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "Emzor Pharmaceutical - Quality Healthcare Products",
  description: "Your trusted partner for quality pharmaceutical products and healthcare solutions. Shop our range of medicines, vitamins, and health supplements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <GrammarlyWarningSuppressor />
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
