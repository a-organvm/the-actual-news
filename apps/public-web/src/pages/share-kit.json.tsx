import type { GetServerSideProps } from "next";
import { publicShareKit } from "../lib/public-distribution";

function ShareKitJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.write(JSON.stringify(publicShareKit(), null, 2));
  res.end();

  return { props: {} };
};

export default ShareKitJson;
