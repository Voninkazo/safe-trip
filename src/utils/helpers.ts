import type { Seat } from "./type";

export const formatTime = (time: string): string => {
  const [hour, minute] = time.split(":");
  const formattedHour = parseInt(hour, 10) % 12 || 12;
  const period = parseInt(hour, 10) >= 12 ? "PM" : "AM";

  return `${formattedHour}:${minute} ${period}`;
};

export const calculateArrivalTime = (
  departureTime: String,
  duration: string
) => {
  let [hours, minutes] = departureTime.split(":").map(Number);
  let departureMinutes = hours * 60 + minutes;

  let durationMinutes = parseInt(duration);

  let arrivalMinutes = departureMinutes + durationMinutes;

  let arrivalHours = Math.floor(arrivalMinutes / 60);
  let arrivalMinutesRemaining = arrivalMinutes % 60;

  let formattedArrivalHours = String(arrivalHours).padStart(2, "0");
  let formattedArrivalMinutes = String(arrivalMinutesRemaining).padStart(
    2,
    "0"
  );

  return `${formattedArrivalHours}:${formattedArrivalMinutes}`;
};

export const isPicked = (seat: Seat) => {
  return seat.isPicked && seat.isAvailable;
};
