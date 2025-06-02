export const defaultData = {
  destination: "",
  busDepartureLocation: "",
  departureTime: "",
  departureDate: "",
  driver: {
    driverName: "",
    address: "",
    driverPhoneNumber: "",
    IDCardNumber: "",
    licenseNumber: "",
    availability: "",
    emergencyContact: "",
  },
  busType: "",
  busNumber: "",
  price: 0,
  estimatedDuration: "",
  breaks: 0,
  numberOfSeats: 0,
  seats: [],
};

export const defaultSeat = {
  isAvailable: true,
  isPicked: false,
  passengerFirstName: "",
  passengerLastName: "",
  passengerPhoneNumber: "",
  passengerIDCard: "",
};
