import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Понимать математику — индивидуальные занятия",
  description: "Индивидуальные занятия по математике для школьников: онлайн и офлайн.",
  openGraph: {
    title: "Математика, которую можно понять",
    description: "Индивидуальные занятия по математике для школьников.",
    images: [{ url: "/og.png", width: 1736, height: 941, alt: "Математика, которую можно понять" }],
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
