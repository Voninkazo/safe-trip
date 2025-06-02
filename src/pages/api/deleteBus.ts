import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const busId = body.busId;
    await Bus.deleteOne({ _id: busId });

    return new Response(
      JSON.stringify({ message: "Bus deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to delete bus" }), {
      status: 500,
    });
  }
};
