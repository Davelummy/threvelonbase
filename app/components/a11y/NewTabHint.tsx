/** Screen-reader guidance for links that open a new browsing context. */
export function NewTabHint() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}

export function withNewTabLabel(label: string) {
  return `${label} (opens in a new tab)`;
}
