import React, { useState } from "react";
import { Button } from "flowbite-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import SubscriptionCheckout from "./SubscriptionCheckout";
import { buttonTheme } from "../utils/theme";

const STRIPE_KEY_API = import.meta.env.PUBLIC_STRIPE_API_KEY;
const stripePromise = loadStripe(STRIPE_KEY_API);

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

export default function SignupForm() {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    cooperativeName: "",
    cooperativePhoneNumber: "",
    consent: false,
  });

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { value, name, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
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

  const isFormDataFilled = () => {
    const {
      email,
      username,
      password,
      cooperativeName,
      cooperativePhoneNumber,
      consent,
    } = formData;
    return (
      !!email &&
      !!username &&
      !!password &&
      !!cooperativeName &&
      !!cooperativePhoneNumber &&
      consent
    );
  };

  const isDisabled = !isFormDataFilled();

  return (
    <div className="max-w-screen-md mx-auto mt-16">
      {!openPaymentModal ? (
        <div>
          <div className="shadow-2xl max-w-max mx-auto rounded-md py-14 px-20">
            <p className="text-base font-bold mb-8">
              Been here before? Log in for faster booking
            </p>
            <a
              href="/admin/user/signin"
              target="_blank"
              className="uppercase bg-blue-800 px-4 py-5 rounded-lg text-white font-medium text-sm"
            >
              Log in to my account
            </a>
          </div>
          <div className="flex justify-center items-baseline gap-x-16 mt-16">
            <div className="basis-[45%]">
              <p className="text-blue-900 font-bold">
                Subscribe to Happy Travel
              </p>
              <div>
                <p className="text-4xl tracking-wide mt-2">
                  <b> US$200.40</b>
                  <small className="text-base text-gray-400 pl-2">
                    per month
                  </small>
                </p>
              </div>
              <div className="mt-8">
                <div className="flex justify-between mt-4">
                  <p>Subscription</p>
                  <p>US$200.40</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-4">Billed Monthly</p>
                </div>
                <hr />
                <div className="flex justify-between mt-4">
                  <p>Subtotal</p>
                  <p>US$200.40</p>
                </div>
                <div className="flex justify-between text-gray-400 text-sm tracking-wide my-4">
                  <p>Tax</p>
                  <p>US$0.00</p>
                </div>
                <hr />
                <div className="flex justify-between mt-4">
                  <p>Total due today</p>
                  <p>US$200.40</p>
                </div>
              </div>
            </div>
            <div className="basis-[45%]">
              <fieldset className="flex flex-col my-8">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  placeholder="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-14 rounded-md pl-4 border border-blue-900"
                  required
                />
              </fieldset>
              <fieldset className="flex flex-col my-8">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  placeholder="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-14 rounded-md pl-4 border border-blue-900"
                  required
                />
              </fieldset>
              <fieldset className="flex flex-col my-8">
                <label htmlFor="cooperativeName">Cooperative Name:</label>
                <input
                  type="text"
                  name="cooperativeName"
                  value={formData.cooperativeName}
                  onChange={handleChange}
                  placeholder="Cooperative Name"
                  className="h-14 rounded-md pl-4 border border-blue-900"
                  required
                />
              </fieldset>
              <fieldset className="flex flex-col my-8">
                <label htmlFor="cooperativePhoneNumber">
                  Cooperative Contact:
                </label>
                <input
                  type="tel"
                  value={formData.cooperativePhoneNumber}
                  name="cooperativePhoneNumber"
                  pattern="[\d]{9}"
                  placeholder="cooperative Phone Number"
                  onChange={handleChange}
                  className="h-14 rounded-md pl-4 border border-blue-900"
                  required
                />
              </fieldset>
              <fieldset className="flex flex-col my-8">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="password"
                  className="h-14 rounded-md pl-4 border border-blue-900"
                  required
                />
              </fieldset>
              <fieldset className="flex items-center gap-x-3 my-4">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent"
                  className="w-24 h-24"
                  onChange={handleChange}
                  checked={formData.consent}
                />
                <label htmlFor="consent" className="text-base">
                  You'll be charged the amount and at the frequency listed above
                  until you cancel. By subsribing, you agree to open Happy
                  Travel's
                  <a
                    href="/policy"
                    className="text-blue-900 text-base underline"
                  >
                    Privacy Policy.
                  </a>
                </label>
              </fieldset>
              <p id="form-error"></p>
              <div className="flex justify-end w-sm">
                <Button
                  type="button"
                  color="primary"
                  theme={buttonTheme}
                  disabled={isDisabled}
                  onClick={() => setOpenPaymentModal(true)}
                  className="font-bold"
                >
                  Continue to payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setOpenPaymentModal(true)}
            className="text-blue-900 font-semibold underline"
          >
            <span>
              <FontAwesomeIcon icon={faAngleLeft} />
            </span>
            <span className="pl-2">Go back to user details</span>
          </button>
          <Elements stripe={stripePromise}>
            <SubscriptionCheckout user={formData} />
          </Elements>
        </div>
      )}
    </div>
  );
}
