import { BaseButton } from "./BaseButton";
import { FaPlus } from "react-icons/fa";

export default function FAButton({ onClick }: { onClick?: () => void }) {
  return (
    <BaseButton
      onClick={onClick}
      className="
        w-20 h-20 rounded-full
        text-3xl"
    >
      <FaPlus className="w-8 h-8" />
    </BaseButton>
  );
}
