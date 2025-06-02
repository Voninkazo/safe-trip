import React from "react";
import { Button, Flowbite, Label, Select, TextInput } from "flowbite-react";
import type { BusFormComponentProps } from "../utils/type";
import { customTheme } from "../utils/theme";

const cities = [
  "Toamasina",
  "Antananarivo",
  "Ambatondrazaka",
  "Fianarantsoa",
  "Antsiranana",
  "Mahajanga",
  "Toliara",
  "Mahanoro",
];

export default function BusForm({
  formData,
  buttonType,
  isUpdating,
  setIsModalOpen,
  handleSubmit,
  handleChange,
}: BusFormComponentProps) {
  const {
    destination,
    busDepartureLocation,
    departureDate,
    departureTime,
    driver,
    price,
    busNumber,
    busType,
    estimatedDuration,
    breaks,
    numberOfSeats,
  } = formData;

  const isFormDataFilled = () => {
    return (
      !!destination &&
      !!busDepartureLocation &&
      !!departureDate &&
      !!departureTime &&
      !!driver.driverName &&
      !!driver.driverPhoneNumber &&
      !!price &&
      !!busNumber &&
      !!busType &&
      !!estimatedDuration &&
      !!breaks &&
      numberOfSeats > 0
    );
  };

  const isDisabled = !isFormDataFilled();

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex align-center mb-6">
          <Label htmlFor="destination" value="Destination:" />
          <Select
            name="destination"
            id="destination"
            sizing="md"
            value={destination}
            onChange={handleChange}
            required
          >
            <option value="">Select a City:</option>
            {cities
              ?.filter((city) => city != formData.busDepartureLocation)
              .map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
          </Select>
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="busDepartureLocation" value="Departure Location:" />
          <Select
            id="busDepartureLocation"
            name="busDepartureLocation"
            value={busDepartureLocation}
            onChange={handleChange}
            required
          >
            <option value="">Select a City</option>
            {cities
              ?.filter((city) => city !== formData.destination)
              .map((city, index) => (
                <option key={index}>{city}</option>
              ))}
          </Select>
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="departureDate" value="Departure Date:" />
          <input
            type="date"
            id="departureDate"
            name="departureDate"
            value={departureDate}
            onChange={handleChange}
            placeholder="Choose a date"
            required
            className="border p-2.5 rounded-lg border-blue-900 focus:border-blue-900 basis-[50%] text-blue-900 cursor-pointer"
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="departureTime" value="Departure Time:" />
          <input
            type="time"
            id="departureTime"
            name="departureTime"
            value={departureTime}
            onChange={handleChange}
            placeholder="Choose a time"
            required
            className="border p-2.5 rounded-lg border-blue-900 focus:border-blue-900 basis-[50%] text-blue-900 cursor-pointer"
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="driverName">Driver's Name:</Label>
          <TextInput
            type="text"
            id="driverName"
            name="driverName"
            color="primary"
            required
            value={driver.driverName}
            onChange={handleChange}
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="driverPhoneNumber">Driver's Phone Number:</Label>
          <TextInput
            type="tel"
            pattern="[0]{1}[3]{1}[2-4]{1}[0-9]{7}"
            id="phone"
            name="driverPhoneNumber"
            placeholder="123-45-678"
            color="primary"
            value={driver.driverPhoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="estimatedDuration">Estimated Duration:</Label>
          <TextInput
            sizing="md"
            type="number"
            id="estimatedDuration"
            name="estimatedDuration"
            max={100}
            min={0}
            color="primary"
            value={estimatedDuration}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="breaks">Breaks:</Label>
          <TextInput
            type="number"
            id="breaks"
            name="breaks"
            color="primary"
            value={breaks}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="price">Price:</Label>
          <TextInput
            type="number"
            id="price"
            name="price"
            color="primary"
            value={price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="busNumber">Bus Number:</Label>
          <TextInput
            type="text"
            id="busNumber"
            name="busNumber"
            color="primary"
            value={busNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex align-center mb-6">
          <Label htmlFor="busType">Bus Type:</Label>
          <TextInput
            type="text"
            id="busType"
            name="busType"
            color="primary"
            value={busType}
            onChange={handleChange}
            required
          />
        </div>
        {!isUpdating && (
          <div className="flex align-center mb-6">
            <Label htmlFor="numberOfSeats">Number of seats:</Label>
            <TextInput
              type="number"
              id="numberOfSeats"
              name="numberOfSeats"
              max={18}
              min={0}
              color="primary"
              value={numberOfSeats}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="w-[70%] flex justify-end">
          {buttonType === "submit" ? (
            <Button
              type={buttonType}
              color="primary"
              disabled={isDisabled && !isUpdating}
            >
              {isUpdating ? "Update Bus" : "Create Bus"}
            </Button>
          ) : (
            <Button
              type={buttonType}
              onClick={() => setIsModalOpen(true)}
              color="primary"
              disabled={isDisabled && !isUpdating}
            >
              {isUpdating ? "Update Bus" : "Create Bus"}
            </Button>
          )}
        </div>
      </form>
    </Flowbite>
  );
}
