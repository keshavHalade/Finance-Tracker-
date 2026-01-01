function PieSegment({ color, size, offset }) {
  const circumference = 251.2; // Matches larger pie chart
  return (
    <circle
      r="42"
      cx="50"
      cy="50"
      fill="transparent"
      stroke={color}
      strokeWidth="12"
      strokeDasharray={`${size} ${circumference - size}`}
      strokeDashoffset={offset}
      strokeLinecap="round"
    />
  );
}

export { PieSegment };
