import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import PassengerInfoModal from "./PassengerInfoModal";
import UnpickSeatModal from "./UnpickSeatModal";
import type { BusType, Seat } from "../utils/type";
import { formatTime, isPicked } from "../utils/helpers";
import { getPicketSeatData } from "../stores/bus";

interface TripDetailsProps {
  bus: BusType;
  showDetailsModal: boolean;
  setShowDetailsModal: (value: boolean) => void;
}

export default function TripDetails({
  bus,
  showDetailsModal,
  setShowDetailsModal,
}: TripDetailsProps) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isUnpickSeatModalOpen, setIsUnpickSeatModalOpen] = useState(false);
  const [seatId, setSeatId] = useState<String>("");
  const [seatsData, setSeatsData] = useState<Seat[]>([]);
  const {
    price,
    departureDate,
    departureTime,
    driver,
    estimatedDuration,
    breaks,
  } = bus;

  useEffect(() => {
    setSeatsData(bus.seats ? bus.seats : []);
  }, [bus]);

  const handleClickSeat = (seat: Seat) => {
    setSeatId(seat._id);
    if (seat.isPicked) {
      setIsUnpickSeatModalOpen(true);
      setIsFormModalOpen(false);
    } else {
      setIsFormModalOpen(true);
    }
  };

  const pickedSeats = seatsData?.filter((seat) => isPicked(seat));

  useEffect(() => {
    if (pickedSeats) {
      getPicketSeatData({
        seatPrice: bus.price,
        totalPickedSeat: pickedSeats.length,
        busId: bus._id ? bus._id : "",
        seatIds: pickedSeats.map((seat) => seat._id),
      });
    }
  }, [pickedSeats]);

  return (
    <>
      <div
        aria-hidden="true"
        className={`${
          showDetailsModal ? "block" : "hidden"
        } bg-gray-700 fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden lg:block lg:static md:inset-0 md:h-full`}
      >
        <div className="relative px-8 mx-auto mt-[10%] lg:mt-0 md:px-4 w-full max-w-md lg:max-w-full max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl uppercase font-semibold text-gray-900">
                Trip informations:
              </h3>
              <Button
                type="button"
                onClick={() => setShowDetailsModal(!showDetailsModal)}
                className="end-2.5 lg:hidden text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center lg:bg-none"
              >
                <img src="/icons/close.svg" alt="Close" />
                <span className="sr-only">Close modal</span>
              </Button>
            </div>
            <div className="p-8 md:p-5">
              <div className="text-sm font-semibold flex flex-col gap-y-4">
                <div className="flex gap-x-10">
                  <span>Departure Date: </span>
                  <span className="text-blue-900">
                    {departureDate.substring(0, 10)}
                  </span>
                </div>
                <div className="flex gap-x-10">
                  <span>Departure Time: </span>
                  <span className="text-blue-900">
                    {formatTime(departureTime as string)}
                  </span>
                </div>
                <div className="flex gap-x-10">
                  <span>Driver's Name: </span>
                  <span className="text-blue-900">{driver?.driverName}</span>
                </div>
                <div className="flex gap-x-10">
                  <span> Driver's Contact: </span>
                  <span className="text-blue-900">
                    {driver?.driverPhoneNumber}
                  </span>
                </div>

                <div className="flex gap-x-10">
                  <span> Estimated duration: </span>
                  <span className="text-blue-900">{estimatedDuration}</span>
                </div>

                <div className="flex gap-x-10">
                  <span> Breaks:</span>
                  <span className="text-blue-900">{breaks?.toString()}</span>
                </div>
              </div>
              <p className="mb-4 mt-10 font-semibold">BOOK A SEAT</p>
              <form className="space-y-4" action="#">
                <div className="max-w-[200px] mx-auto grid grid-cols-4 grid-rows-5 gap-4 rotate-180">
                  {seatsData?.map((seat: Seat, index: number) => {
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleClickSeat(seat)}
                        className={`seat max-w-[30px] rotate-180 ${
                          isPicked(seat)
                            ? "bg-yellow-400"
                            : !seat.isAvailable
                            ? "bg-red-400"
                            : "bg-white"
                        }`}
                        disabled={!seat.isAvailable}
                      >
                        <img
                          src="/icons/seat.svg"
                          alt="Seat"
                          className="w-full"
                        />
                      </button>
                    );
                  })}
                </div>
              </form>
              <div className="text-end">
                <p className="mt-6 mb-2">
                  <span className="text-yellow">{price?.toString()}Ar </span>{" "}
                  /seat
                </p>
                <a
                  href={`/booking/seat/${bus.id}`}
                  onClick={() => setShowDetailsModal(!showDetailsModal)}
                  className={`mt-4 max-w-[50%] text-white bg-blue-900 font-normal hover:bg-blue-800 font-medium rounded-lg text-sm px-2 xl:px-4 py-2.5 text-center ${
                    pickedSeats?.length === 0 &&
                    "bg-gray-500 cursor-not-allowed hover:bg-gray-500"
                  }`}
                >
                  Book{" "}
                  <span className="text-white font-bold">
                    {pickedSeats?.length.toString()}
                  </span>{" "}
                  {pickedSeats?.length <= 1 ? "seat" : "seats"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PassengerInfoModal
        bus={bus}
        seatId={seatId}
        seatsData={seatsData}
        isFormModalOpen={isFormModalOpen}
        setSeatsData={setSeatsData}
        setIsFormModalOpen={setIsFormModalOpen}
      />
      <UnpickSeatModal
        bus={bus}
        seatId={seatId}
        seatsData={seatsData}
        isUnpickSeatModalOpen={isUnpickSeatModalOpen}
        setIsFormModalOpen={setIsFormModalOpen}
        setIsUnpickSeatModalOpen={setIsUnpickSeatModalOpen}
        setSeatsData={setSeatsData}
      />
    </>
  );
}