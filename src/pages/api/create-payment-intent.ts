import { type PassengerInfo } from './../../components/PassengersEmailTemp';
import type { APIRoute } from "astro";
import Stripe from "stripe";
import { Bus } from "../../models/Bus";
import type { Seat } from "../../utils/type";
import PassengersEmailTemplate from "../../components/PassengersEmailTemp";
import { Resend } from "resend";

const STRING_API = import.meta.env.STRIPE_SECRET_STRING;
const stripe = new Stripe(STRING_API);

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function creatEmail(passengersInfo: PassengerInfo) {
  const { email } = passengersInfo;
  const { data, error } = await resend.emails.send({
    from: "happytravel@onja.org",
    to: [email],
    subject: "Receipt",
    react: PassengersEmailTemplate(passengersInfo),
  });

  if (error) {
    return new Response("Failed to create token", {
      status: 400,
    });
  }

  return data;
}

export const POST: APIRoute = async (context) => {
  const { amount, paymentMethodId, user, busId, seatIds } = await context.request.json();

  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: "usd",
      payment_method_types: ['card'],
      payment_method: paymentMethodId,
      customer: customer.id,
    });

    const confirm = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: paymentMethodId,
        receipt_email: user.email
      }
    );

    if (confirm.status === "succeeded") {
      const bus = await Bus.findOne({ _id: busId });

      if (!bus) {
        return new Response(JSON.stringify({ message: "Bus not found" }), {
          status: 404,
        });
      }

      const seatIdStrings = seatIds.map((id: string) => id.toString());
      const passengersInfo: PassengerInfo = {
        email: user.email,
        username: user.username,
        amount,
        quantity: seatIds.length,
        driverName: bus.driver.driverName,
        driverPhoneNumber: bus.driver.driverPhoneNumber,
        busNumber: bus.busNumber,
        busType: bus.busType
      }

      bus.seats.forEach((seat: Seat) => {
        if (seatIdStrings.includes(seat._id.toString())) {
          seat.isAvailable = false;
        }
      });

      creatEmail(passengersInfo)
      await bus.save();
    }

    return new Response(
      JSON.stringify({ message: "Seat updated successfully", clientSecret: confirm, }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to update seat" }), {
      status: 500,
    });
  }
};
