import Link from "next/link";
import type { ReactNode } from "react";
import type { JsonLd } from "../lib/public-structured-data";
import { SiteHead } from "./SiteHead";
import { TownCrierTicker } from "./TownCrierTicker";

type SiteShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  path?: string;
  imagePath?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: JsonLd | JsonLd[];
};

export function SiteShell({
  children,
  title,
  description,
  path,
  imagePath,
  ogType,
  publishedTime,
  modifiedTime,
  structuredData
}: SiteShellProps) {
  return (
    <div className="site-shell">
      <SiteHead
        title={title}
        description={description}
        path={path}
        imagePath={imagePath}
        ogType={ogType}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        structuredData={structuredData}
      />
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand-link" href="/">
            <span className="brand-mark">Hear ye</span>
            <span>The Actual News</span>
          </Link>
          <nav className="nav-links" aria-label="Primary navigation">
            <Link href="/#feed">Feed</Link>
            <Link href="/membership">Membership</Link>
            <Link href="/briefing">Briefing</Link>
            <Link href="/sponsor">Sponsor</Link>
            <Link href="/sponsors">Registry</Link>
            <Link href="/media-kit">Media Kit</Link>
            <Link href="/principles">Principles</Link>
            <Link href="/distribution">Distribution</Link>
            <Link href="/launch">Launch</Link>
            <Link href="/verify">Verify</Link>
          </nav>
        </div>
        <TownCrierTicker />
      </header>
      {children}
      <footer className="site-footer">
        <div className="page-section">
          <strong>The Actual News</strong>
          <p>Verifiable reporting funded by readers, members, and civic partners.</p>
          <nav className="footer-links" aria-label="Distribution feeds">
            <Link href="/feed.xml">RSS</Link>
            <Link href="/feed.json">JSON Feed</Link>
            <Link href="/distribution">Distribution Kit</Link>
            <Link href="/sponsors">Sponsor Registry</Link>
            <Link href="/media-kit">Media Kit</Link>
            <Link href="/principles">Principles</Link>
            <Link href="/launch">Launch Status</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
