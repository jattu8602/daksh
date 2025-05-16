'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <img
          src="/icons/icon-192x192.png"
          alt="Daksh Logo"
          className="w-24 h-24 animate-bounce rounded-sm"
        />
        <h1 className="text-2xl font-bold text-gray-800">Daksh</h1>
        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-blue-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );
}