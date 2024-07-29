/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-sync-scripts */
import "tailwindcss/tailwind.css";
import "@fontsource/metropolis";
import { Session } from "next-auth";
import { headers } from "next/headers";
import AuthContext from "./AuthContext";
import { QCProvider, MuiCssProvider } from "@/app/provider";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Lil Networking",
  description: "The app to help people form intentional networking habits",
};

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(headers().get("cookie") ?? "");

  return (
    <html lang="en">
      <head>
        <link
          rel="manifest"
          crossOrigin="use-credentials"
          href="/manifest.json"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="iosPWASplash" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
        />
        <script src="https://cdn.jsdelivr.net/npm/ios-pwa-splash@1.0.0/cdn.min.js"></script>
      </head>
      <body className="font-sans bg-dark-blue mx-auto max-w-lg md:max-w-xl lg:max-w-3xl">
        <QCProvider>
          <MuiCssProvider>
            <AuthContext session={session}>
              {children} <Analytics />
            </AuthContext>
          </MuiCssProvider>
        </QCProvider>
        <script>iosPWASplash('icons/icon-512x512.png', '#0F1A24');</script>
      </body>
    </html>
  );
}
