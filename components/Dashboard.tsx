// components/Dashboard.tsx
import React from "react";
import { TypewriterEffectSmoothDemo } from "./SparklesPreview"; // Update the import

const Dashboard = () => {
  return (
    <div className="flex flex-1 w-full h-screen"> {/* Ensure this takes full height */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 p-0">
        <TypewriterEffectSmoothDemo /> {/* Use the new component */}
      </div>
    </div>
  );
};

export default Dashboard;
