import type { APIRoute } from "astro";
import { Bus } from "../../models/Bus";
import { type BusType } from "../../utils/type";
import { connectDB, db } from "../../../src/db";

await connectDB();

export const GET: APIRoute = async () => {
  if (db.readyState !== 1) {
    return new Response(
      JSON.stringify({ message: "MongoDB connection is not established" }),
      {
        status: 500,
      }
    );
  }

  try {
    const buses = await Bus.find().exec();

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
