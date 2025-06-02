import type { CustomFlowbiteTheme } from "flowbite-react";

export const customTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: "bg-blue-900 text-white font-bold px-4 py-1",
      secondary: "bg-blue-700 text-white px-4 py-1",
      disabled: "bg-blue-700 opacity-50 cursor-not-allowed px-4 py-1",
      dangerous: "bg-red-600 text-white font-bold px-4 py-1",
    },
  },
  label: {
    root: {
      base: "self-center basis-[20%]",
      colors: {
        default: "text-blue-900",
      },
    },
  },
  textInput: {
    base: "w-full basis-[50%] focus:text-blue-900",
    field: {
      input: {
        base: "border w-full border-blue-900",
        colors: {
          primary: "text-blue-900",
        },
      },
    },
  },
  select: {
    base: "basis-[50%] text-blue-900 cursor-pointer",
    field: {
      select: {
        colors: {
          gray: "bg-white w-full",
        },
        base: "text-blue-900 bg-none border rounded-lg border-blue-900 ",
      },
    },
  },
};

export const TextInputTheme: CustomFlowbiteTheme["textInput"] = {
  field: {
    input: {
      base: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5",
    },
  },
};

export const buttonTheme: CustomFlowbiteTheme["button"] = {
  color: {
    primary: "bg-blue-900 text-white w-full items-center font-semibold h-12 mt-8",
    secondary: "border bg-none text-white w-full font-semibold",
  },
  disabled: "cursor-not-allowed opacity-50",
};

export const SideBarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    inner: "bg-blue-900 h-full pt-5",
  },
};