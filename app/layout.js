import "./globals.css";
import { Inter } from 'next/font/google';
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});


export const metadata = {
  title: "Tenaly",
  description: "findanything,sellanything"
};

export const viewport = {
  themeColor: '#f69a00', // Theme color for the website
}

export default function RootLayout({ children}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
       <AuthProvider>
          <Navbar />
             {children}
            <Footer />
            <ToastContainer />
         </AuthProvider>
      </body>
    </html>
  );
}
