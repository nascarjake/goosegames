import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export function WorkbenchShell({ children }: { children: ReactNode; section?: string }) {
  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to games</a>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Goose Games home">
        <span className="brand-art"><Image src="/arcade/goose-cover.webp" alt="" width={48} height={72} /></span>
        <span>GOOSE GAMES<small>INDEPENDENT SPIRIT. ARCADE INSTINCTS.</small></span>
      </Link>
      <nav aria-label="Main navigation"><Link href="/">The arcade</Link><Link href="/#collection">All games <span>↗</span></Link></nav>
    </header>
    <main id="main-content">{children}</main>
    <footer className="site-footer"><Link href="/">GOOSE GAMES <span>© {new Date().getFullYear()}</span></Link><p>Silly games. Serious code.</p><a href="https://jakedoesdev.com" target="_blank" rel="noreferrer">Made by Jacob Clark ↗</a></footer>
  </div>;
}

export function WorkspaceToolbar({ children, label }: { children: ReactNode; label: string }) {
  return <div className="workspace-toolbar"><span><i /> {label}</span><div>{children}</div></div>;
}
