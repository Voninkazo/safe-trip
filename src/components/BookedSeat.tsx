import React, { useState, type FormEvent, useEffect, useCallback } from "react";
import {
  Tooltip,
  type CustomFlowbiteTheme,
  Flowbite,
  Button,
  Label,
  TextInput,
} from "flowbite-react";
import { isPicked } from "../utils/helpers";
import { type BusType, type Seat } from "../utils/type";

const customTheme: CustomFlowbiteTheme = {
  tooltip: {
    target: "w-fit",
    animation: "transition-opacity",
    arrow: {
      base: "absolute z-10 h-2 w-2 rotate-45",
      style: {
        auto: "bg-white dark:bg-gray-700",
      },
    },
    base: "absolute z-10 inline-block rounded-lg px-3 py-2  font-medium shadow-sm",
    hidden: "invisible opacity-0",
    style: {
      auto: "border border-gray-200 bg-white text-gray-900",
    },
    content: "relative z-20",
  },
};

const BookedSeat = ({ bus }: { bus: BusType }) => {
  const [updatedSeatsData, setUpdatedSeatsData] = useState<any>(bus?.seats);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUnpickedSeat, setHasUnpickedSeat] = useState(false);
  const [seatId, setSeatId] = useState<String>("");
  const seat = updatedSeatsData?.find((seat: any) => seat._id === seatId);

  const [inputFormData, setInputFormData] = useState({
    passengerFirstName: "",
    passengerLastName: "",
    passengerPhoneNumber: "",
    passengerIDCard: "",
  });

  useEffect(() => {
    if (seatId) {
      setInputFormData({
        passengerFirstName: seat?.passengerFirstName,
        passengerLastName: seat?.passengerLastName,
        passengerPhoneNumber: seat?.passengerPhoneNumber,
        passengerIDCard: seat?.passengerIDCard,
      });
    }
  }, [seatId, seat]);

  const getPickedSeat = localStorage.getItem("pickedSeat");
  const { seatPrice, totalPickedSeat } = JSON.parse(
    getPickedSeat ? getPickedSeat : ""
  );

  const {
    passengerFirstName,
    passengerLastName,
    passengerPhoneNumber,
    passengerIDCard,
  } = inputFormData;

  const updateSeat = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
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
          setIsProcessing(false);
          const updatedSeatsData = bus?.seats;
          setUpdatedSeatsData(updatedSeatsData);
          setIsProcessing(false);
        }
      } catch (error) {
        setIsProcessing(false);
      }
    },
    [bus, seatId]
  );

  const removeSeat = useCallback(async () => {
    setHasUnpickedSeat(true);

    try {
      const response = await fetch(`/api/unpickSeat`, {
        method: "POST",
        body: JSON.stringify({ busId: bus.id, seatId: seatId }),
      });

      if (response.status === 200) {
        const { bus } = await response.json();
        const updatedSeatsData = bus?.seats;
        setUpdatedSeatsData(updatedSeatsData);
        setHasUnpickedSeat(false);
      }
    } catch (error) {
      setHasUnpickedSeat(false);
    }
  }, [bus, seatId]);

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setInputFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isDisabled = updatedSeatsData.filter((seat: Seat) =>
    isPicked(seat)
  ).length === 0;

  return (
    <div className="flex flex-col">
      <h2 className="text-4xl font-bold my-8">
        Trip Summary from{" "}
        <span className="text-blue-800">{bus.cooperative.name}</span>
      </h2>
      <div className="flex items-center gap-x-20">
        <div className="grid grid-cols-4 gap-4">
          <Flowbite theme={{ theme: customTheme }}>
            {updatedSeatsData?.map((seat: any, index: number) => {
              if (isPicked(seat)) {
                return (
                  <Tooltip
                    key={index}
                    trigger="click"
                    content={
                      <div>
                        <form
                          className="space-y-4 p-4"
                          action="#"
                          onSubmit={updateSeat}
                        >
                          <div className="flex gap-x-4">
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-x-4">
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
                                value={passengerPhoneNumber}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Your Last Name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                                placeholder="Your ID Card"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-x-4">
                            <Button
                              type="submit"
                              className="mt-4 w-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center"
                              isProcessing={isProcessing}
                            >
                              Update Seat
                            </Button>
                            <Button
                              type="button"
                              color="primary"
                              onClick={removeSeat}
                              isProcessing={hasUnpickedSeat}
                              className="mt-4 w-full text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                              Unpick Seat
                            </Button>
                          </div>
                        </form>
                      </div>
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setSeatId(seat.id)}
                      className={`max-w-[50px] ${
                        index == 1 ? "col-span-3" : "col-span-1"
                      } ${isPicked(seat) ? "bg-yellow-400" : ""}`}
                    >
                      <img
                        src="/icons/seat.svg"
                        alt="Seat"
                        className="w-full"
                      />
                    </button>
                  </Tooltip>
                );
              } else {
                return (
                  <button
                    type="button"
                    className={`max-w-[50px] cursor-not-allowed	 ${
                      index == 1 ? "col-span-3" : "col-span-1"
                    } ${!seat.isAvailable ? "bg-red-400" : "bg-gray-300"}`}
                    disabled
                  >
                    <img src="/icons/seat.svg" alt="Seat" className="w-full" />
                  </button>
                );
              }
            })}
          </Flowbite>
        </div>
        <div>
          <h2 className="text-xl mb-2">Legend:</h2>
          <div className="flex  items-center gap-x-2 mb-4">
            <div className="w-14 h-14 border border-gray-500" />
            <span>Available</span>
          </div>
          <div className="flex  items-center gap-x-2 mb-4">
            <div className="w-14 h-14 bg-yellow-300" />
            <span>Picked</span>
          </div>
          <div className="flex  items-center gap-x-2">
            <div className="w-14 h-14 bg-pink-300" />
            <span>Booked</span>
          </div>
        </div>
      </div>
      <div className="mb-8">
        {!isDisabled && (
          <div>
            <p className="mt-8 uppercase">
              Departure date:
              <span className="font-bold">
                {" "}
                {bus.departureDate.substring(0, 10)}
              </span>
            </p>
            <p className="mt-2 uppercase">
              Departure time:{" "}
              <span className="font-bold"> {bus.departureTime}</span>
            </p>
            <p className="mt-2 uppercase">
              Driver Contact:{" "}
              <span className="font-bold">
                {bus?.driver?.driverPhoneNumber}
              </span>
            </p>
            <p className="mt-2 uppercase">
              Cooperative Number :
              <span className="font-bold">{bus.cooperative.phoneNumber}</span>
            </p>
            <p className="mt-2 uppercase">
              Booked Seats: <span className="font-bold">{totalPickedSeat}</span>
            </p>
            <p className="mt-2 uppercase">
              Subtotal:
              <span className="font-bold">
                {seatPrice * totalPickedSeat} ar
              </span>
            </p>
          </div>
        )}
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="border px-6 py-2 rounded-md mr-8"
        >
          Go Back
        </button>
        <a href="/payment">
          <button disabled={isDisabled} className={`${isDisabled ? "bg-gray-400 cursor-pointer" : "bg-blue-900"} bg-blue-900 text-white px-6 py-2 rounded-md mt-3`}>
            CHECKOUT
          </button>
        </a>
      </div>
    </div>
  );
};

export default BookedSeat;
