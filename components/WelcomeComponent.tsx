"use client";

import React from "react";
import { EvervaultCardFNODemo } from "./evervault-card-demo"; // Import the EvervaultCardDemo component
import { SparklesPreview } from "./LampDemo"; // Import the LampDemo component
import { EvervaultCardjournal } from "./evervault-card-jornal"; // Import the EvervaultCardDemo component

export function WelcomeComponent() {
  return (
    <div className="min-h-screen dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex flex-col justify-center items-center">
      {/* Set flex direction to column and full page height */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <SparklesPreview /> {/* Added LampDemo at the top */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 mt-[-50px] mb-10 z-10">
        {/* Adjusted margin-top for overlay and set z-index */}
        
        {/* First EvervaultCardDemo */}
        <EvervaultCardFNODemo />
        
        {/* Second EvervaultCardDemo */}
        <EvervaultCardjournal />
      </div>
    </div>
  );
}
