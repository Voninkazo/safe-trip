import { TimeSpan, createDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import ResetPassword from "../../../models/ResetPassword";
import type { APIContext } from "astro";
import UserModel from "../../../models/User";
import { Resend } from "resend";
import EmailTemplate from "../../../components/EmailTemplate";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

async function sendPasswordResetToken(email: string, token: string) {
  const { data, error } = await resend.emails.send({
    from: "test@onja.org",
    to: [email],
    subject: "Password Reset Request",
    react: EmailTemplate({ token, email }),
  });

  if (error) {
    return new Response("Failed to create token", {
      status: 400,
    });
  }

  return data;
}

async function createPasswordResetToken(userId: string): Promise<string> {
  await ResetPassword.findByIdAndDelete(userId).exec();
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(userId)));

  const newPassword = new ResetPassword({
    token_hash: tokenHash,
    user_id: userId,
    expires_at: createDate(new TimeSpan(2, "h")),
  });

  await newPassword.save();

  return tokenHash;
}

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");
  try {
    const user = await UserModel.findOne({ email });

    if (
      typeof user.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
    ) {
      return new Response("Invalid email", {
        status: 400,
      });
    }
    const verificationToken = await createPasswordResetToken(user._id);
    await sendPasswordResetToken(user.email, verificationToken);
    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Email not sent" }), {
      status: 500,
    });
  }
}
