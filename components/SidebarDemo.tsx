/* eslint-disable */

"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import Profile from "./Profile"; // Import the Profile component
import { usePathname } from "next/navigation"; // Import usePathname hook
import Fnomodal from "./FnoModal";
import WelcomePage from "@/app/dashboard/page";
export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard", // Set the correct path for Dashboard
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Profile",
    //   href: "/profile", // Update this to point to the profile page
    //   icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    // },
    // {
    //   label: "Settings",
    //   href: "/settings", // Set the correct path for Settings
    //   icon: (
    //     <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    // {
    //   label: "Logout",
    //   href: "/logout", // Set the correct path for Logout
    //   icon: (
    //     <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
  ];

  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  return (
    <div className={cn("flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-4">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-6 flex flex-col gap-1">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex justify-center mb-2">
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://tradifybyith.in/logo-.png"
                    className="h-8 w-8 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      
   
    </div>
  );
}

const Logo = () => {
  return (
    <Link href="#" className="flex items-center space-x-2 text-sm text-black dark:text-white py-2">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-md" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre">
      </motion.span>
    </Link>
  );
};
