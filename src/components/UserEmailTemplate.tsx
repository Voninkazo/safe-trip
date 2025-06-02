import React from "react";

export interface Email {
  email: string;
  username: string;
  amount: string;
  cooperativeName: string;
  cooperativePhoneNumber: string;
}

const UserEmailTemplate = (passengersInfo: Email) => {
  const { username, amount, cooperativeName, cooperativePhoneNumber } = passengersInfo;

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
          <span>Cooperative Name:</span>
          <span className="ml-3">{cooperativeName}</span>
        </p>
        <p>
          <span>Cooperative Phone Number:</span>
          <span className="ml-3">{cooperativePhoneNumber}</span>
        </p>
        
      </div>
    </div>
  );
};

export default UserEmailTemplate;
