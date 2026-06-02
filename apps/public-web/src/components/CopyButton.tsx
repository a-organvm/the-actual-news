import { useState } from "react";
import { trackPublicEvent } from "../lib/public-analytics";

type CopyButtonProps = {
  value: string;
  label: string;
  eventLabel: string;
  eventContext?: Record<string, string | number | boolean | undefined>;
};

export function CopyButton({ value, label, eventLabel, eventContext = {} }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyValue() {
    if (!navigator.clipboard?.writeText) {
      setStatus("failed");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      trackPublicEvent("Distribution Copy", {
        label: eventLabel,
        ...eventContext
      });
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <span className="copy-action">
      <button className="copy-action__button" type="button" onClick={copyValue}>
        {status === "copied" ? "Copied" : label}
      </button>
      <span className="copy-action__status" aria-live="polite">
        {status === "failed" ? "Copy unavailable" : ""}
      </span>
    </span>
  );
}
