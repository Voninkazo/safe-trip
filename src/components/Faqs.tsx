import React from "react";
import { Accordion, Flowbite, type CustomFlowbiteTheme } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
  accordion: {
    root: {
      base: "divide-y divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700",
      flush: {
        off: "rounded-lg border",
        on: "border-b",
      },
    },
    content: {
      base: "p-5 first:rounded-t-lg",
    },
    title: {
      arrow: {
        base: "h-6 w-6 shrink-0",
        open: {
          off: "",
          on: "rotate-180",
        },
      },
      base: "flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg",
      flush: {
        off: "hover:bg-gray-300",
        on: "bg-transparent",
      },
      heading: "",
      open: {
        off: "",
        on: "bg-gray-100 text-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:text-white",
      },
    },
  },
};

export default function Faqs({ name }: { name: string }) {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Accordion collapseAll>
        <Accordion.Panel>
          <Accordion.Title>Do {name} buses have WiFi?</Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Yes, {name} offers WiFi on their buses. Although most trips with{" "}
              {name} will have WiFi as advertised, some buses might not come
              equipped with WiFi and onboard WiFi can lose its connection in
              rural areas. We recommend you bring a book or download a movie
              just to play it safe. {name} WiFi is generally best used for
              surfing the web, checking emails and chatting with friends; you
              shouldn’t count on the WiFi to binge watch your favorite show.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>What is {name}'s schedule?</Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              On a typical day, {name} has 3428 scheduled bus trips in total.
              However, the exact departure and arrival times vary depending on
              the day and route. The best way to find the exact schedule for
              your trip is to use the search tool on this page.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            Do you need an ID to get on the bus?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Yes, {name} requires you to present an ID to an agent to be
              allowed to board the bus. Make sure you have identification issued
              by a government agency that meets the carrier’s requirements.
              Alternative IDs, such as a college ID, won’t work.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            Do you have to print your {name} ticket?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Yes, {name} requires that all passengers have printed tickets to
              board the bus. When you book with Wanderu and activate your
              account, you will be able to easily find and download your tickets
              for most buses.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            Does {name} offer any premium features like extra legroom or movies?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              {name} focuses on delivering a great travel experience at a low
              price and currently does not offer premium features like extra
              legroom or onboard entertainment. But these days, between your
              laptop, tablet, smartphone and e-reader, you’re the master of your
              own entertainment even on longer journeys
            </p>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </Flowbite>
  );
}
