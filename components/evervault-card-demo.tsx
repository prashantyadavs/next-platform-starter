import React from "react";
import Link from "next/link"; // Import Link from next/link
import { EvervaultCard, Icon } from "./ui/evervault-card";

export function EvervaultCardFNODemo() {
  return (
    <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-center justify-center max-w-sm mx-auto p-4 relative h-[30rem]">
      {/* Corner icons */}
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      {/* Centering the EvervaultCard with reduced font size */}
      <div className="flex flex-col justify-center items-center w-full h-full">
        <EvervaultCard text="FNO MARKET" className="text-center text-lg" />
      </div>

      {/* Additional content */}
      <h2 className="dark:text-white text-black mt-4 text-sm font-light">
        The FNO market gives a broad view of stocks for quick opportunity spotting and decision-making.
      </h2>

      {/* Click Me Button wrapped in Link */}
      <Link href="/fnomarket">
        <button className="mt-3 bg-orange-600 hover:bg-orange-900 text-white py-1 px-4 rounded-full transition duration-300 ease-in-out">
          Click me
        </button>
      </Link>
    </div>
  );
}
