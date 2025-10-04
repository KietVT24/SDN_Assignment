// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToasterProvider } from "@/components/ui/Toaster";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clothing Store - Modern E-commerce",
  description: "A modern clothing store built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <ToasterProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToasterProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}






// import "./globals.css";
// import { Inter } from "next/font/google";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { ToasterProvider } from "@/components/ui/Toaster";
// import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper"; // ✅ import Client wrapper

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Clothing Store - Modern E-commerce",
//   description: "A modern clothing store built with Next.js",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <SessionProviderWrapper>
//           <ToasterProvider>
//             <div className="min-h-screen flex flex-col">
//               <Navbar />
//               <main className="flex-1">{children}</main>
//               <Footer />
//             </div>
//           </ToasterProvider>
//         </SessionProviderWrapper>
//       </body>
//     </html>
//   );
// }




// "use client";

// import "./globals.css";
// import { Inter } from "next/font/google";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { ToasterProvider } from "@/components/ui/Toaster";
// import { SessionProvider } from "next-auth/react"; // ✅ thêm dòng này

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Clothing Store - Modern E-commerce",
//   description: "A modern clothing store built with Next.js",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* ✅ Bọc toàn bộ ứng dụng trong SessionProvider */}
//         <SessionProvider>
//           <ToasterProvider>
//             <div className="min-h-screen flex flex-col">
//               <Navbar />
//               <main className="flex-1">{children}</main>
//               <Footer />
//             </div>
//           </ToasterProvider>
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }
