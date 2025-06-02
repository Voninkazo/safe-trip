import React from "react";
import { Button, Modal } from "flowbite-react";
import { buttonTheme } from "../utils/theme";

interface DeleteBusProps {
  busId: String;
  isModalOpen: boolean;
  isProcessing: boolean;
  deleteBus: (value: String) => void;
  setIsModalOpen: (value: boolean) => void;
}

export default function DeleteBusModal({
  isProcessing,
  isModalOpen,
  busId,
  setIsModalOpen,
  deleteBus,
}: DeleteBusProps) {
  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want delete this bus?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              isProcessing={isProcessing}
              theme={buttonTheme}
              color="primary"
              onClick={() => deleteBus(busId)}
            >
              {"Yes, I'm sure"}
            </Button>
            <Button
              theme={buttonTheme}
              color="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
