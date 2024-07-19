interface SpinnerProps {
  size?: number;
  borderWidth?: number;
  color?: string;
  className?: string;
}

export function Spinner({ size = 24, borderWidth = 2, className }: SpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid #00000000`,
        borderTop: `${borderWidth}px solid red`,
        borderRadius: '50%',
        animation: 'spin .65s linear infinite',
      }}
      className={`!border-t-gray-600 dark:!border-t-gray-200 ${className || ""}`}
    />
  );
}