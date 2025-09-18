"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const items = [
    { label: "Services", href: "#" },
    { label: "About us", href: "#" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact Us", href: "#" },
  ];

  return (
    <header className="site-header">
      <nav className="nav container">
        <Link href="/" className="brand">starter template</Link>
        <ul className="menu">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
