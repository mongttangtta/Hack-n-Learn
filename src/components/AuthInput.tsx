import React from 'react';

/**
 * 공통 Input 컴포넌트
 * @param {object} props - 표준 input 엘리먼트의 모든 속성을 받을 수 있습니다.
 */

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function AuthInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...rest
}: InputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          text-body
          w-full
          pl-5 pr-12 py-5
          bg-card-background
          text-primary-text
          border-edge border
          rounded-[20px]
          placeholder-secondary-text
          transition-colors duration-300 ease-in-out
          focus:outline-none
          focus:border-accent-primary1
        "
        {...rest} // name, disabled, readOnly 등 나머지 props를 전달합니다.
      />
    </div>
  );
}
