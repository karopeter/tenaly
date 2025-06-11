"use client";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}

function MainLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <>
      {!isLandingPage && <Navbar />}
      <div className="min-h-screen">{children}</div>
      {!isLandingPage && <Footer />}
    </>
  );
}
