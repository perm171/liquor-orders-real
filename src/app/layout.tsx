import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import "./globals.css";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Liquor Store",
  description: "Online Liquor Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-50 text-gray-800`}>
        {children}
      </body>
    </html>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
