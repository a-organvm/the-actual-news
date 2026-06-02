import type { GetServerSideProps } from "next";
import { publicCampaignKit } from "../lib/public-campaigns";

function CampaignsJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.write(JSON.stringify(publicCampaignKit(), null, 2));
  res.end();

  return { props: {} };
};

export default CampaignsJson;
