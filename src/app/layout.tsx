import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "ArquiGest", template: "%s · ArquiGest" },
  description: "Plataforma que liga escritórios de arquitetura aos seus clientes.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9e7e3" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

// Aplica o tema guardado antes da primeira pintura, para não haver cintilação.
const themeScript = `(()=>{try{const t=localStorage.getItem("arquigest-theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t;}catch{}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${grotesk.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="concrete flex min-h-full flex-col bg-bg font-sans text-ink">{children}</body>
    </html>
  );
}
