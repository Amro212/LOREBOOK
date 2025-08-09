type PreviewItem = {
  id: string;
  text: string;
  username: string;
  mood?: string; // emoji
};

type SentencePreviewProps = {
  items?: PreviewItem[];
};

export default function SentencePreview({ items }: SentencePreviewProps) {
  const data: PreviewItem[] =
    items ?? [
      { id: "1", text: "The lantern flickered like it feared the dark.", username: "ember", mood: "🕯️" },
      { id: "2", text: "Footsteps counted slow secrets down the hall.", username: "hollow", mood: "👣" },
      { id: "3", text: "Someone had turned the map upside down.", username: "lark", mood: "🗺️" },
      { id: "4", text: "We agreed to pretend this was the plan.", username: "moss", mood: "🤫" },
      { id: "5", text: "Dawn arrived wearing a borrowed color.", username: "rift", mood: "🌅" },
    ];

  return (
    <ul className="space-y-3">
      {data.map((s) => (
        <li
          key={s.id}
          className="fade-in rounded-lg border border-white/10 bg-white/5 px-4 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="leading-relaxed">
              <span className="mr-2" aria-hidden>
                {s.mood ?? "✒️"}
              </span>
              {s.text}
            </p>
            <span className="text-xs opacity-70">@{s.username}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}


