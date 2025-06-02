import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { TextInputTheme, buttonTheme } from "../utils/theme";
import type { BusType, FormDataProps } from "../utils/type";
import { defaultData } from "../utils/constants";

interface UpdateDriverProps {
  bus: FormDataProps;
  buses: BusType[];
  showModal: boolean;
  setBuses: (value: BusType[]) => void;
  setShowModal: (value: boolean) => void;
}

export default function UpdateDriver({
  bus,
  buses,
  showModal,
  setBuses,
  setShowModal,
}: UpdateDriverProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormDataProps>(defaultData);

  useEffect(() => {
    setFormData(bus);
  }, [bus]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      driver: {
        ...formData.driver,
        [name]: value,
      },
    };

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("busId", `${bus._id}`);
    try {
      const response = await fetch(`/api/updateDriver`, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update driver");
      }

      const result = await response.json();
      const updatedBus = result.bus;
      const updatedBuses = buses.map((bus) =>
        bus._id === updatedBus._id ? updatedBus : bus
      );

      setBuses(updatedBuses);
      setIsProcessing(false);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update driver:", error);
      setIsProcessing(false);
      setShowModal(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      aria-hidden="true"
    >
      <Modal.Body className="max-w-md mx-auto text-white w-full">
        <h3 className="text-xl font-semibold mb-5">Driver Details</h3>
        <form action="#" onSubmit={handleSubmit}>
          <div className="mb-2">
            <Label
              htmlFor="driverName"
              value="Full Name"
              className="block mb-2 text-base font-medium text-gray-900"
            />
            <TextInput
              type="text"
              name="driverName"
              value={formData.driver.driverName}
              onChange={handleChange}
              theme={TextInputTheme}
              placeholder="Full Name..."
            />
          </div>
          <div className="mb-2">
            <Label
              htmlFor="driverPhoneNumber"
              value="Phone Number"
              className="block mb-2 text-base font-medium text-gray-900"
            />
            <TextInput
              type="tel"
              name="driverPhoneNumber"
              value={formData.driver.driverPhoneNumber}
              onChange={(e) => handleChange(e)}
              theme={TextInputTheme}
              placeholder="123-45-678"
              pattern="[0]{1}[3]{1}[2-4]{1}[0-9]{7}"
              id="phone"
              required
            />
          </div>
          <div className="mb-2">
            <Label
              htmlFor="address"
              value="Address"
              className="block mb-2 text-base font-medium text-gray-900"
            />
            <TextInput
              type="text"
              name="address"
              value={formData.driver.address}
              onChange={(e) => handleChange(e)}
              theme={TextInputTheme}
              placeholder="Enter your address..."
            />
          </div>
          <div className="mb-2">
            <Label
              htmlFor="IDCardNumber"
              value="IDCardNumber"
              className="block mb-2 text-base font-medium text-gray-900"
            />
            <TextInput
              type="text"
              name="IDCardNumber"
              value={formData.driver.IDCardNumber}
              onChange={(e) => handleChange(e)}
              pattern="[3]{1}[0]{1}[0-9]{10}"
              theme={TextInputTheme}
              placeholder="ID Card Number..."
            />
          </div>
          <div className="mb-2">
            <Label
              htmlFor="licenseNumber"
              value="License Number"
              className="block mb-2 text-base font-medium text-gray-900"
            />
            <TextInput
              type="text"
              name="licenseNumber"
              value={formData.driver.licenseNumber}
              onChange={(e) => handleChange(e)}
              theme={TextInputTheme}
              placeholder="License number..."
            />
          </div>
          <div className="mb-2">
            <Label
              htmlFor="availability"
              value="Availability"
              className="block mb-2 text-base font-medium text-gray-900"
            />
            <Select
              id="availability"
              name="availability"
              value={formData.driver.availability}
              onChange={(e) => handleChange(e)}
            >
              <option value="">Select availability</option>
              <option value="Daylight">Daylight</option>
              <option value="Night">Night</option>
            </Select>
          </div>
          <div className="mb-2">
            <Label
              htmlFor="emergencyContact"
              value="Emergency Contact"
              className="block mb-2 text-base font-medium text-gray-900"
            />
            <TextInput
              type="tel"
              name="emergencyContact"
              placeholder="123-45-678"
              pattern="[0]{1}[3]{1}[2-4]{1}[0-9]{7}"
              value={formData.driver.emergencyContact}
              onChange={(e) => handleChange(e)}
              theme={TextInputTheme}
            />
          </div>
          <Button
            type="submit"
            theme={buttonTheme}
            color="primary"
            className="mt-5"
            isProcessing={isProcessing}
          >
            Update Driver
          </Button>
          <Button
            type="button"
            theme={buttonTheme}
            onClick={() => setShowModal(false)}
            color="secondary"
            className="mt-2"
          >
            Cancel
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
