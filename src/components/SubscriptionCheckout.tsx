import React, { useEffect, useRef, useState } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import {
  loadStripe,
  type Stripe,
  type StripeElements,
} from "@stripe/stripe-js";

const STRIPE_KEY_API = import.meta.env.PUBLIC_STRIPE_API_KEY;

interface UserInfo {
  email: String;
  password: String;
  username: String;
  cooperativeName: String;
  cooperativePhoneNumber: String;
}

export interface User {
  user: UserInfo;
}

const SubscriptionCheckout = (user: User) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const cardNumberElementRef = useRef<HTMLDivElement | null>(null);
  const cardExpiryElementRef = useRef<HTMLDivElement | null>(null);
  const cardCvcElementRef = useRef<HTMLDivElement | null>(null);
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
          showIcon: true,
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
    // Cleanup
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
        const { data } = await axios.post(
          "/api/monthly-payment",
          {
            amount: 50000,
            user,
            paymentMethodId: paymentMethod.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.message === "User created successfully") {
          window.location.href = "/admin";
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
        <div></div>
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
      <div className="flex justify-end w-full">
        <Button
          type="submit"
          isProcessing={isPaymentProcessing}
          className="bg-blue-900 text-white mt-4 px-4 py-2 rounded-md"
        >
          <span id="button-text">Subscribe</span>
        </Button>
      </div>
      {message && <div className="success">{message}</div>}
    </form>
  );
};

export default SubscriptionCheckout;
