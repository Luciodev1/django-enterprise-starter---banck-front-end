import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "@/styles/globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "SIS Enterprise",
    template: "%s · SIS Enterprise",
  },
  description: "Plataforma corporativa de gestão de utilizadores, auditoria e notificações.",
  applicationName: "SIS Enterprise",
  keywords: ["enterprise", "admin", "dashboard", "gestão", "auditoria", "B2B"],
  authors: [{ name: "SIS Enterprise" }],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar para o conteúdo principal
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
