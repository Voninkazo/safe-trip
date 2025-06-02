import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";
import { buttonTheme } from "../utils/theme";

interface UpdateBusModalProps {
  isResetModalOpen: boolean;
  isProcessing: boolean;
  resetSeats: () => void;
  setIsResetModalOpen: (value: boolean) => void;
}

export default function UpdateBusModal({
  isResetModalOpen,
  isProcessing,
  setIsResetModalOpen,
  resetSeats,
}: UpdateBusModalProps) {
  return (
    <Modal
      show={isResetModalOpen}
      onClose={() => setIsResetModalOpen(false)}
      aria-hidden="true"
      size="md"
    >
      <Modal.Body>
        <div className="pb-5">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-white">
            Are you sure you want to reset all seats?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              color="secondary"
              theme={buttonTheme}
              onClick={() => setIsResetModalOpen(false)}
            >
              No, cancel
            </Button>
            <Button
              type="button"
              color="primary"
              theme={buttonTheme}
              isProcessing={isProcessing}
              onClick={resetSeats}
            >
              Reset
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
