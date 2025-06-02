import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";

export const POST: APIRoute = async ({ request }) => {
  try {
    let formData: any;
    let updatedBus: any;

    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json();
      const busId = body.busId;
      updatedBus = await Bus.findOne({ _id: busId });
      updatedBus.seats = body.seats;

      if (!updatedBus) {
        return new Response(JSON.stringify({ message: "Bus not found" }), {
          status: 404,
        });
      }
    } else {
      formData = await request.formData();
      const busId = formData.get("busId");

      updatedBus = await Bus.findOne({ _id: busId });

      if (!updatedBus) {
        return new Response(JSON.stringify({ message: "Bus not found" }), {
          status: 404,
        });
      }

      const busProps = Object.keys(updatedBus.toJSON()).filter(
        (key) =>
          key !== "_id" &&
          key !== "cooperative" &&
          key !== "seats" &&
          key !== "driver"
      );

      busProps?.forEach((key) => {
        return (updatedBus[key] = formData.get(key));
      });
    }

    await updatedBus.save();

    return new Response(
      JSON.stringify({ message: "Bus updated successfully", bus: updatedBus }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to update bus" }), {
      status: 500,
    });
  }
};
