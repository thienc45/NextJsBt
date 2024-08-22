import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";

const inter = Inter({
  subsets: ["vietnamese"]
  // ,
  // weight: ["100", "300"],
});

// const myFont = localFont({
//   src: [
//     {
//       path: './Roboto-Thin.ttf',
//       weight: "300",
//     },
//     {
//       path: './Roboto-Regular.ttf',
//       weight: "300",
//     }
//   ],
//   display: 'swap',
//   variable: '--font-roboto' // Correctly set the variable without parentheses or array notation
// })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
