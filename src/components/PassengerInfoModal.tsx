import React, { type FormEvent, useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import type { BusType, Seat } from "../utils/type";
import { TextInputTheme, buttonTheme } from "../utils/theme";
import { passengersInfo } from "../stores/bus";

interface PassengerInfoModalProps {
  bus: BusType;
  seatId: String;
  seatsData: Seat[];
  isFormModalOpen: boolean;
  setIsFormModalOpen: (value: boolean) => void;
  setSeatsData: (value: Seat[]) => void;
}

export default function PassengerInfoModal({
  bus,
  seatId,
  isFormModalOpen,
  setIsFormModalOpen,
  setSeatsData,
}: PassengerInfoModalProps) {
  const [inputFormData, setInputFormData] = useState({
    passengerFirstName: "",
    passengerLastName: "",
    passengerPhoneNumber: "",
    passengerIDCard: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    passengerFirstName,
    passengerLastName,
    passengerPhoneNumber,
    passengerIDCard,
  } = inputFormData;

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setInputFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("seatId", `${seatId}`);
    formData.append("busId", `${bus.id}`);

    try {
      const response = await fetch(`/api/bookSeat`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const { bus } = await response.json();
        const updatedSeatsData = bus?.seats;

        const newPassengerInfo = {
          passengerFirstName,
          passengerLastName,
          passengerPhoneNumber,
          passengerIDCard,
        };
        passengersInfo.set([...passengersInfo.get(), newPassengerInfo]);

        setSeatsData(updatedSeatsData);
        resetForm();
        setIsProcessing(false);
        setIsFormModalOpen(false);
      }
    } catch (error) {
      setIsProcessing(false);
      setIsFormModalOpen(false);
    }
  };

  const resetForm = () => {
    setInputFormData({
      passengerFirstName: "",
      passengerLastName: "",
      passengerPhoneNumber: "",
      passengerIDCard: "",
    });
  };

  return (
    <Modal
      show={isFormModalOpen}
      onClose={() => setIsFormModalOpen(false)}
      aria-hidden="true"
      className="w-full"
    >
      <Modal.Body className="max-w-md mx-auto text-white">
        <h3 className="text-xl font-semibold">Passenger Details</h3>
        <div className="p-8 md:p-5">
          <p className="pb-4 text-sm">
            Passenger's name must mucth what is shown in their government ID.
          </p>
          <form className="space-y-4" action="#" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="passengerFirstName"
                className="block mb-2 text-sm font-medium"
              >
                Passenger's First Name
              </Label>
              <TextInput
                type="text"
                name="passengerFirstName"
                id="passengerFirstName"
                value={passengerFirstName}
                onChange={(e) => handleInputChange(e)}
                placeholder="Your First Name"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="passengerLastName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Passenger's Last Name
              </Label>
              <TextInput
                type="text"
                name="passengerLastName"
                id="passengerLastName"
                value={passengerLastName}
                onChange={(e) => handleInputChange(e)}
                placeholder="Your Last Name"
                theme={TextInputTheme}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="passengerPhoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Passenger's Phone Number
              </Label>
              <TextInput
                type="tel"
                name="passengerPhoneNumber"
                id="passengerPhoneNumber"
                pattern="[0]{1}[3]{1}[2-4]{1}[0-9]{7}"
                placeholder="123-45-678"
                value={passengerPhoneNumber}
                onChange={(e) => handleInputChange(e)}
                theme={TextInputTheme}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="passengerIdCard"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Passenger's ID card
              </Label>
              <TextInput
                type="text"
                name="passengerIDCard"
                id="passengerIDCard"
                pattern="[3]{1}[0]{1}[0-9]{10}"
                value={passengerIDCard}
                onChange={(e) => handleInputChange(e)}
                placeholder="301345678904"
                theme={TextInputTheme}
                required
              />
            </div>
            <Button
              type="submit"
              theme={buttonTheme}
              color="primary"
              isProcessing={isProcessing}
            >
              Submit
            </Button>
            <Button
              type="button"
              theme={buttonTheme}
              color="secondary"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
