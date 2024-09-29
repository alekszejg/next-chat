import type { Metadata } from "next";
import "@/index.css";


export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
    ]
  }
};

export default function RootLayout(props: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        {props.children}
      </body>
    </html>
  );
}
