// pages/profile.js
import React from "react";
import Image from "next/image";

const Profile = () => {
  return (
    <div className="flex flex-1 w-full h-screen">
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 p-0">

    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-neutral-800">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
        Profile Page
      </h1>
      <Image
        src="https://tradifybyith.in/logo-.png" // Placeholder for profile image
        alt="Profile Picture"
        width={100}
        height={100}
        className="rounded-full mb-4"
      />
      <div className="text-neutral-700 dark:text-neutral-300">
        <p className="text-lg">Name: Manu Arora</p>
        <p className="text-lg">Email: manu.arora@example.com</p>
      </div>
      <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Edit Profile
      </button>
    </div>
    </div>
    </div>
  );
};

export default Profile;
