import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { busId, seatId } = body;

  let updatedBus;

  if (!seatId || seatId === "undefined" || !busId || busId === "undefined") {
    return new Response(JSON.stringify({ message: "Seat or Bus not found" }), {
      status: 404,
    });
  }

  try {
    updatedBus = await Bus.findOne({ _id: busId });
    if (!updatedBus) {
      return new Response(JSON.stringify({ message: "Bus not found" }), {
        status: 404,
      });
    }

    const updatedSeat = await updatedBus.seats.map((seat: any) => {
      if (seat.id === seatId) {
        const seatData = Object.keys(seat.toJSON()).filter(
          (key) => key !== "_id" && key !== "isAvailable"
        );
        seatData?.forEach((key) => {
          if (key === "isPicked") {
            return (seat[key] = false);
          }
          return (seat[key] = "");
        });
      }
      return seat;
    });

    updatedBus.seats = updatedSeat;
    await updatedBus.save();

    return new Response(
      JSON.stringify({ message: "Seat updated successfully", bus: updatedBus }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to update seat" }), {
      status: 500,
    });
  }
};
