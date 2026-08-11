type WordmarkProps = {
  reversed?: boolean;
  className?: string;
};

export function Wordmark({ reversed = false, className = "" }: WordmarkProps) {
  return (
    <span className={`wordmark ${className}`.trim()} data-reversed={reversed ? "true" : "false"}>
      {reversed ? (
        <img
          className="wordmark-mark"
          src="/brand/tb-mark-reversed.svg"
          width="48"
          height="48"
          alt=""
          aria-hidden="true"
        />
      ) : (
        <>
          {/* Light-surface mark */}
          <img
            className="wordmark-mark wordmark-mark-light"
            src="/brand/tb-mark.svg"
            width="48"
            height="48"
            alt=""
            aria-hidden="true"
          />
          {/* Dark-surface mark (header in dark mode) */}
          <img
            className="wordmark-mark wordmark-mark-dark"
            src="/brand/tb-mark-reversed.svg"
            width="48"
            height="48"
            alt=""
            aria-hidden="true"
          />
        </>
      )}
      <span className="brand-copy">
        <strong>THREVELONBASE</strong>
        <small>Technology Evolution and Revolution</small>
      </span>
    </span>
  );
}
