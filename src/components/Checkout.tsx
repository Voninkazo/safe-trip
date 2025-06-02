import React, { useEffect, useRef, useState } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import {
  loadStripe,
  type Stripe,
  type StripeElements,
} from "@stripe/stripe-js";
import { pickedSeatData } from "../stores/bus";

const STRIPE_KEY_API = import.meta.env.PUBLIC_STRIPE_API_KEY;
const stripePromise = loadStripe(STRIPE_KEY_API);

const CheckoutForm = ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const cardNumberElementRef = useRef<HTMLDivElement | null>(null);
  const cardExpiryElementRef = useRef<HTMLDivElement | null>(null);
  const cardCvcElementRef = useRef<HTMLDivElement | null>(null);
  const { seatPrice, busId, seatIds } = pickedSeatData.get();
  const [message, setMessage] = useState("");
  const [isPaymentProcessing, setIspaymentProcessing] = useState(false);

  useEffect(() => {
    const initStripe = async () => {
      const stripeInit = await loadStripe(STRIPE_KEY_API);
      setStripe(stripeInit);
      if (stripeInit) {
        const elementsInstance = stripeInit.elements();
        setElements(elementsInstance);
        const style = {
          base: {
            lineHeight: "40px",
            fontWeight: 300,
            fontSize: "15px",
            "::placeholder": {
              color: "#CFD7E0",
            },
          },
        };
        const cardNumberElement = elementsInstance.create("cardNumber", {
          style: style,
          placeholder: "4242 4242 4242 4242",
        });
        cardNumberElement.mount(cardNumberElementRef.current as HTMLDivElement);
        const cardExpiryElement = elementsInstance.create("cardExpiry", {
          style: style,
          placeholder: "MM/YY",
        });
        cardExpiryElement.mount(cardExpiryElementRef.current as HTMLDivElement);
        const cardCvcElement = elementsInstance.create("cardCvc", {
          style: style,
          placeholder: "123",
        });
        cardCvcElement.mount(cardCvcElementRef.current as HTMLDivElement);
      }
    };
    initStripe();
    return () => {
      if (elements) {
        elements.getElement("cardNumber")?.unmount();
        elements.getElement("cardExpiry")?.unmount();
        elements.getElement("cardCvc")?.unmount();
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIspaymentProcessing(true);

    try {
      if (!stripe || !elements) return;

      const cardNumberElement = elements.getElement("cardNumber");
      if (!cardNumberElement) return;

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

      if (error) {
        setMessage("Invalid card number or ");
      } else {
        const res = await axios.post(
          "/api/create-payment-intent",
          {
            amount: seatPrice,
            user: {
              email,
              username,
            },
            busId,
            seatIds,
            paymentMethodId: paymentMethod.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          window.location.href = `/success/${email}`;
        }
      }
      setIspaymentProcessing(false);
    } catch (error) {
      setIspaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-4 border border-gray-300 rounded-md">
        <div id="cardNumber">
          <div ref={cardNumberElementRef} className=" flex-1"></div>
        </div>
      </div>
      <div className="mt-4">
        <div id="cardExpiry">
          <div
            ref={cardExpiryElementRef}
            className="border border-gray-300 rounded-md flex-1"
          ></div>
        </div>
      </div>
      <div className="mt-4">
        <div id="cardCvc">
          <div
            ref={cardCvcElementRef}
            className="border border-gray-300 rounded-md flex-1"
          ></div>
        </div>
      </div>
      <div className="flex justify-end w-full mt-8">
        <Button
          type="submit"
          isProcessing={isPaymentProcessing}
          className="bg-blue-900 text-white px-4 py-2 rounded-md"
        >
          <span id="button-text">Pay now</span>
        </Button>
      </div>
      {message && <div className="success">{message}</div>}
    </form>
  );
};

export default function Payment() {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });

  const { email, username } = formData;

  const handleChange = (e: any) => {
    const { value, name, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const isDisabled = () => {
    const { email, username } = formData;
    return email !== "" && username !== "";
  };

  return (
    <div className="max-w-xl mx-auto w-full mt-16">
      <h2 className="text-4xl mb-8">Payment</h2>
      {!openPaymentModal ? (
        <div>
          <fieldset className="flex flex-col mb-10">
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              value={formData.email}
              onChange={handleChange}
              className="h-14 rounded-md pl-4 border border-blue-900"
            />
          </fieldset>
          <fieldset className="flex flex-col">
            <label htmlFor="">Username</label>
            <input
              type="text"
              name="username"
              placeholder="name"
              value={formData.username}
              onChange={handleChange}
              className="h-14 rounded-md pl-4 border border-blue-900"
            />
          </fieldset>
          <div className="flex justify-end w-sm">
            <button
              type="button"
              disabled={!isDisabled()}
              onClick={() => setOpenPaymentModal(true)}
              className={`font-bold ${
                isDisabled()
                  ? "bg-blue-900 cursor-pointer"
                  : "bg-gray-500 cursor-not-allowed"
              } text-white p-3 mt-8 rounded-md`}
            >
              Continue to payment
            </button>
          </div>
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutForm email={email} username={username} />
        </Elements>
      )}
    </div>
  );
}