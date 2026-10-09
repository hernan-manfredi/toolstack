type Props = { icon: string; className: string };

export function ToolIcon({ icon, className }: Props) {
  return (
    <span className={className} aria-hidden="true">
      {icon === "PDF" ? (
        <svg className="pdf-icon" viewBox="0 0 32 36" focusable="false">
          <path d="M6 2.5h13l7 7v24H6z" fill="white" stroke="currentColor" strokeWidth="2" />
          <path d="M19 2.5v7h7" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="7.5" y="24" fill="currentColor" fontSize="7" fontWeight="800">PDF</text>
        </svg>
      ) : icon}
    </span>
  );
}
