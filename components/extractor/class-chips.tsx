'use client';

interface ClassChipsProps {
  classes: string[];
  maxDisplay?: number;
}

export function ClassChips({ classes, maxDisplay }: ClassChipsProps) {
  const displayClasses = maxDisplay ? classes.slice(0, maxDisplay) : classes;
  const remaining = maxDisplay ? classes.length - maxDisplay : 0;

  return (
    <div className="flex flex-wrap">
      {displayClasses.map((c) => (
        <span key={c} className="chip">
          {c}
        </span>
      ))}
      {remaining > 0 && (
        <span className="chip bg-muted">+{remaining} more</span>
      )}
    </div>
  );
}
