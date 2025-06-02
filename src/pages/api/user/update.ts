import type { APIRoute } from "astro";
import UserModel from "../../../models/User";

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  const user = locals.user;
  const formData = await request.formData();
  const email = formData.get("email");
  let updatedUser: any;

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response("Invalid email", {
      status: 400,
    });
  }

  try {
    updatedUser = await UserModel.findOne({ email: user?.email });

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const userKeys = Object.keys(updatedUser.toJSON()).filter(
      (key) => key !== "_id" && key !== "password"
    );
    userKeys?.forEach((key) => {
      return (updatedUser[key] = formData.get(key));
    });

    await updatedUser.save();

    return new Response(
      JSON.stringify({ message: "User got updated successfuly" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to update user" }), {
      status: 500,
    });
  }
};
