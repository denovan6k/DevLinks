
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DropdownProvider } from "./context/dropdowncontext";

const inter = Inter({ subsets: ["latin"] });

import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
 
export const metadata: Metadata = {
  title: "Devlinks",
  description: "Innovation through sharing",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body  className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <DropdownProvider>
             
             
             {children}
             <div className="">
             <Toaster/>
             </div>
             
         
          </DropdownProvider>
        
        </body>
    </html>
  );
}
