import React from "react";
import type { BusSeatsOverview } from "../utils/type";
import { PieChart } from "react-minimal-pie-chart";

const BusOverviewChart = ({ bus }: { bus: BusSeatsOverview }) => {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <div className="w-32 h-32 mr-4">
            <PieChart
              data={[
                {
                  title: "Available",
                  value: bus.availablePercentage,
                  color: "rgba(24, 72, 94, 1)",
                },
                {
                  title: "Booked",
                  value: bus.bookedPercentage,
                  color: "#F48FB1",
                },
              ]}
              label={({ dataEntry }) =>
                dataEntry.value !== 0 ? `${dataEntry.value}%` : ""
              }
              labelStyle={() => ({
                fontSize: "10px",
                fill: "#fff",
              })}
              lineWidth={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusOverviewChart;
