"use client";

const ARC_LEN = Math.PI * 48;

type SemiGaugeProps = {
  value: number;
  max?: number;
  strokeClass?: string;
  trackClass?: string;
};

export function SemiGauge({
  value,
  max = 100,
  strokeClass = "stroke-agropi-forest",
  trackClass = "stroke-neutral-200",
}: SemiGaugeProps) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const offset = ARC_LEN * (1 - pct);

  return (
    <svg
      viewBox="0 0 120 72"
      className="h-16 w-24 shrink-0"
      aria-hidden
    >
      <path
        d="M 12 60 A 48 48 0 0 1 108 60"
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        className={trackClass}
      />
      <path
        d="M 12 60 A 48 48 0 0 1 108 60"
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={ARC_LEN}
        strokeDashoffset={offset}
        className={strokeClass}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}
