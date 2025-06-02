import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxReset } from "react-icons/rx";
import ResetTripModal from "./ResetTripModal";
import DeleteBusModal from "./DeleteBusModal";
import NoResulstFound from "./NoResultsFound";
import type { BusType } from "../utils/type";

interface BusesListProps {
  buses: BusType[];
  cooperativeName: string;
}
export default function BusesList({ buses, cooperativeName }: BusesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [originalBuses, setOriginalBuses] = useState<BusType[]>([]);
  const [busesToDisplay, setBusesToDisplay] = useState<BusType[]>([]);
  const [busId, setBusId] = useState<String>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openTripModal, setOpenTripModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setOriginalBuses(
      buses.filter((bus) => bus.cooperative.name === cooperativeName)
    );
  }, [buses, cooperativeName]);

  useEffect(() => {
    if (!searchTerm) {
      setBusesToDisplay(originalBuses);
      return;
    }

    const foundBuses = originalBuses.filter((bus: BusType) =>
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setBusesToDisplay(foundBuses);
  }, [originalBuses, searchTerm]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchTerm(e.target.value);
  };

  const deleteBus = async (busId: String) => {
    try {
      const response = await fetch(`/api/deleteBus`, {
        method: "DELETE",
        body: JSON.stringify({ busId }),
      });
      if (response.status === 200) {
        const updatedBuses = busesToDisplay.filter((bus) => bus._id !== busId);
        setBusesToDisplay(updatedBuses);
        setIsProcessing(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const handleDeleteTrip = (busId: String) => {
    if (busId) {
      setBusId(busId);
      setIsModalOpen(true);
    }
  };

  const handleResetTrip = (busId: String) => {
    if (busId) {
      setBusId(busId);
      setOpenTripModal(true);
    }
  };

  const resetTrip = async (busId: String) => {
    setOpenTripModal(false);
    try {
      const response = await axios.post(
        "/api/resetTrip",
        {
          busId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const busData = response.data.bus;
      const resetedBusInfo = busesToDisplay.map((bus) => {
        if (bus._id === busId) {
          return {
            ...bus,
            busDepartureLocation: busData.busDepartureLocation,
            destination: busData.destination,
            departureTime: busData.departureTime,
            departureDate: busData.departureDate,
            seats: busData.seats,
          };
        }
        return bus;
      });
      setBusesToDisplay(resetedBusInfo);
    } catch (error) {
      setIsProcessing(false);
    }
  };
  return (
    <div className="mt-10">
      <div className="mb-8">
        <div className="flex gap-x-4 items-center">
          <label htmlFor="search">Search for a bus:</label>
          <input
            type="text"
            name="search"
            id="search"
            className="border border-blue-900 rounded-md p-2"
            placeholder="Enter a bus number..."
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="max-w-screen-2xl">
        <div className="flex flex-col">
          <div className="flex flex-row font-bold bg-gray-200 p-2">
            <div className="flex-1">Bus Number</div>
            <div className="flex-1">Location</div>
            <div className="flex-1">Destination</div>
            <div className="flex-1">Fare</div>
            <div className="flex-1">Driver</div>
            <div className="flex-1">Contact</div>
            <div className="flex-1">Departure Date</div>
            <div className="flex-1 text-end">Edit</div>
            <div className="flex-1 text-end">Reset</div>
            <div className="flex-1 text-end">Delete</div>
          </div>
          {busesToDisplay.length !== 0 ? (
            busesToDisplay.map((bus: BusType, index: number) => {
              return (
                <div key={index} className="flex mb-4">
                  <div className="flex-1 p-2 font-bold">{bus.busNumber}</div>
                  <div className="flex-1 p-2">{bus.busDepartureLocation}</div>
                  <div className="flex-1 p-2">{bus.destination}</div>
                  <div className="flex-1 p-2">
                    Ar <b className="text-blue-900">{bus.price.toString()}</b>
                  </div>
                  <div className="flex-1 p-2">{bus.driver.driverName}</div>
                  <div className="flex-1 p-2">
                    <a
                      href={`tel:+261${bus.driver.driverPhoneNumber}`}
                      target="_blank"
                      className="underline text-blue-900"
                    >
                      {bus.driver.driverPhoneNumber}
                    </a>
                  </div>
                  <div className="flex-1 p-2">
                    {bus.departureDate.substring(0, 10)}
                  </div>
                  <div className="flex-1 text-end pr-4 pt-2">
                    <a href={`/admin/buses/${bus._id}`}>
                      <button className="text-blue-900">
                        <MdEdit />
                      </button>
                    </a>
                  </div>
                  <div className="flex-1 text-end pr-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleResetTrip(bus._id || "")}
                    >
                      <RxReset />
                    </button>
                  </div>
                  <div className="flex-1 text-end pr-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteTrip(bus._id || "")}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <NoResulstFound
              heading="Hmmm... It looks like there are no available buses for this cooperative."
              text="Please try again with a different bus id or add new buses."
            />
          )}
        </div>
      </div>
      <ResetTripModal
        isProcessing={isProcessing}
        busId={busId}
        resetTrip={resetTrip}
        openTripModal={openTripModal}
        setOpenTripModal={setOpenTripModal}
      />
      <DeleteBusModal
        isProcessing={isProcessing}
        busId={busId}
        deleteBus={deleteBus}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
