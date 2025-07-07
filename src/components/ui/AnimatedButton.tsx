import { BaseButton } from "./BaseButton";

type AnimatedButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: string;
  textSize?: string;
  img?: string;
  imgClass?: string;
  type?: "button" | "submit" | "reset";
};

export default function AnimatedButton({
  text,
  onClick,
  disabled,
  fullWidth = false,
  style = "",
  textSize = "text-sm",
  img = "",
  imgClass = "",
  type = "button",
}: AnimatedButtonProps) {
  return (
    <div>
      <BaseButton
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`p-2.5 gap-4 rounded-lg ${textSize} ${style} ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {img && <img src={img} className={imgClass} />}
        {text}
      </BaseButton>
    </div>
  );
}
