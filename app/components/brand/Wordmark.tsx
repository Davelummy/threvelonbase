import Image from "next/image";

type WordmarkProps = {
  reversed?: boolean;
  /** Hide the tagline under the name (cleaner for headers). */
  compact?: boolean;
  className?: string;
};

export function Wordmark({
  reversed = false,
  compact = false,
  className = "",
}: WordmarkProps) {
  return (
    <span
      className={`wordmark ${compact ? "wordmark-compact" : ""} ${className}`.trim()}
      data-reversed={reversed ? "true" : "false"}
      data-compact={compact ? "true" : "false"}
    >
      {reversed ? (
        <Image
          className="wordmark-mark"
          src="/brand/tb-mark-reversed.svg"
          width={40}
          height={40}
          alt=""
          aria-hidden="true"
          unoptimized
        />
      ) : (
        <>
          <Image
            className="wordmark-mark wordmark-mark-light"
            src="/brand/tb-mark.svg"
            width={40}
            height={40}
            alt=""
            aria-hidden="true"
            unoptimized
          />
          <Image
            className="wordmark-mark wordmark-mark-dark"
            src="/brand/tb-mark-reversed.svg"
            width={40}
            height={40}
            alt=""
            aria-hidden="true"
            unoptimized
          />
        </>
      )}
      <span className="brand-copy">
        <strong>Threvelonbase</strong>
        {!compact ? <small>Technology Evolution and Revolution</small> : null}
      </span>
    </span>
  );
}
