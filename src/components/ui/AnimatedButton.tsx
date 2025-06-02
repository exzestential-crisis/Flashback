"use client";

type AnimmatedButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: string;
  textSize?: string;
  img?: string;
  imgClass?: string;
};

export default function AnimatedButton({
  text,
  type = "button",
  onClick,
  disabled = false,
  fullWidth = false,
  style = "",
  textSize = "text-sm",
  img = "",
  imgClass = "",
}: AnimmatedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    onClick?.();
  };

  return (
    <div>
      <button
        type={type}
        onClick={handleClick}
        className={`
            ${style}
            ${fullWidth ? "w-full" : null}
            cursor-pointer
            flex items-center justify-center
            p-2.5 gap-4 rounded-lg
            text-white ${textSize} font-medium
            bg-sky-500 
            shadow-[0_4px_0_theme('colors.sky.600')] 

            transition
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
        {img && <img src={img} className={imgClass} />}
        {text}
      </button>
    </div>
  );
}

/*          bg-sky-500 dark:bg-sky-800
            shadow-[0_4px_0_theme('colors.sky.600')] dark:shadow-[0_4px_0_theme('colors.sky.900')]

            transition
            hover:bg-sky-400 dark:hover:bg-sky-700
            hover:shadow-[0_4px_0_theme('colors.sky.500')] dark:hover:shadow-[0_4px_0_theme('colors.sky.800')]
            hover:translate-y-[1px]

            focus:bg-sky-600 focus:dark:bg-sky-900
            focus:shadow-none
            focus:translate-y-1

            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:bg-sky-500 dark:disabled:hover:bg-sky-800
            disabled:hover:shadow-[0_4px_0_theme('colors.sky.600')] dark:disabled:hover:shadow-[0_4px_0_theme('colors.sky.900')]
            disabled:hover:translate-y-0
*/
