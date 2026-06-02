import type { GetServerSideProps } from "next";
import { publicMediaKit } from "../lib/public-media-kit";

function MediaKitJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.write(JSON.stringify(publicMediaKit(), null, 2));
  res.end();

  return { props: {} };
};

export default MediaKitJson;
