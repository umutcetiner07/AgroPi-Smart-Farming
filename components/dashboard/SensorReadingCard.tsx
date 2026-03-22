"use client";

import type { LucideIcon } from "lucide-react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { SemiGauge } from "./SemiGauge";

type Trend = "stable" | "falling" | "rising";

type SensorReadingCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend: Trend;
  gaugeValue: number;
  gaugeMax?: number;
  strokeClass?: string;
};

const trendCopy: Record<Trend, { label: string; Icon: LucideIcon }> = {
  stable: { label: "Stable", Icon: Minus },
  falling: { label: "Falling", Icon: TrendingDown },
  rising: { label: "Rising", Icon: TrendingUp },
};

export function SensorReadingCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gaugeValue,
  gaugeMax,
  strokeClass,
}: SensorReadingCardProps) {
  const { label, Icon: TrendIcon } = trendCopy[trend];

  return (
    <article className="rounded-3xl border border-neutral-100/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Icon
          className="h-6 w-6 text-agropi-forest"
          strokeWidth={1.75}
          aria-hidden
        />
        <span className="rounded-full bg-agropi-optimal px-2.5 py-0.5 text-[11px] font-semibold text-agropi-optimal-fg">
          Optimal
        </span>
      </div>
      <div className="flex items-end justify-between gap-1">
        <SemiGauge
          value={gaugeValue}
          max={gaugeMax}
          strokeClass={strokeClass}
        />
        <div className="min-w-0 pb-1 text-right">
          <p className="text-xs font-medium text-neutral-500">{title}</p>
          <p className="text-2xl font-bold tabular-nums text-agropi-forest">
            {value}
            {subtitle ? (
              <span className="text-base font-semibold text-neutral-600">
                {" "}
                {subtitle}
              </span>
            ) : null}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
        <TrendIcon className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
        <span>{trend === "stable" ? "— " : null}{label}</span>
      </div>
    </article>
  );
}
