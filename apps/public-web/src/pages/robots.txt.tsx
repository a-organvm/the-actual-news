import type { GetServerSideProps } from "next";
import { SITE_URL } from "../lib/env";

function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  res.setHeader("Content-Type", "text/plain");
  res.write(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
RSS: ${baseUrl}/feed.xml
JSON-Feed: ${baseUrl}/feed.json
Distribution-Kit: ${baseUrl}/distribution
Principles: ${baseUrl}/principles
Launch-Manifest: ${baseUrl}/launch.json
Launch-Runbook: ${baseUrl}/runbook.json
Media-Kit: ${baseUrl}/media-kit
Media-Kit-JSON: ${baseUrl}/media-kit.json
Share-Kit: ${baseUrl}/share-kit.json
Provider-Handoff: ${baseUrl}/provider-handoff.json
Provider-Pages: ${baseUrl}/provider-pages
Campaigns: ${baseUrl}/campaigns.json
Sponsor-Registry: ${baseUrl}/sponsors
Sponsor-Registry-JSON: ${baseUrl}/sponsors.json
Icon: ${baseUrl}/icon.svg
Health: ${baseUrl}/api/healthz
`);
  res.end();

  return { props: {} };
};

export default Robots;
