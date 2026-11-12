import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Runs before hydration to apply the saved theme and avoid a flash.
// Light is the default: dark mode applies ONLY when the user has explicitly
// chosen it (saved in localStorage). We intentionally ignore the OS/browser
// `prefers-color-scheme: dark` so the site stays light by default.
const themeScript = `(function(){try{if(localStorage.getItem('grocify-theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Grocify - Grocery Comparison App",
  description: "Compare grocery prices across different stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
