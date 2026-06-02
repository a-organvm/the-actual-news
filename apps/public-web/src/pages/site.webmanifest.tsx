import type { GetServerSideProps } from "next";
import { SITE_DESCRIPTION, SITE_TITLE } from "../lib/env";

function WebManifest() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/manifest+json");
  res.write(
    JSON.stringify(
      {
        name: SITE_TITLE,
        short_name: "Actual News",
        description: SITE_DESCRIPTION,
        start_url: "/",
        display: "standalone",
        background_color: "#f7f7f2",
        theme_color: "#111111",
        categories: ["news", "magazines", "productivity"],
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ],
        shortcuts: [
          {
            name: "Distribution Kit",
            short_name: "Distribute",
            url: "/distribution",
            description: "Open public share copy, feeds, and atom packets."
          },
          {
            name: "Launch Ledger",
            short_name: "Launch",
            url: "/launch",
            description: "Open public launch readiness and artifact links."
          }
        ],
        share_target: {
          action: "/distribution",
          method: "GET",
          params: {
            title: "title",
            text: "text",
            url: "url"
          }
        }
      },
      null,
      2
    )
  );
  res.end();

  return { props: {} };
};

export default WebManifest;
