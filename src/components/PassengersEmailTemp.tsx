import React from "react";

export interface PassengerInfo {
  email: string;
  username: string;
  amount: string;
  quantity: number;
  driverName: string;
  driverPhoneNumber: string;
  busNumber: string;
  busType: string;
}

const PassengersEmailTemplate = (passengersInfo: PassengerInfo) => {
  const {
    username,
    amount,
    quantity,
    driverName,
    driverPhoneNumber,
    busNumber,
    busType,
  } = passengersInfo;

  return (
    <div>
      <h2>Thanks for trusting our service</h2>
      <p>Please, review your receipt below</p>
      <div>
        <p>
          <span>Username:</span>
          <span className="m-0.5">{username}</span>
        </p>
        <p>
          <span>Paid amount:</span>
          <span className="ml-3">{amount}</span>
        </p>
        <p>
          <span>Booked Seat:</span>
          <span className="ml-3">{quantity}</span>
        </p>
        <p>
          <span>Driver Name:</span>
          <span className="ml-3">{driverName}</span>
        </p>
        <p>
          <span>Driver phone number:</span>
          <span className="ml-3">{driverPhoneNumber}</span>
        </p>
        <p>
          <span>Bus number:</span>
          <span className="ml-3">{busNumber}</span>
        </p>
        <p>
          <span>Bus type:</span>
          <span className="ml-3">{busType}</span>
        </p>
      </div>
    </div>
  );
};

export default PassengersEmailTemplate;
