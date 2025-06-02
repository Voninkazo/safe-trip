import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type FormEvent,
} from "react";
import UpdateBusModal from "./UpdateBusModal";
import BusForm from "./BusForm";
import BusConfirmationModal from "./BusConfirmationModal";
import type { FormDataProps, SeatDataProps } from "../utils/type";
import { defaultData } from "../utils/constants";

export default function AdminBusDetails({ bus }: { bus: FormDataProps }) {
  const [formData, setFormData] = useState<FormDataProps>(defaultData);
  const [seatsData, setSeatsData] = useState<SeatDataProps[]>([]);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bus) return;
    const date = new Date(bus.departureDate);
    const formattedDate = date.toISOString().split("T")[0];

    setFormData({
      ...bus,
      departureDate: formattedDate,
      numberOfSeats: Number(bus.seats?.length),
      seats: [],
    });
    setSeatsData(bus.seats || []);
  }, [bus]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const updatedFormData =
        name === "driverPhoneNumber" || name === "driverName"
          ? { ...formData, driver: { ...formData.driver, [name]: value } }
          : { ...formData, [name]: value };

      setFormData(updatedFormData);
    },
    [formData]
  );

  const resetSeats = useCallback(async () => {
    setIsProcessing(true);
    const resettedSeats = (bus.seats ?? []).map((seat: SeatDataProps) => ({
      ...seat,
      isAvailable: true,
      passengerFirstName: "",
      passengerLastName: "",
      passengerPhoneNumber: "",
      passengerIDCard: "",
    }));

    try {
      const response = await fetch("/api/updateBus", {
        method: "POST",
        body: JSON.stringify({ busId: bus._id, seats: resettedSeats }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setSeatsData(resettedSeats);
        setIsResetModalOpen(false);
        setIsProcessing(false);
      }
    } catch (error) {
      setIsProcessing(false);
    }
  }, [bus]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsProcessing(true);
      const formDataInfo = new FormData(e.target as HTMLFormElement);
      formDataInfo.append("busId", `${bus._id}`);
      try {
        const response = await fetch("/api/updateBus", {
          method: "POST",
          body: formDataInfo,
        });
        if (response.status === 200) {
          setIsUpdateModalOpen(false);
          setIsProcessing(false);
        }
      } catch (error) {
        setIsProcessing(false);
      }
    },
    [bus]
  );

  const formattedBusNumber = useMemo(
    () => `Updating Bus Number ${formData.busNumber}`,
    [formData.busNumber]
  );

  return (
    <div className="mt-10 mb-20 w-full">
      <h3 className="text-2xl font-bold mb-10 text-blue-900">
        {formattedBusNumber}
      </h3>
      <div>
        <BusForm
          formData={formData}
          isModalOpen={isUpdateModalOpen}
          handleChange={handleChange}
          setIsModalOpen={setIsUpdateModalOpen}
          handleSubmit={handleSubmit}
          buttonType="button"
          isUpdating={true}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row font-bold bg-gray-200 p-2">
          <div className="flex-1">Seat Id</div>
          <div className="flex-1">First Name</div>
          <div className="flex-1">Last Name</div>
          <div className="flex-1">ID Card</div>
          <div className="flex-1">Phone Number</div>
        </div>
        {seatsData &&
          seatsData.map((seat: SeatDataProps, index: number) => {
            const {
              passengerFirstName,
              passengerLastName,
              passengerIDCard,
              passengerPhoneNumber,
            } = seat;
            return (
              <div key={index} className="flex flex-row border-b">
                <div className="flex-1 p-2">{index}</div>
                <div className="flex-1 p-2">
                  {passengerFirstName || "Empty"}
                </div>
                <div className="flex-1 p-2">{passengerLastName || "Empty"}</div>
                <div className="flex-1 p-2">{passengerIDCard || "Empty"}</div>
                <div className="flex-1 p-2">
                  {passengerPhoneNumber || "Empty"}
                </div>
              </div>
            );
          })}
        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="bg-red-600 text-white font-bold px-4 py-2 mt-5 self-end"
        >
          Reset all seats
        </button>
        <UpdateBusModal
          isProcessing={isProcessing}
          isResetModalOpen={isResetModalOpen}
          setIsResetModalOpen={setIsResetModalOpen}
          resetSeats={resetSeats}
        />
        <BusConfirmationModal
          formData={formData}
          isModalOpen={isUpdateModalOpen}
          buttonType="submit"
          isUpdating={true}
          handleChange={handleChange}
          setIsModalOpen={setIsUpdateModalOpen}
          handleSubmit={handleSubmit}
          heading="New Bus Details"
          confirmationText="Would you like to save the update? Click the submit button below!"
        />
      </div>
    </div>
  );
}
