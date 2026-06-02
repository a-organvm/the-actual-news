import type { GetServerSideProps } from "next";

function IconSvg() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="The Actual News">
  <defs>
    <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#f7f7f2"/>
      <circle cx="1.5" cy="1.5" r="0.9" fill="#111111" opacity="0.16"/>
      <path d="M0 8L8 0" stroke="#111111" stroke-width="0.7" opacity="0.1"/>
    </pattern>
  </defs>
  <rect width="512" height="512" fill="url(#dots)"/>
  <rect x="32" y="32" width="448" height="448" fill="none" stroke="#1f1f1f" stroke-width="18"/>
  <rect x="58" y="58" width="396" height="396" fill="none" stroke="#1f1f1f" stroke-width="6"/>
  <rect x="86" y="92" width="340" height="66" fill="#111111"/>
  <text x="256" y="138" text-anchor="middle" style="font: 900 38px Arial, sans-serif; fill: #f7f7f2; text-transform: uppercase;">Actual</text>
  <text x="256" y="254" text-anchor="middle" style="font: 900 116px Georgia, serif; fill: #111111;">N</text>
  <line x1="104" y1="302" x2="408" y2="302" stroke="#1f1f1f" stroke-width="10"/>
  <text x="256" y="358" text-anchor="middle" style="font: 900 34px Arial, sans-serif; fill: #2e2e2e; text-transform: uppercase;">Receipts</text>
  <text x="256" y="400" text-anchor="middle" style="font: 900 34px Arial, sans-serif; fill: #2e2e2e; text-transform: uppercase;">Travel</text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  res.statusCode = 200;
  res.end(svg);

  return { props: {} };
};

export default IconSvg;
