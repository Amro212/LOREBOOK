type Props = {
  items?: { id: string; numeral: string }[];
};

export default function ChapterArchive({ items }: Props) {
  const data =
    items ?? [
      { id: "1", numeral: "I" },
      { id: "2", numeral: "II" },
      { id: "3", numeral: "III" },
      { id: "4", numeral: "IV" },
      { id: "5", numeral: "V" },
    ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible pb-2">
      {data.map((b) => (
        <div
          key={b.id}
          className="min-h-28 rounded-xl border border-[color:var(--accent-border)] bg-[color:var(--panel)] relative p-4 shadow-[inset_6px_0_0_rgba(243,201,139,0.15)]"
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[color:var(--gold)]/20" />
          <div className="pl-2">
            <div className="text-2xl font-semibold">{b.numeral}</div>
            <div className="text-sm opacity-75">Sealed • 100 lines</div>
          </div>
        </div>
      ))}
    </div>
  );
}


