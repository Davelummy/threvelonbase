import { Clock3, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { business } from "../../data/business";
import { trustMarqueeItems } from "../../data/content";
import { WhatsAppIcon } from "./WhatsAppIcon";

const iconMap = {
  shield: ShieldCheck,
  map: MapPin,
  clock: Clock3,
  wrench: Wrench,
} as const;

function TrustItem({
  icon,
  label,
  sublabel,
}: {
  icon: "shield" | "map" | "clock" | "wrench" | "whatsapp";
  label: string;
  sublabel: string;
}) {
  const LucideIcon = icon === "whatsapp" ? null : iconMap[icon];

  return (
    <div className="trust-marquee-item">
      <span className="trust-marquee-icon" aria-hidden="true">
        {icon === "whatsapp" ? (
          <WhatsAppIcon size={16} />
        ) : LucideIcon ? (
          <LucideIcon size={16} />
        ) : null}
      </span>
      <span className="trust-marquee-copy">
        <span className="trust-marquee-label">{label}</span>
        <span className="trust-marquee-sub">{sublabel}</span>
      </span>
    </div>
  );
}

function TrustGroup({
  items,
  hidden,
}: {
  items: Array<{
    id: string;
    icon: "shield" | "map" | "clock" | "wrench" | "whatsapp";
    label: string;
    sublabel: string;
  }>;
  hidden?: boolean;
}) {
  return (
    <div className="trust-marquee-group" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <TrustItem
          key={`${hidden ? "dup" : "src"}-${item.id}`}
          icon={item.icon}
          label={item.label}
          sublabel={item.sublabel}
        />
      ))}
    </div>
  );
}

export function TrustMarquee() {
  const items = trustMarqueeItems.map((item) => ({
    id: item.id,
    icon: item.icon,
    label:
      item.id === "location"
        ? `${business.address.shop}, ${business.address.locality}`
        : item.label,
    sublabel:
      item.id === "hours"
        ? `${business.hours.display}`
        : item.sublabel,
  }));

  // Two equal groups → translateX(-50%) is an exact seamless loop on all widths.
  return (
    <div className="trust-marquee" aria-label="Trust signals">
      <div className="trust-marquee-viewport">
        <div className="trust-marquee-track">
          <TrustGroup items={items} />
          <TrustGroup items={items} hidden />
        </div>
      </div>
    </div>
  );
}
