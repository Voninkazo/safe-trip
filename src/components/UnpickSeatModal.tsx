import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import type { BusType, Seat } from "../utils/type";

interface UnpickSeatModalProps {
  seatId: String;
  bus: BusType;
  seatsData: Seat[];
  isUnpickSeatModalOpen: boolean;
  setIsFormModalOpen: (value: boolean) => void;
  setSeatsData: (value: Seat[]) => void;
  setIsUnpickSeatModalOpen: (value: boolean) => void;
}

export default function UnpickSeatModal({
  bus,
  seatId,
  isUnpickSeatModalOpen,
  setSeatsData,
  setIsFormModalOpen,
  setIsUnpickSeatModalOpen,
}: UnpickSeatModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const unpickSeat = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/unpickSeat`, {
        method: "POST",
        body: JSON.stringify({ busId: bus.id, seatId }),
      });
      if (response.status === 200) {
        const { bus } = await response.json();
        setIsProcessing(false);
        setIsUnpickSeatModalOpen(false);
        setIsFormModalOpen(false);

        const updatedSeatsData = bus?.seats;
        setSeatsData(updatedSeatsData);
      }
    } catch (error) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Modal
        show={isUnpickSeatModalOpen}
        size="md"
        onClick={() => {
          setIsUnpickSeatModalOpen(false),
            setIsFormModalOpen(false);
        }}
        popup
      >
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 mt-3 text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-white">
              Are you sure you want unpick this seat?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                isProcessing={isProcessing}
                className="bg-blue-900 shrink-0 basis-1/2"
                onClick={unpickSeat}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="primary"
                className="bg-gray-300 shrink-0 basis-1/2"
                onClick={() => {
                  setIsUnpickSeatModalOpen(false),
                    setIsFormModalOpen(false);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
