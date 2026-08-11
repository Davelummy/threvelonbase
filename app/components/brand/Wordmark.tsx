type WordmarkProps = {
  reversed?: boolean;
  className?: string;
};

export function Wordmark({ reversed = false, className = "" }: WordmarkProps) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      <img
        src={reversed ? "/brand/tb-mark-reversed.svg" : "/brand/tb-mark.svg"}
        width="48"
        height="48"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-copy">
        <strong>THREVELONBASE</strong>
        <small>Technology Evolution and Revolution</small>
      </span>
    </span>
  );
}
