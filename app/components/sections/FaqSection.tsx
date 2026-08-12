import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { faqItems } from "../../data/faq";

type FaqSectionProps = {
  heading?: "h1" | "h2";
  /** Homepage scroll motion. Off on /faq, where that runtime is not mounted. */
  animate?: boolean;
};

export function FaqSection({ heading = "h2", animate = true }: FaqSectionProps) {
  const Heading = heading;
  const motionClass = animate ? "gs-hidden" : undefined;

  return (
    <section className="faq section" id="faq">
      <div className="shell">
        <div className={`section-heading split-heading ${motionClass ?? ""}`.trim()} data-gs={animate ? "fade-up" : undefined}>
          <div>
            <p className="eyebrow"><span /> Questions</p>
            <Heading>Clear answers before you bring the device.</Heading>
          </div>
          <p>
            These answers match how the workshop already works: diagnosis first,
            WhatsApp for enquiries, and no repair details stored on this website.
          </p>
        </div>
        <div className={`faq-list ${motionClass ?? ""}`.trim()} data-gs={animate ? "stagger" : undefined}>
          {faqItems.map((item) => (
            <details className="faq-item" key={item.id}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown aria-hidden="true" size={18} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        {heading === "h2" ? (
          <p className="faq-legal-links">
            <Link href="/faq">FAQ page</Link>
            <Link href="/privacy">Privacy</Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function FaqJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}