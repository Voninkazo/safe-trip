import React, { useEffect, useState } from "react";
import type { BusSeatsOverview, BusType } from "../utils/type";
import BusOverviewChart from "./BusOverviewChart";

const DashboardComponent = ({ buses }: { buses: BusType[] }) => {
  const [busSeatsOverview, setBusSeatsOverview] = useState<BusSeatsOverview[]>(
    []
  );

  const getBookings = () => {
    const updatedBusSeatsOverview = buses.map((bus) => {
      let totalSeats = 0;
      let bookedSeats = 0;

      if (bus.seats) {
        bus.seats.forEach((seat) => {
          totalSeats++;
          if (seat.passengerIDCard !== "") {
            bookedSeats++;
          }
        });
      }

      const bookedPercentage = Math.round((bookedSeats / totalSeats) * 100);
      const availablePercentage = Math.round(100 - bookedPercentage);
      return {
        busId: bus.busNumber,
        totalSeats,
        bookedSeats,
        bookedPercentage,
        availablePercentage,
        route: {
          location: bus.busDepartureLocation,
          destination: bus.destination,
        },
      };
    });
    if (updatedBusSeatsOverview) {
      setBusSeatsOverview(updatedBusSeatsOverview);
    }
  };

  useEffect(() => {
    getBookings();
  }, [buses]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-blue-900 font-semibold mb-6">
        Booking Overview
      </h1>
      <div>
        {busSeatsOverview.length !== 0 ? (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Stats:</h2>
              <div className="grid grid-cols-2 gap-5">
                {busSeatsOverview.map((bus, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-1">
                      <p>
                        <b>Bus Number</b>: {bus.busId}
                      </p>
                      <p>
                        <b>Total Seats</b>: {bus.totalSeats}
                      </p>
                      <p>
                        <b>Booked Seats</b>: {bus.bookedSeats}
                      </p>
                      <p>
                        <b>Route</b>: {bus.route.location} -{" "}
                        {bus.route.destination}
                      </p>
                    </div>
                    <div className="flex-1">
                      <BusOverviewChart bus={bus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Legend:</h2>
              <div className="flex  items-center gap-x-2 mb-4">
                <div className="w-14 h-14 border border-gray-500 bg-blue-900" />
                <span>Available</span>
              </div>
              <div className="flex  items-center gap-x-2 mb-4">
                <div className="w-14 h-14 bg-pink-300" />
                <span>Booked</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center max-w-xl mx-auto justify-center h-screen">
            <p className="text-center text-2xl font-medium">
              Your booking overview will be displayed here once you have buses
              available. Please, add new buses for your registered company!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
