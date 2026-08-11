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
      {icon === "whatsapp" ? (
        <WhatsAppIcon size={14} />
      ) : LucideIcon ? (
        <LucideIcon aria-hidden="true" size={14} />
      ) : null}
      <div>
        <span className="trust-marquee-label">{label}</span>
        <span className="trust-marquee-sub">{sublabel}</span>
      </div>
    </div>
  );
}

export function TrustMarquee() {
  const items = trustMarqueeItems.map((item) => ({
    ...item,
    label:
      item.id === "location"
        ? `${business.address.shop}, ${business.address.locality}`
        : item.label,
    sublabel:
      item.id === "location"
        ? business.address.complex
        : item.id === "hours"
          ? `${business.hours.days}, ${business.hours.display}`
          : item.id === "established"
            ? `Hands-on repair experience since ${business.established}`
            : item.sublabel,
  }));

  // Duplicate the list so the CSS translate(-50%) loop is seamless.
  const loop = [...items, ...items];

  return (
    <div className="trust-marquee" aria-label="Trust signals">
      <div className="trust-marquee-track">
        {loop.map((item, index) => (
          <TrustItem
            key={`${item.id}-${index}`}
            icon={item.icon}
            label={item.label}
            sublabel={item.sublabel}
          />
        ))}
      </div>
    </div>
  );
}
