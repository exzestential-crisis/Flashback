import { CloseIcon } from "../nav";
import AnimatedButton from "./AnimatedButton";
import LightButton from "./LightButton";
import Portal from "./Portal";

type BaseModalType = {
  isOpen: boolean;
  children?: any;
  cancelText?: string;
  confirmText?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
};

export default function BaseModal({
  isOpen,
  children,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onClose,
  onCancel,
  onConfirm,
  confirmDisabled = false,
}: BaseModalType) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.(); // Added the actual close logic
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleCloseClick = () => {
    onClose?.();
  };

  return (
    <div>
      {isOpen && (
        <Portal>
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={handleBackdropClick}
          >
            <div
              className="
                relative flex flex-col
                bg-white dark:bg-zinc-800
                rounded-xl shadow-lg
                w-100 p-4"
              onClick={handleModalClick}
            >
              {/* Close Icon */}
              <button
                className="absolute top-4 right-4"
                onClick={handleCloseClick} // Added onClick handler
              >
                <CloseIcon />
              </button>
              {/* Modal Content */}
              <div>{children}</div>
              {/* Actions */}
              <div className="flex justify-end gap-4">
                <LightButton text={cancelText} onClick={onCancel} />
                <AnimatedButton
                  text={confirmText}
                  onClick={onConfirm}
                  disabled={confirmDisabled}
                  style="w-24"
                />
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
