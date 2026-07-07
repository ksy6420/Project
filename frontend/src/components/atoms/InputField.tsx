import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = React.memo(
  ({
    label,
    icon: Icon,
    type = 'text',
    value,
    onChange,
    placeholder,
    required,
    className = '',
    error,
    id,
    ...props
  }) => {
    const inputId = id || React.useId();

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="input-container">
          {Icon && (
            <div className="input-icon">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={`input-field ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
      </div>
    );
  },
);
