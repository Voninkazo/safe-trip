import React from "react";
import { Button, Modal } from "flowbite-react";
import { buttonTheme } from "../utils/theme";

interface ResetTripModalProps {
  busId: String;
  openTripModal: boolean;
  isProcessing: boolean;
  resetTrip: (value: String) => void;
  setOpenTripModal: (value: boolean) => void;
}

export default function ResetTripModal({
  isProcessing,
  openTripModal,
  busId,
  setOpenTripModal, 
  resetTrip,
}: ResetTripModalProps) {
  return (
    <Modal show={openTripModal} onClose={() => setOpenTripModal(false)}>
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-white">
            Are you sure you want reset this bus info?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              isProcessing={isProcessing}
              theme={buttonTheme}
              color="primary"
              onClick={() => resetTrip(busId)}
            >
              {"Yes, I'm sure"}
            </Button>
            <Button
              theme={buttonTheme}
              color="secondary"
              onClick={() => setOpenTripModal(false)}
            >
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
