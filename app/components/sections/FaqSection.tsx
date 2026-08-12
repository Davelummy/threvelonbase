import { ChevronDown } from "lucide-react";
import { faqItems } from "../../data/faq";

export function FaqSection() {
  return (
    <section className="faq section" id="faq">
      <div className="shell">
        <div className="section-heading split-heading gs-hidden" data-gs="fade-up">
          <div>
            <p className="eyebrow"><span /> Questions</p>
            <h2>Clear answers before you bring the device.</h2>
          </div>
          <p>
            These answers match how the workshop already works: diagnosis first,
            WhatsApp for enquiries, and no repair details stored on this website.
          </p>
        </div>
        <div className="faq-list gs-hidden" data-gs="stagger">
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
