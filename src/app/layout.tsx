import type { Metadata } from "next";
import "./globals.css";
import { Jost, Exo, Knewave } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastContainer } from "react-toastify";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "@/components/ui/sonner";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap"
});

const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
  display: 'swap'
})

const knewave = Knewave({
  subsets: ['latin'],
  variable: '--font-knewave',
  weight: '400',
  preload: false
})

export const metadata: Metadata = {
  title: "Aikabis",
  description: "Aikabis is a platform for selling online courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jost.variable} ${exo.variable} ${knewave.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastContainer />
            <Toaster />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
