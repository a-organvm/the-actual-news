import type { GetServerSideProps } from "next";
import { publicProviderHandoff } from "../lib/public-provider-handoff";

function ProviderHandoffJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.write(JSON.stringify(publicProviderHandoff(), null, 2));
  res.end();

  return { props: {} };
};

export default ProviderHandoffJson;
