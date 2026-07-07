import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'orange'; // 오렌지 테마 안전하게 추가
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = React.memo(
  ({
    children,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled,
    isLoading = false,
    ...props
  }) => {
    let variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

    if (variant === 'orange') {
      variantClass =
        'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-lg shadow-orange-500/10 border-none';
    }

    return (
      <button
        type={type}
        disabled={disabled || isLoading}
        className={`btn ${variantClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-current" />
            처리 중...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);
