import mongoose from "mongoose";

export let Bus: any;
try {
  Bus = mongoose.model("Bus");
} catch (error) {
  const busSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    busDepartureLocation: { type: String },
    departureTime: {
      type: String,
      required: true,
    },
    departureDate: { type: Date, required: true },
    driver: {
      driverName: { type: String, required: false },
      driverPhoneNumber: { type: String, required: false },
      IDCardNumber: { type: String, required: false },
      licenseNumber: { type: String, required: false },
      address: { type: String, required: false },
      availability: { type: String, required: false },
      emergencyContact: { type: String, required: false },
    },
    estimatedDuration: { type: String, required: true },
    breaks: { type: Number, required: true },
    price: { type: Number, required: true },
    busNumber: { type: String, required: true },
    busType: { type: String, required: true },
    cooperative: {
      name: { type: String, required: false },
      phoneNumber: { type: String, required: false },
    },
    seats: [
      {
        isAvailable: { type: Boolean },
        isPicked: { type: Boolean },
        passengerFirstName: { type: String },
        passengerLastName: { type: String },
        passengerPhoneNumber: { type: String },
        passengerIDCard: { type: String },
      },
    ],
  });

  Bus = mongoose.model("Bus", busSchema);
}
