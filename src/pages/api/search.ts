import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";
import { type BusType } from "../../utils/type";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url).search;
  const queryString: string = url;
  const params: URLSearchParams = new URLSearchParams(queryString.substring(1));
  const queries: { [key: string]: string } = {};

  for (const [key, value] of params) {
    queries[key] = value;
  }

  const busDepartureLocation = queries.q1;
  const destination = queries.q2;
  const departureDate = queries.q3;
  const depDate = new Date(
    Date.UTC(
      parseInt(departureDate?.split("-")[0]),
      parseInt(departureDate?.split("-")[1]) - 1,
      parseInt(departureDate?.split("-")[2])
    )
  );

  if (!busDepartureLocation || !destination || !departureDate) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }

  try {
    const buses = await Bus.find({
      busDepartureLocation,
      destination,
      departureDate: depDate,
    }).exec();

    return new Response(
      JSON.stringify(
        buses.map((bus: BusType) => bus.toObject({ getters: true }))
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch buses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
