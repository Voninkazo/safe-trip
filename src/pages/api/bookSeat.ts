import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const seatId = formData.get("seatId");
  const busId = formData.get("busId");
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
            return (seat[key] = true);
          }
          return (seat[key] = formData.get(key));
        });
      }
      return seat;
    });

    if (!updatedBus) {
      return new Response(
        JSON.stringify({ message: "Failed to update seat" }),
        {
          status: 500,
        }
      );
    }

    updatedBus.seats = updatedSeat;
    await updatedBus.save();
    return new Response(
      JSON.stringify({ message: "Bus updated successfully", bus: updatedBus }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to update Bus" }), {
      status: 500,
    });
  }
};
