import React, { type FormEvent, useState } from "react";
import {
  getSearchTerms,
  searchTerms,
  getDepartureLocations,
  getDestinations,
} from "../stores/bus";

interface SearchFormProps {
  departures?: string[];
  destinations?: string[];
}

const SearchForm = ({ departures, destinations }: SearchFormProps) => {
  const { departureLocation, destination, departureDate } = searchTerms.get();
  const [bus, setBus] = useState({
    departureLocation: departureLocation,
    destination: destination,
    departureDate: departureDate || "",
  });

  const uniqueDepartures = Array.from(new Set(departures)).filter((dep) => dep !== bus.destination);
  const uniqueDestinations = Array.from(new Set(destinations)).filter((dep) => dep !== bus.departureLocation);

  if (uniqueDepartures) {
    getDepartureLocations(uniqueDepartures);
  }
  if (uniqueDestinations) {
    getDestinations(uniqueDestinations);
  }

  const dateNow = new Date();
  const date = dateNow.getDate();
  const month = dateNow.getMonth() + 1;
  const year = dateNow.getFullYear();
  const pastDate = `${year}-0${month}-${date}`;
  const futureDate = `${year}-0${month + 1}-${date}`;
  const isDisabled =
    !bus.departureLocation || !bus.destination || !bus.departureDate;

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const { name, value } = event.target as HTMLInputElement;
    setBus((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { departureLocation, destination, departureDate } = bus;
    try {
      getSearchTerms({ departureLocation, destination, departureDate });
      const params = JSON.stringify(
        `?q1=${departureLocation}&q2=${destination}&q3=${departureDate}`
      );
      window.location.href = `/booking/${params}`;
    } catch (error) {}
  };

  return (
    <form
      onSubmit={submit}
      className="relative z-30 bottom-20 mx-auto max-w-max"
    >
      <div className="border rounded-xl bg-white px-8 py-8 shadow-2xl">
        <h2 className="font-bold text-lg mb-4">Book your favourite bus</h2>
        <div className="flex flex-col overflow-hidden">
          <div className="mt-4 flex flex-wrap gap-4">
            <select
              name="departureLocation"
              id="departureLocation"
              required
              className="bg-white border border-blue-900 h-12 w-80 px-2 rounded-md cursor-pointer"
              value={bus.departureLocation.toString()}
              onChange={handleInputChange}
            >
              <option value="">From:City</option>
              {uniqueDepartures?.map((name: String, index: number) => (
                <option key={index}>{name}</option>
              ))}
            </select>
            <select
              name="destination"
              id="departureLocation"
              required
              className="bg-white border border-blue-900 h-12 w-80 px-2 rounded-md cursor-pointer"
              value={bus.destination}
              onChange={handleInputChange}
            >
              <option value="">To: City</option>
              {uniqueDestinations?.map((name: String, index: number) => (
                <option key={index}>{name}</option>
              ))}
            </select>
            <input
              type="date"
              name="departureDate"
              min={pastDate}
              max={futureDate}
              required
              color="red"
              className="border border-blue-900 h-12 w-80 px-2 appearance-none rounded-md cursor-pointer"
              value={bus.departureDate}
              onChange={handleInputChange}
            />
            <button
              disabled={isDisabled}
              className={`${
                isDisabled ? "bg-gray-500" : "bg-blue-900"
              } w-32 h-12 rounded-md text-white font-bold`}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
