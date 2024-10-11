import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  bgColor?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#3B82F6',
  bgColor = 'bg-gray-500 bg-opacity-50',
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${bgColor}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
