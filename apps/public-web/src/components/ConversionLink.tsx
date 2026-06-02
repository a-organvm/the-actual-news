import { trackPublicEvent, withUtm, type UtmParams } from "../lib/public-analytics";
import type { ConversionTarget } from "../lib/public-conversions";
import { SITE_URL } from "../lib/env";
import { hostedProviderUrlReady } from "../lib/public-url";

type ConversionLinkProps = {
  href: string;
  label: string;
  fallbackLabel?: string;
  fallbackNote?: string;
  source: string;
  medium: string;
  campaign: string;
  conversionTarget?: ConversionTarget;
  className?: string;
};

export function isConfiguredConversionHref(href: string) {
  return hostedProviderUrlReady(href, SITE_URL);
}

export function ConversionLink({
  href,
  label,
  fallbackLabel,
  fallbackNote,
  source,
  medium,
  campaign,
  conversionTarget,
  className = "button button--solid"
}: ConversionLinkProps) {
  const utm: UtmParams = { source, medium, campaign };

  if (!isConfiguredConversionHref(href)) {
    return (
      <span className="conversion-link conversion-link--pending">
        <span className="button button--disabled">{fallbackLabel ?? `${label} coming soon`}</span>
        {fallbackNote && <span className="conversion-link__note">{fallbackNote}</span>}
        <a className="conversion-link__setup" href="/provider-pages">
          Provider setup packet
        </a>
      </span>
    );
  }

  return (
    <a
      className={className}
      href={withUtm(conversionTarget ? `/go/${conversionTarget}` : href, utm)}
      onClick={() =>
        trackPublicEvent("Revenue CTA", {
          source,
          medium,
          campaign,
          label,
          target: conversionTarget
        })
      }
    >
      {label}
    </a>
  );
}
