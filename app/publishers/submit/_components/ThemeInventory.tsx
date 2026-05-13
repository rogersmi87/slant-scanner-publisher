import { ThemeEntry } from '../types';

const weightOrder: Record<string, number> = { primary: 0, secondary: 1, tertiary: 2, minor: 3 };

const weightStyle: Record<string, string> = {
  primary: 'bg-[#1B2B4B] text-white',
  secondary: 'bg-[#1B2B4B]/20 text-[#1B2B4B]',
  tertiary: 'bg-[#E2E0DA] text-[#4A4840]',
  minor: 'border border-[#E2E0DA] text-[#8A8880]',
};

function ThemeList({ items, label }: { items: ThemeEntry[]; label: string }) {
  const sorted = [...items].sort((a, b) => weightOrder[a.weight] - weightOrder[b.weight]);
  return (
    <div>
      <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A8880] mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {sorted.map(({ theme, weight }) => (
          <span
            key={theme}
            className={`inline-block text-xs px-2.5 py-1 rounded-sm font-medium ${weightStyle[weight] ?? weightStyle.minor}`}
          >
            {theme}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ThemeInventory({
  conservative,
  progressive,
}: {
  conservative: ThemeEntry[];
  progressive: ThemeEntry[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ThemeList items={conservative} label="Conservative / Traditional themes" />
      <ThemeList items={progressive} label="Progressive / Secular themes" />
    </div>
  );
}
