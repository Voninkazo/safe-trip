import type { APIRoute } from "astro";
import Stripe from "stripe";
import UserModel from "../../models/User";
import { Argon2id } from "oslo/password";
import { lucia } from "../../lib/auth";
import UserEmailTemplate, { type Email } from "../../components/UserEmailTemplate";
import { Resend } from "resend";

const STRING_API = import.meta.env.STRIPE_SECRET_STRING;
const resend = new Resend(import.meta.env.RESEND_API_KEY);

const stripe = new Stripe(STRING_API);

export async function creatEmail(emailInfo: Email) {
  const { email } = emailInfo;
  const { data, error } = await resend.emails.send({
    from: "happytravel@onja.org",
    to: [email],
    subject: "Receipt",
    react: UserEmailTemplate(emailInfo),
  });

  if (error) {
    return new Response("Failed to create token", {
      status: 400,
    });
  }

  return data;
}

export const POST: APIRoute = async (context) => {
  const body = await context.request.json();

  try {
    const { amount, paymentMethodId, user } = body;
    const { email,
      username,
      password,
      cooperativeName,
      cooperativePhoneNumber, } = user.user;
    const hasNumber = cooperativeName?.toString().match("/d+/g");
    const isValidPhoneNumber =
      typeof cooperativePhoneNumber === "string" &&
      cooperativePhoneNumber.replace(/\s/g, "").length === 10;

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      payment_method: paymentMethodId,
      customer: customer.id,
    });

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: amount,
      recurring: {
        interval: "month",
      },
      product_data: {
        name: "Bus Fee",
      },
    });

    await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: price.id,
        },
      ],
    });

    const confirm = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: paymentMethodId,
        receipt_email: user.email
      }
    );

    if (confirm.status !== "succeeded") {
      return new Response(
        JSON.stringify({ message: "Payment is not successful" }),
        {
          status: 500,
        }
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response("Invalid email", {
        status: 400,
      });
    }

    if (
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 31 ||
      !/^[a-zA-Z]+$/.test(username)
    ) {
      return new Response("Invalid username", {
        status: 400,
      });
    }

    if (typeof cooperativeName !== "string" || hasNumber) {
      return new Response("Invalid cooperative name", {
        status: 400,
      });
    }

    if (!isValidPhoneNumber) {
      return new Response("Invalid phone number", {
        status: 400,
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return new Response("Invalid password", {
        status: 400,
      });
    }
    const hashedPassword = await new Argon2id().hash(password);

    let existingUser;
    existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "User exists already, please login instead.",
        }),
        {
          status: 422,
        }
      );
    }

    const createdUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      cooperativeName,
      cooperativePhoneNumber,
    });

    const userInfo = {
      email,
      username,
      password,
      amount,
      cooperativeName,
      cooperativePhoneNumber
    }

    creatEmail(userInfo)
    await createdUser.save();
    const session = await lucia.createSession(createdUser._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response(
      JSON.stringify({ message: "User created successfully", user: createdUser }),
      {
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to complete subscription" }),
      {
        status: 500,
      }
    );
  }
};