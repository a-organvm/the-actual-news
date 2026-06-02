import { CopyButton } from "./CopyButton";
import type { PublicSharePacket } from "../lib/public-feed";
import { trackPublicEvent } from "../lib/public-analytics";

type PublicSharePanelProps = {
  title: string;
  atomId: string;
  packet: PublicSharePacket;
};

export function PublicSharePanel({ title, atomId, packet }: PublicSharePanelProps) {
  return (
    <section className="share-panel" aria-label={`Share ${title}`}>
      <div>
        <span className="eyebrow">Pass the clipping</span>
        <h2>Share this atom</h2>
        <p>Use the clipping URL, social card, or prewritten copy so the evidence trail travels with the story.</p>
      </div>
      <div className="share-panel__actions">
        <a
          href={packet.channels.x}
          onClick={() => trackPublicEvent("Atom Share", { channel: "x", atom_id: atomId })}
        >
          X
        </a>
        <a
          href={packet.channels.linkedin}
          onClick={() => trackPublicEvent("Atom Share", { channel: "linkedin", atom_id: atomId })}
        >
          In
        </a>
        <a
          href={packet.channels.email}
          onClick={() => trackPublicEvent("Atom Share", { channel: "email", atom_id: atomId })}
        >
          Mail
        </a>
        <a
          href={packet.social_card_url}
          onClick={() => trackPublicEvent("Atom Share", { channel: "social_card", atom_id: atomId })}
        >
          Card
        </a>
      </div>
      <div className="share-panel__copy">
        <code>{packet.clip_url}</code>
        <CopyButton
          value={packet.clip_url}
          label="Copy URL"
          eventLabel="atom_page_clip_url"
          eventContext={{ atom_id: atomId }}
        />
      </div>
      <div className="share-panel__copy">
        <p>{packet.share_text}</p>
        <CopyButton
          value={packet.share_text}
          label="Copy text"
          eventLabel="atom_page_share_text"
          eventContext={{ atom_id: atomId }}
        />
      </div>
    </section>
  );
}
