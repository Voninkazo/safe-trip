import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import UpdateDriver from "./DriversInfoModal";
import NoResulstFound from "./NoResultsFound";
import type { BusType } from "../utils/type";
import { defaultData } from "../utils/constants";

interface DriversListProps {
  cooperativeName: String;
  userBuses: BusType[];
}

export default function DriversList({
  cooperativeName,
  userBuses,
}: DriversListProps) {
  const [showModal, setShowModal] = useState(false);
  const [pickedBus, setPickedBus] = useState<any>(defaultData);
  const [buses, setBuses] = useState<BusType[]>([]);

  const handleClickEdit = (bus: BusType) => {
    setShowModal(true);
    setPickedBus(bus);
  };

  useEffect(() => {
    setBuses(userBuses);
  }, [userBuses]);

  return (
    <div className="mt-4 basis-[78%] max-h-screen overflow-y-auto pr-10">
      <h3 className="text-3xl text-blue-900 mb-10">
        Available Drivers at {cooperativeName}
      </h3>
      {buses.length !== 0 ? (
        <div className="flex flex-col">
          <div className="flex flex-row font-bold bg-gray-200 p-2">
            <div className="flex-1">Name</div>
            <div className="flex-1">Phone Number</div>
            <div className="flex-1">ID Card</div>
            <div className="flex-1">Licence Number</div>
            <div className="flex-1">Address</div>
            <div className="flex-1">Availability</div>
            <div className="flex-1">Emergency Contact</div>
            <div className="flex-1">Edit</div>
          </div>
          {buses?.map((bus: BusType, index) => {
            const {
              driverName,
              driverPhoneNumber,
              address,
              IDCardNumber,
              licenseNumber,
              availability,
              emergencyContact,
            } = bus.driver;

            return (
              <div key={index} className="flex border-b mb-4">
                <div className="flex-1 p-2">{driverName}</div>
                <div className="flex-1 p-2">
                  <a
                    href={`tel:+261${driverPhoneNumber}`}
                    target="_blank"
                    className="text-blue-900 underline"
                  >
                    {driverPhoneNumber}
                  </a>
                </div>
                <div className="flex-1 p-2">{IDCardNumber}</div>
                <div className="flex-1 p-2">{licenseNumber}</div>
                <div className="flex-1 p-2">{address}</div>
                <div className="flex-1 p-2">{availability}</div>
                <div className="flex-1 p-2">
                  <a
                    href={`tel:+261${emergencyContact}`}
                    target="_blank"
                    className="text-blue-900 underline"
                  >
                    {emergencyContact}
                  </a>
                </div>
                <div className="flex-1 p-2">
                  <button
                    type="button"
                    onClick={() => handleClickEdit(bus)}
                    className="font-bold text-blue-900 basis-[30%] underline"
                  >
                    <MdEdit />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-36">
          <NoResulstFound
            text="Please create new buses with drivers."
            heading="Hmmm...looks like there are no drivers assigned to this cooperative!"
          />
        </div>
      )}
      <UpdateDriver
        bus={pickedBus}
        buses={buses}
        showModal={showModal}
        setBuses={setBuses}
        setShowModal={setShowModal}
      />
    </div>
  );
}
