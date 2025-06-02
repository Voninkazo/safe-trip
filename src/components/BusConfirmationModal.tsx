import React from "react";
import { Modal } from "flowbite-react";
import BusForm from "./BusForm";
import type { BusFormComponentProps } from "../utils/type";

export default function BusConfirmationModal({
  formData,
  isModalOpen,
  isUpdating,
  heading,
  confirmationText,
  setIsModalOpen,
  handleSubmit,
  handleChange,
}: BusFormComponentProps) {
  return (
    <Modal
      aria-hidden="true"
      className="w-full"
      show={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <Modal.Header className="bg-blue-900"> {heading}</Modal.Header>
      <Modal.Body className="w-full mx-auto bg-gray-100">
        <p className="text-blue-900 mb-5">{confirmationText}</p>
        <BusForm
          formData={formData}
          isModalOpen={isModalOpen}
          handleChange={handleChange}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          buttonType="submit"
          isUpdating={isUpdating}
        />
      </Modal.Body>
    </Modal>
  );
}
