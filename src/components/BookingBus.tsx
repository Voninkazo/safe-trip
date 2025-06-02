import React, { useEffect, useState } from "react";
import { faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TripDetails from "./TripDetails";
import NoResulstFound from "./NoResultsFound";
import type { BusType } from "../utils/type";
import { calculateArrivalTime, formatTime } from "../utils/helpers";

interface BookingBusProps {
  buses: BusType[];
}

export default function BookingBus({ buses }: BookingBusProps) {
  const [sortTerm, setSortTerm] = useState("");
  const [sortedBuses, setSortedBuses] = useState(buses);
  const [busInfo, setBusInfo] = useState<BusType>(sortedBuses[0]);
  const [clickedId, setClickedId] = useState<String>("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const sortData = () => {
      const sorted = [...buses];
      if (sortTerm === "cheapest") {
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortTerm === "fastest") {
        return sorted.sort(
          (a, b) => Number(a.estimatedDuration) - Number(b.estimatedDuration)
        );
      } else if (sortTerm === "earliest") {
        return sorted.sort((a, b) =>
          a.departureTime.localeCompare(b.departureTime.toString())
        );
      } else if (sortTerm === "latest") {
        return sorted.sort((a, b) =>
          b.departureTime.localeCompare(a.departureTime.toString())
        );
      }
      return sorted;
    };

    setSortedBuses(sortData());
    if (sortedBuses.length > 0) {
      setBusInfo(sortedBuses[0]);
    }
  }, [sortTerm, buses]);

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSortTerm(value);
  };

  const handleBusDetails = (id: String) => {
    const currentBus = sortedBuses.find((bus) => bus.id === id);
    if (currentBus) {
      setBusInfo(currentBus);
      setShowDetailsModal(true);
      setClickedId(id);
    }
  };

  return (
    <div>
      <div className="ml-5 shadow-md border rounded-md max-w-xs text-center bg-white">
        <label htmlFor="sortTerm">Sort By: </label>
        <select
          name="sortTerm"
          id="sortTerm"
          className="bg-white border-none ml-2 h-12 w-56 px-2 font-meduim focus:outline-none focus:ring-none focus:border-none"
          value={sortTerm}
          onChange={(e) => handleSort(e)}
        >
          <option value="">Happy Travel List</option>
          <option value="cheapest">Cheapest</option>
          <option value="earliest">Earliest</option>
          <option value="latest">Latest</option>
          <option value="fastest">Fastest</option>
        </select>
      </div>
      {sortedBuses.length !== 0 ? (
        <div className="flex mt-10 px-5">
          <div className="basis-[99%] lg:basis-[70%] lg:mr-4">
            {sortedBuses?.map((bus: BusType, index: number) => {
              const departureTime = formatTime(bus.departureTime as string);
              const estimatedArrivaltime = calculateArrivalTime(
                bus.departureTime,
                (Number(bus.estimatedDuration) * 60).toString()
              );
              const isActive =
                (index === 0 && !clickedId) || clickedId === bus.id;
              return (
                <div
                  key={index}
                  onClick={() => {
                    bus?._id && handleBusDetails(bus?._id);
                  }}
                  className={`${
                    isActive ? "border-2 border-blue-900" : ""
                  } cursor-pointer px-5 py-3 mt-4 md:px-8 md:py-5 lg:px-10 lg:py-6 xl:px-12 xl:py-8 border rounded-lg shadow-md`}
                >
                  <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2">
                    {bus.cooperative.name}
                  </h3>
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="md:w-auto flex-wrap flex gap-x-4 md:w-[200px]">
                      <img
                        src="/icons/bus.svg"
                        alt="Bus"
                        className="w-[50px]"
                      />
                      <p className="text-sm md:text-base">
                        {departureTime}
                        <br />
                        <span className="uppercase">
                          {bus.busDepartureLocation}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-base md:text-lg lg:text-xl xl:text-2xl">
                        ―{bus.estimatedDuration}➝
                      </p>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <p className="text-sm md:text-base">
                        {formatTime(estimatedArrivaltime)}
                        <br />
                        <span className="uppercase">{bus.destination}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm -mt-4 md:text-base text-blue-900 font-bold">
                        {bus.price.toString()}Ar/Seat
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          bus?._id && handleBusDetails(bus?._id);
                        }}
                        className="text-sm text-white font-semibold rounded-2xl p-4 py-1 bg-blue-900"
                      >
                        <span className="mr-2">Details</span>
                        <FontAwesomeIcon icon={faRightLong} color="white" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lg:basis-[40%] border border-gray-400 rounded-lg">
            <TripDetails
              bus={busInfo}
              showDetailsModal={showDetailsModal}
              setShowDetailsModal={setShowDetailsModal}
            />
          </div>
        </div>
      ) : (
        <NoResulstFound
          heading="Hmmm... It looks like there are no available trips."
          text="Please try again with a different date."
        />
      )}
    </div>
  );
}
