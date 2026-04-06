export default function VerificationIcon({ verified, size = 18 }) {
  if (verified) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#598016"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M8 12.5L10.5 15L16 9.5"
          stroke="#598016"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#F18A3F"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="#F18A3F"
        fontFamily="sans-serif"
      >
        ?
      </text>
    </svg>
  );
}
