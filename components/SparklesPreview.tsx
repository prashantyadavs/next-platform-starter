// components/SparklesPreview.tsx
"use client";
import React, { useState } from "react"; // Import useState
import { TypewriterEffectSmooth } from "./ui/typewriter-effect"; // Import TypewriterEffectSmooth
import { SignupFormDemo } from "./SignupForm"; // Import the SignupFormDemo
import Modal from "./Modal"; // Import the Modal

export function TypewriterEffectSmoothDemo() {
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  const words = [
    {
      text: "Trade",
    },
    {
      text: "smarter",
    },
    {
      text: "with",
    },
    {
      text: "Tradify.",
      className: "text-blue-500 dark:text-orange-500",
    },
  ];

  return (
    <div className="dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative h-screen w-full flex items-center justify-center">
      {/* Background */}
      
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
          The road to Trading starts here
        </p>
        <TypewriterEffectSmooth words={words} />

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          <button
            className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
            onClick={() => setShowForm(true)} // Open the form in modal when clicked
          >
            Login
          </button>
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
            Signup
          </button>
        </div>

        {/* Modal for Signup Form */}
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <SignupFormDemo />
        </Modal>
      </div>
    
    </div>
  );
}
