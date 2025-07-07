import { MdMoreVert, MdMoreHoriz } from "react-icons/md";

type KebabMenuType = {
  type?: "V" | "H";
  size?: number;
  className?: string;
};

export default function KebabMenu({
  type = "V",
  size = 20,
  className = "",
}: KebabMenuType) {
  const Icon = type === "H" ? MdMoreHoriz : MdMoreVert;

  return <Icon size={size} className={className} />;
}
