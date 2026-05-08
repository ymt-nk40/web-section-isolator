'use client';

interface StatsRowProps {
  stats: {
    label: string;
    value: string | number;
  }[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span>{stat.label}:</span>
          <span className="font-mono text-accent-foreground">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
