"use client";
import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Work_Sans  } from "next/font/google";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/navbar/navbar";
import AccountSetupBanner from "./components/UI/AccountSetupBanner";
import Footer from "./components/footer/footer";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={workSans.variable} suppressHydrationWarning>
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
  const { loading } = useAuth();
  const isLandingPage = pathname === "/";

  return (
    <>
      {!isLandingPage && <Navbar />}
      {!isLandingPage && !loading && <AccountSetupBanner />}
      <div className="min-h-screen">{children}</div>
      {!isLandingPage && <Footer />}
    </>
  );
}
