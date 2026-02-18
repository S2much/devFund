export function BiZTEQLogo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="20" cy="20" r="20" fill="#1e40af" />
        <circle cx="20" cy="20" r="18" fill="#3b82f6" />

        <path d="M 20 2 A 18 18 0 0 1 20 38 A 18 18 0 0 1 20 2 Z" fill="#1e40af" />
        <path d="M 20 2 A 18 18 0 0 1 20 38 L 20 20 Z" fill="#dbeafe" opacity="0.9" />
        <path
          d="M 20 20 L 32 20 A 12 12 0 0 1 26 32 Z"
          fill="#7dd3fc"
          opacity="0.8"
        />
        <path
          d="M 20 20 L 20 8 A 12 12 0 0 1 30 10 Z"
          fill="#bfdbfe"
          opacity="0.7"
        />
        <circle cx="20" cy="20" r="3" fill="#0c4a6e" />
      </svg>

      {showText && <span className="text-xl font-bold text-gray-900">BiZTEQ</span>}
    </div>
  );
}
