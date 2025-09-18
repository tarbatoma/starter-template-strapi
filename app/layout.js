import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "startertemplate-strapi",
  description: "Next.js blank (JS + plain CSS)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="site">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
