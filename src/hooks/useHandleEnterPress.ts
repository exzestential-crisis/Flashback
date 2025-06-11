// hooks/useHandleEnterPress.ts
import { KeyboardEvent } from "react";

type UseHandleEnterPressOptions = {
  onSubmit: () => void | Promise<void>; // Keep original signature
  enableWhen?: boolean;
};

export function useHandleEnterPress({
  onSubmit,
  enableWhen = true,
}: UseHandleEnterPressOptions) {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (enableWhen && e.key === "Enter") {
      e.preventDefault();
      onSubmit(); // Call without parameters
    }
  };

  return handleKeyPress;
}
