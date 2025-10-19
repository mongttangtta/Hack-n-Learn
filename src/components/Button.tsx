type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyle =
    'w-[150px] h-[40px]  rounded-[20px] font-semibold text-body transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-accent-primary1 text-primary-text focus:ring-accent-primary1',
    secondary:
      'text-accent-primary1 bg-primary-text border-2 border-accent-primary1 focus:ring-accent-primary1',
    success: 'bg-accent-primary2 text-main focus:ring-accent-primary2',
    danger: 'bg-accent-warning text-primary-text focus:ring-accent-warning',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed';

  const buttonClasses = `
    ${baseStyle}
    ${variantStyles[variant]}
    ${disabled ? disabledStyle : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses.trim()}
    >
      {children}
    </button>
  );
}
