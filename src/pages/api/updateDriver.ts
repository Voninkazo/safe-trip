import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const busId = formData.get("busId");
  try {
    const updatedBus = await Bus.findOne({ _id: busId });
    if (!updatedBus) {
      return new Response(JSON.stringify({ message: "Bus not found" }), {
        status: 404,
      });
    }

    const driverKeys = Object.keys(updatedBus.driver).filter(
      (key) => key !== "_id"
    );
    driverKeys.forEach((key) => {
      const value = formData.get(key);
      if (value !== null) {
        updatedBus.driver[key] = value;
      }
    });

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
