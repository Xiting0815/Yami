/**
 * Gusto-Logo: Kochtopf in Terrakotta mit frischem Kraut-Blatt (wie public/icon.svg, dort mit hellem Hintergrund).
 * Die PWA-Icons (public/icon-*.png, favicon-32.png, apple-touch-icon.png) sind daraus gerendert.
 */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="64 96 384 320" aria-hidden="true" focusable="false">
      <path d="M256 214C246 176 258 132 318 108C324 160 300 200 256 214Z" fill="#4f9a45" />
      <path d="M256 214C266 186 286 154 308 126" fill="none" stroke="#3a7a33" strokeWidth="7" strokeLinecap="round" />
      <path d="M250 214C232 186 204 176 176 184C188 210 216 220 250 214Z" fill="#6cb35c" />
      <rect x="74" y="250" width="56" height="30" rx="15" fill="#a3442a" />
      <rect x="382" y="250" width="56" height="30" rx="15" fill="#a3442a" />
      <path d="M126 230H386V320A80 80 0 0 1 306 400H206A80 80 0 0 1 126 320Z" fill="#c65a3a" />
      <path d="M150 262H362" stroke="#e48a66" strokeWidth="12" strokeLinecap="round" opacity=".55" />
      <rect x="104" y="204" width="304" height="40" rx="20" fill="#a3442a" />
    </svg>
  )
}
