// components/Welcome.tsx
import React from "react";
import { WelcomeComponent } from "@/components/WelcomeComponent"; // Import your existing card component

const WelcomePage = () => {
  return (
    <div className="flex flex-1 w-full h-screen"> {/* Ensure this takes full height */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 p-0">
        <WelcomeComponent /> {/* Use the new component */}
      
      </div>
    </div>
  );
};

export default WelcomePage;
