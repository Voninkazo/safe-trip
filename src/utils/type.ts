import type { ChangeEventHandler, FormEvent } from "react";

export interface BusType {
  toObject?: any;
  destination: String;
  busDepartureLocation: String;
  departureTime: String;
  departureDate: String;
  driver: {
    driverName: String;
    address?: String;
    driverPhoneNumber: String;
    IDCardNumber?: String;
    licenseNumber?: String;
    availability?: String;
    emergencyContact?: String;
  };
  estimatedDuration: String;
  breaks: Number;
  price: Number;
  busNumber: String;
  busType: String;
  _id?: String;
  id?: String;
  cooperative: Cooperative;
  seats?: Seat[];
}

export interface Cooperative {
  name: String;
  phoneNumber: String;
}

export interface Seat {
  isPicked?: Boolean;
  isAvailable: Boolean;
  id: String;
  _id: String;
  passengerFirstName: String;
  passengerLastName: String;
  passengerPhoneNumber: String;
  passengerIDCard: String;
}

export interface SeatDataProps {
  isPicked?: boolean;
  isAvailable: boolean;
  id?: string;
  _id?: string;
  passengerFirstName: string;
  passengerLastName: string;
  passengerPhoneNumber: string;
  passengerIDCard: string;
}

export interface FormDataProps {
  destination: string;
  busDepartureLocation: string;
  departureTime: string;
  departureDate: string;
  driver: {
    driverName: string;
    address?: string;
    driverPhoneNumber: string;
    IDCardNumber?: string;
    licenseNumber?: string;
    availability?: string;
    emergencyContact?: string;
  };
  estimatedDuration: string;
  breaks: number;
  price: number;
  busNumber: string;
  busType: string;
  id?: String;
  _id?: String;
  cooperative?: {
    name: string;
    phoneNumber: string;
  };
  numberOfSeats: number;
  seats?: {
    isPicked?: boolean;
    isAvailable: boolean;
    passengerFirstName: string;
    passengerLastName: string;
    passengerPhoneNumber: string;
    passengerIDCard: string;
  }[];
}

export interface BusFormComponentProps {
  formData: FormDataProps;
  isModalOpen?: boolean;
  buttonType: "button" | "submit";
  isUpdating?: boolean;
  heading?: string;
  confirmationText?: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  setIsModalOpen: (value: boolean) => void;
}

export interface User {
  email: string;
  password?: string;
  username: string;
  cooperativeName: string;
  cooperativePhoneNumber: string;
  id: string;
}

export interface BusSeatsOverview {
  busId: String | undefined;
  totalSeats: number;
  bookedSeats: number;
  bookedPercentage: number;
  availablePercentage: number;
  route: { location: String; destination: String };
}
