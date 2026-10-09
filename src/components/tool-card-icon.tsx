type Props = { slug: string };

export function ToolCardIcon({ slug }: Props) {
  const content = (() => {
    switch (slug) {
      case "word-counter":
      case "text-cleaner":
      case "lorem-ipsum-generator":
        return <><path d="M7 3.75h7l4 4v12.5H7z" /><path d="M14 3.75v4h4M10 12h5m-5 3h5m-5 3h3" /></>;
      case "json-formatter":
      case "json-minifier":
        return <><path d="M9 5H7v14h2m6-14h2v14h-2M11 9h2m-2 3h2m-2 3h2" /></>;
      case "base64-encoder-decoder":
      case "url-encoder-decoder":
        return <><path d="M7 8h8a3 3 0 0 1 0 6h-2m4 2H9a3 3 0 0 1 0-6h2" /><path d="m7 8 2-2m-2 2 2 2m8 6-2-2m2 2-2 2" /></>;
      case "case-converter":
        return <><path d="m6 18 4-12 4 12m-6.7-4h5.4M15 10h4m-2-2v10m-2 0h4" /></>;
      case "slug-generator":
        return <><path d="M9.5 14.5 14.5 9.5m-7 2-1.2 1.2a3.5 3.5 0 0 0 5 5l1.2-1.2m1-5 1.2-1.2a3.5 3.5 0 0 0-5-5L9.5 6.5" /></>;
      case "uuid-generator":
        return <><path d="M12 3.5v17m-7.4-13 14.8 9m-14.8 0 14.8-9M8 3.5h8m-8 17h8" /></>;
      case "percentage-calculator":
        return <><circle cx="7" cy="7" r="2.2" /><circle cx="17" cy="17" r="2.2" /><path d="m18.5 5.5-13 13" /></>;
      case "random-number-generator":
        return <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="8" cy="8" r=".8" /><circle cx="16" cy="8" r=".8" /><circle cx="12" cy="12" r=".8" /><circle cx="8" cy="16" r=".8" /><circle cx="16" cy="16" r=".8" /></>;
      case "image-resizer":
        return <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 10h6V4m4 16v-6h6M7 17l4-4 2 2 2-3 2 2" /></>;
      case "image-compressor":
        return <><path d="M12 3v12m-4-4 4 4 4-4M5 17v3h14v-3" /><path d="M5 7h3m8 0h3" /></>;
      case "image-converter":
        return <><path d="M5 8h13m-3-3 3 3-3 3M19 16H6m3-3-3 3 3 3" /></>;
      case "pdf-merger":
        return <><path d="M6 4h9l4 4v12H6z" /><path d="M15 4v4h4M9 13h7m-3.5-3.5v7" /></>;
      case "pdf-splitter":
        return <><path d="M6 4h9l4 4v12H6z" /><path d="M15 4v4h4M9 13h7m-3.5-2v4" /></>;
      default:
        return <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 9h8m-8 3h8m-8 3h5" /></>;
    }
  })();

  return (
    <svg className="tool-card-icon" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="27" height="27" rx="7" fill="var(--icon-soft)" transform="rotate(-8 17.5 18.5)" />
      <rect x="13" y="14" width="34" height="34" rx="9" fill="var(--icon-primary)" />
      <path d="M20 14h18a9 9 0 0 1 9 9v4H20a7 7 0 0 1-7-7v-6Z" fill="white" opacity=".16" />
      <path d="M40 8.5v7m-3.5-3.5h7" stroke="#f6c855" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(15 15) scale(1.25)" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {content}
      </g>
      <circle cx="10" cy="40" r="2" fill="var(--icon-primary)" opacity=".55" />
    </svg>
  );
}
