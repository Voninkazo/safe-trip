import { persistentAtom } from "@nanostores/persistent";

interface Search {
  departureLocation: string;
  destination: string;
  departureDate: string;
}

interface PicketSeat {
  seatPrice: Number;
  totalPickedSeat: Number;
  busId: String,
  seatIds: String[],
}

export const departureLocations = persistentAtom<string[]>(
  "departureLocations",
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const destinationLocations = persistentAtom<string[]>(
  "destinations",
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const passengersInfo = persistentAtom<any[]>('passengers', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const searchTerms = persistentAtom<Search>(
  "searchTerms",
  { departureLocation: "", destination: "", departureDate: "" },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const pickedSeatData = persistentAtom<PicketSeat>("pickedSeat", {
  seatPrice: 0,
  totalPickedSeat: 0,
  busId: "",
  seatIds: [],
}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function getDepartureLocations(data: string[]) {
  departureLocations.set(data);
}

export function getDestinations(data: string[]) {
  destinationLocations.set(data);
}

export function getSearchTerms(searchTerm: Search) {
  searchTerms.set(searchTerm);
}

export function getPicketSeatData(params: PicketSeat) {
  pickedSeatData.set(params)
}