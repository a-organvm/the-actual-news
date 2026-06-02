import type { GetServerSideProps } from "next";
import { publicSponsorRegistry } from "../lib/public-sponsors";

function SponsorsJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.write(JSON.stringify(publicSponsorRegistry(), null, 2));
  res.end();

  return { props: {} };
};

export default SponsorsJson;
