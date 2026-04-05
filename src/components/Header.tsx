'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Hem' },
    { href: '/beratta', label: 'Berätta' },
    { href: '/min-berattelse', label: 'Min berättelse' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-cream-dark sticky top-0 z-50">
      <nav className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-brown">
          Farmors Berättelser
        </Link>
        <div className="flex gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-base transition-colors ${
                pathname === link.href
                  ? 'bg-gold/10 text-gold-dark font-semibold'
                  : 'text-brown-light hover:bg-cream-dark'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
