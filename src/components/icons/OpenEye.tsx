import { IoEyeOutline } from "react-icons/io5";

type OpenEyeProps = {
  size?: "small" | "medium" | "large";
};

export default function OpenEye({ size = "medium" }: OpenEyeProps) {
  const sizeClass = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  }[size];

  return (
    <div className={`${sizeClass} text-zinc-400 cursor-pointer`}>
      <IoEyeOutline />
    </div>
  );
}
