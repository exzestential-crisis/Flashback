import { IoEyeOffOutline } from "react-icons/io5";

type ClosedEyeProps = {
  size?: "small" | "medium" | "large";
};

export default function ClosedEye({ size = "medium" }: ClosedEyeProps) {
  const sizeClass = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  }[size];

  return (
    <div className={`${sizeClass} text-zinc-400 cursor-pointer`}>
      <IoEyeOffOutline />
    </div>
  );
}
