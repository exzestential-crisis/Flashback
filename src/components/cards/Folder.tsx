"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { getColorVariants } from "@/utils/colorUtils";
import KebabMenu from "../nav/KebabMenu";

type FolderType = {
  name: string;
  colorId: number;
  onEdit?: (folder: FolderType) => void;
  onDelete?: (folder: FolderType) => void;
};

export default function Folder({
  name,
  colorId,
  onEdit,
  onDelete,
}: FolderType) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = getColorVariants(colorId);

  return (
    <div className="px-4 h-40 w-60">
      <div
        className="relative h-full w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Back Layer */}
        <motion.div
          className="relative h-full w-full z-0"
          initial={{ scaleY: 1, rotate: 0, skewX: 0 }}
          animate={{
            x: isHovered ? -8 : 0,
            y: isHovered ? 4 : 0,
            scaleY: isHovered ? 1.01 : 1,
            rotate: isHovered ? -1 : 0,
            skewX: isHovered ? 4 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="relative flex top-0 w-full h-1/2">
            <div
              className="w-1/3 h-full rounded-tl-xl rounded-tr-lg"
              style={{ backgroundColor: colors.dark }}
            />
            <div
              className="absolute left-16 w-10 h-[90%] clip-triangle-right"
              style={{ backgroundColor: colors.dark }}
            />
          </div>
          <div
            className="absolute bottom-0 h-6/7 w-[90%] rounded-b-3xl rounded-r-3xl"
            style={{ backgroundColor: colors.dark }}
          />
        </motion.div>
        {/* Front Layer */}
        <motion.div
          className="absolute bottom-0 h-5/7 w-full z-10 rounded-3xl origin-bottom-right"
          initial={{ y: 0, skewX: 0 }}
          animate={{
            y: isHovered ? 8 : 0,
            scaleY: isHovered ? 0.9 : 1,
            skewX: isHovered ? -10 : 0,
            rotate: isHovered ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ backgroundColor: colors.light }}
        >
          <div
            className="absolute bottom-4 right-4 z-20 h-4 w-14"
            style={{ backgroundColor: colors.base }}
          />
        </motion.div>
      </div>

      <div className="flex justify-between items-center p-2">
        <p>{name}</p>
        <KebabMenu
          type="H"
          options={[
            { label: "Edit", onClick: () => console.log("Edit clicked") },
            { label: "Delete", onClick: () => console.log("Delete clicked") },
          ]}
        />
      </div>
    </div>
  );
}
