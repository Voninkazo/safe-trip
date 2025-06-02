import React, { useState, type FormEvent } from "react";
import axios from "axios";
import BusConfirmationModal from "./BusConfirmationModal";
import BusForm from "./BusForm";
import type { FormDataProps } from "../utils/type";
import { defaultData } from "../utils/constants";

export default function AddBusForm() {
  const [formData, setFormData] = useState<FormDataProps>(defaultData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    const updatedFormData =
      name === "driverPhoneNumber" || name === "driverName"
        ? { ...formData, driver: { ...formData.driver, [name]: value } }
        : { ...formData, [name]: value };

    setFormData(updatedFormData);
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/createBus",
        { body: formData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFormData(defaultData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold my-5 text-blue-900">Add a new bus</h3>
      <BusForm
        formData={formData}
        isModalOpen={isModalOpen}
        handleChange={handleChange}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
        buttonType="button"
      />
      <BusConfirmationModal
        formData={formData}
        isModalOpen={isModalOpen}
        buttonType="submit"
        handleChange={handleChange}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
        heading="Bus Details"
        confirmationText="You have created a new bus. Please review before submitting it!"
      />
    </div>
  );
}
