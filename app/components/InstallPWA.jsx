"use client";

import { useState, useEffect } from "react";
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import Image from 'next/image'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);

    // Hide the install button if the app was installed
    if (outcome === "accepted") {
      setShowInstallButton(false);
    }
  };

  if (!showInstallButton) return null;

  return (
    <div className="relative">
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-1 rounded-full border-6 border-transparent bg-gradient-to-r from-blue-800 via-purple-500 to-pink-900 animate-spin-slow opacity-100"></div>
        <div className="absolute inset-1 rounded-full bg-white"></div>
      </div>

      {/* Main button */}
      <motion.button
        onClick={handleInstallClick}
        className="relative flex items-center gap-3 rounded-full bg-[#FEFCFB] px-4 py-1 text-gray-800 shadow-xl transition-all duration-300 border-gray-100 z-10"
      >
        {/* Install Icon - Static */}
        <Download className="h-6 w-6 text-blue-600" />

        {/* Daksh Text */}
        <motion.span
          className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Daksh
        </motion.span>

        {/* Logo Image */}
        <motion.div
          className="relative rounded-full py-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            type: 'spring',
            stiffness: 500,
            damping: 15,
          }}
          whileHover={{
            scale: 1.1,
          }}
        >
          <Image
            src="https://res.cloudinary.com/doxmvuss9/image/upload/v1750571602/link-generator/jh6vkpbei9latdbmnbdz.png"
            alt="Daksh Logo"
            width={30}
            height={30}
            className="object-cover rounded-full"
          />
        </motion.div>
      </motion.button>
    </div>
  )
}