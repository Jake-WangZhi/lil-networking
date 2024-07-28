import "tailwindcss/tailwind.css";
import "@fontsource/metropolis";
import { Session } from "next-auth";
import { headers } from "next/headers";
import AuthContext from "./AuthContext";
import { QCProvider, MuiCssProvider } from "@/app/provider";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Lil Networking",
  description: "The app to help people form intentional networking habits ",
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PWA Splash" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link
          rel="manifest"
          crossOrigin="use-credentials"
          href="/manifest.json"
        />
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-640x1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-750x1294.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1242x2148.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1536x2048.png"
          media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1668x2224.png"
          media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-2048x2732.png"
          media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        />
      </head>
      <body className="font-sans bg-dark-blue mx-auto max-w-lg md:max-w-xl lg:max-w-3xl">
        <QCProvider>
          <MuiCssProvider>
            <AuthContext session={session}>
              {children} <Analytics />
            </AuthContext>
          </MuiCssProvider>
        </QCProvider>
      </body>
    </html>
  );
}
