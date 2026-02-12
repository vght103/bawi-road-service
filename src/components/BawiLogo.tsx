import { useId } from "react";

export default function BawiLogo({ size = 40 }: { size?: number }) {
  const rawId = useId();
  const gradId = `bawi-g-${rawId.replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
      <ellipse cx="20" cy="23" rx="16" ry="15" fill="#B8A88A" />
      <ellipse cx="20" cy="23" rx="16" ry="15" fill={`url(#${gradId})`} opacity="0.5" />
      <circle cx="15" cy="21" r="3" fill="white" />
      <circle cx="25" cy="21" r="3" fill="white" />
      <circle cx="15.5" cy="21.5" r="1.5" fill="#3D2E1F" />
      <circle cx="25.5" cy="21.5" r="1.5" fill="#3D2E1F" />
      <path d="M15 28 Q20 32 25 28" stroke="#3D2E1F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="20" y1="8" x2="20" y2="12" stroke="#4A8C5C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M17 7 Q20 4 20 8" stroke="#4A8C5C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M23 7 Q20 4 20 8" stroke="#4A8C5C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <defs>
        <linearGradient id={gradId} x1="4" y1="10" x2="36" y2="38">
          <stop offset="0%" stopColor="#C4A882" />
          <stop offset="100%" stopColor="#8B7B65" />
        </linearGradient>
      </defs>
    </svg>
  );
}
