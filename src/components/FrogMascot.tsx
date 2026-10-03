interface FrogMascotProps {
  size?: number
}

export default function FrogMascot({ size = 160 }: FrogMascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label="Frog mascot"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="80" cy="100" rx="55" ry="48" fill="#4BAE4F" />

      {/* Head */}
      <circle cx="80" cy="68" r="42" fill="#4BAE4F" />

      {/* Eye whites */}
      <circle cx="62" cy="52" r="14" fill="white" />
      <circle cx="98" cy="52" r="14" fill="white" />

      {/* Eye bumps (top of head) */}
      <circle cx="62" cy="42" r="10" fill="#5DC260" />
      <circle cx="98" cy="42" r="10" fill="#5DC260" />

      {/* Pupils */}
      <circle cx="64" cy="54" r="7" fill="#242923" />
      <circle cx="100" cy="54" r="7" fill="#242923" />

      {/* Eye shine */}
      <circle cx="67" cy="51" r="2.5" fill="white" />
      <circle cx="103" cy="51" r="2.5" fill="white" />

      {/* Smile */}
      <path
        d="M 60 78 Q 80 96 100 78"
        stroke="#242923"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cheek blush */}
      <circle cx="52" cy="72" r="8" fill="#FF9B9B" opacity="0.4" />
      <circle cx="108" cy="72" r="8" fill="#FF9B9B" opacity="0.4" />

      {/* Belly lighter patch */}
      <ellipse cx="80" cy="108" rx="32" ry="26" fill="#7DD67F" opacity="0.5" />

      {/* Front feet */}
      <ellipse cx="38" cy="136" rx="16" ry="10" fill="#4BAE4F" />
      <ellipse cx="122" cy="136" rx="16" ry="10" fill="#4BAE4F" />

      {/* Toe bumps left */}
      <circle cx="26" cy="138" r="5" fill="#3D9E41" />
      <circle cx="34" cy="142" r="5" fill="#3D9E41" />
      <circle cx="43" cy="143" r="5" fill="#3D9E41" />
      <circle cx="51" cy="140" r="5" fill="#3D9E41" />

      {/* Toe bumps right */}
      <circle cx="109" cy="140" r="5" fill="#3D9E41" />
      <circle cx="117" cy="143" r="5" fill="#3D9E41" />
      <circle cx="126" cy="142" r="5" fill="#3D9E41" />
      <circle cx="134" cy="138" r="5" fill="#3D9E41" />
    </svg>
  )
}
