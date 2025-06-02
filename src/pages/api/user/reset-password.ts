import { isWithinExpirationDate } from "oslo";
import { Argon2id } from "oslo/password";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import type { APIContext } from "astro";
import ResetPassword from "../../../models/ResetPassword";
import { lucia } from "../../../lib/auth";
import UserModel from "../../../models/User";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();

  let newPassword = formData.get("new-password");
  let confirmPassword = formData.get("confirm-password");
  let newToken = formData.get("token");
  if (!newPassword || !confirmPassword) {
    return new Response(JSON.stringify({ message: "Invalid password" }), {
      status: 400,
    });
  }

  if (newPassword !== confirmPassword) {
    return new Response(JSON.stringify({ message: "Password do not match" }), {
      status: 400,
    });
  }

  const verificationToken = newToken ? newToken : "";
  const tokenHash = encodeHex(
    await sha256(new TextEncoder().encode(verificationToken.toString()))
  );
  const token = await ResetPassword.findOne({ token_hash: newToken });

  if (token) {
    await ResetPassword.deleteOne({ tokenHash });
  }

  if (!token || !isWithinExpirationDate(token.expires_at)) {
    return new Response(null, {
      status: 400,
    });
  }

  await lucia.invalidateUserSessions(token.user_id);
  const hashedPassword = await new Argon2id().hash(newPassword.toString());
  await UserModel.findByIdAndUpdate(token.user_id, {
    password: hashedPassword,
  });
  const session = await lucia.createSession(token.user_id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/signin",
      "Set-Cookie": sessionCookie.serialize(),
      "Referrer-Policy": "no-referrer",
    },
  });
}
