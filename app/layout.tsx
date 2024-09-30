import type { Metadata, Viewport } from "next";
import PageLayout from "./_layoutComponents/pageLayout";
import "@/index.css";


export const metadata: Metadata = {
  title: "NextChat - a social chat app",
  description: "Simple chat, simple life!",
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
    ]
  },
};

export const viewport: Viewport = {
  themeColor: "#2E2E2E",
  colorScheme: "dark"
}


export default function RootLayout(props: Readonly<{children: React.ReactNode;}>) {
  const styling = {
    html: "h-full bg-gradient-to-tr from-[hsl(341,0%,6%)] to-[hsl(341,0%,12%)] text-hsl(341, 0%, 94%)", 
    body: "h-full bg-gradient-to-tr from-[hsl(341,0%,6%)] to-[hsl(341,0%,12%)] text-hsl(341, 0%, 94%)",
  }

  return (
    <html lang="en" className={styling.html}>
      <body className={styling.body}>
        <PageLayout>
          {props.children}
        </PageLayout>
      </body>
    </html>
  );
}
