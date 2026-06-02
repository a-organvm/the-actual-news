import type { GetServerSideProps } from "next";
import { publicLaunchRunbook } from "../lib/public-runbook";

function RunbookJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.write(JSON.stringify(publicLaunchRunbook(), null, 2));
  res.end();

  return { props: {} };
};

export default RunbookJson;
