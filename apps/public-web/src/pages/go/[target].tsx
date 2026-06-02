import type { GetServerSideProps } from "next";
import { conversionForTarget } from "../../lib/public-conversions";
import { SITE_URL } from "../../lib/env";

function ConversionRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  const rawTarget = Array.isArray(params?.target) ? params?.target[0] : params?.target;
  const conversion = conversionForTarget(rawTarget);

  res.setHeader("Cache-Control", "no-store");

  if (!conversion) {
    return {
      redirect: {
        destination: "/distribution?conversion=unknown",
        permanent: false
      }
    };
  }

  const destination = conversion.providerConfigured
    ? new URL(conversion.providerUrl)
    : new URL(conversion.publicPath, SITE_URL);

  for (const [key, value] of Object.entries(query)) {
    if (key === "target") continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (typeof item === "string" && item) destination.searchParams.append(key, item);
    }
  }

  if (!conversion.providerConfigured) {
    destination.searchParams.set("provider", "pending");
  }

  return {
    redirect: {
      destination: conversion.providerConfigured
        ? destination.toString()
        : `${destination.pathname}${destination.search}${destination.hash}`,
      permanent: false
    }
  };
};

export default ConversionRedirect;
