import React from "react";

interface NoResultsFoundProps {
  heading: string;
  text: string;
}

export default function NoResulstFound({ heading, text }: NoResultsFoundProps) {
  return (
    <div className="mx-auto max-w-md text-center pt-10 lg:pt-36">
      <div className="max-w-[300px] mx-auto mb-10">
        <img src="/icons/not-found.svg" alt="Not Found" className="w-full" />
      </div>
      <h2 className="text-base font-bold">{heading}</h2>
      <p className="text-sm font-regular">{text}</p>
    </div>
  );
}
