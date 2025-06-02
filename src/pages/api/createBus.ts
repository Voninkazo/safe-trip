import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";
import { defaultSeat } from "../../utils/constants";

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  const { body } = await request.json();
  const {
    destination,
    departureTime,
    driver,
    estimatedDuration,
    departureDate,
    busDepartureLocation,
    busType,
    busNumber,
    breaks,
    price,
  } = body;
  const user = locals.user;

  if (!body) {
    return new Response(JSON.stringify({ message: "Failed to create Bus" }), {
      status: 500,
    });
  }

  const seats = [];

  try {
    for (let index = 0; index < Number(body?.numberOfSeats); index++) {
      seats.push(defaultSeat);
    }

    const newBus = new Bus({
      destination,
      departureTime,
      driver,
      estimatedDuration,
      departureDate,
      busDepartureLocation,
      busType,
      busNumber,
      breaks,
      seats: seats,
      cooperative: {
        name: user?.cooperativeName,
        phoneNumber: "",
      },
      price,
    });

    await newBus.save();

    return new Response(
      JSON.stringify({ message: "Bus created successfully", bus: newBus }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to create Bus" }), {
      status: 500,
    });
  }
};
