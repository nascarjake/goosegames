import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://goosegames.dev"),
  title: { default: "Goose Games — Insert curiosity. Press play.", template: "%s · Goose Games" },
  description: "An independent arcade of browser games. Play physics survival, roguelike pool, bowling, rhythm games, and more from Goose Games.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
