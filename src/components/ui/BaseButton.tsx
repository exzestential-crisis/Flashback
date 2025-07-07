type BaseButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

export function BaseButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: BaseButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    onClick?.();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`
        ${className}
        cursor-pointer flex items-center justify-center
        text-white font-medium
        transition

        bg-sky-500 
        shadow-[0_4px_0_theme('colors.sky.600')] 
        hover:bg-sky-400 
        hover:shadow-[0_4px_0_theme('colors.sky.500')] 
        hover:translate-y-[1px]

        focus:bg-sky-600 
        focus:shadow-none
        focus:translate-y-1

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-sky-500 
        disabled:hover:shadow-[0_4px_0_theme('colors.sky.600')]
        disabled:hover:translate-y-0
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
