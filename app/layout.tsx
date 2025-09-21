import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { DataProvider } from "@/context/DataContext";
import { AdminProvider } from "@/context/AdminContext";
import { UserProvider } from "@/context/UserContext";
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
        <UserProvider>
          <AdminProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </AdminProvider>
        </UserProvider>
      </body>
    </html>
  );
}
