import { Lucia } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { db } from "../db";

export const adapter = new MongodbAdapter(
  db.collection("sessions"),
  db.collection("users")
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      username: attributes.username,
      email: attributes.email,
      cooperativeName: attributes.cooperativeName,
      cooperativePhoneNumber: attributes.cooperativePhoneNumber,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
