import type { GetServerSideProps } from "next";
import { publicLaunchManifest } from "../lib/public-launch";

function LaunchJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.write(JSON.stringify(publicLaunchManifest(), null, 2));
  res.end();

  return { props: {} };
};

export default LaunchJson;
