import { lucia } from "../../../lib/auth";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(JSON.stringify({ message: "Session do not exist" }), {
      status: 401,
    });
  }

  try {
    await lucia.invalidateSession(context.locals.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return context.redirect("/signoutConfirm")
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to log out" }), {
      status: 500,
    });
  }
}
