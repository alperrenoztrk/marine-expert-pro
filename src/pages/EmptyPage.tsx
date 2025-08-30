import React from "react";
import WeatherWidget from "@/components/WeatherWidget";

const EmptyPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <WeatherWidget />
      </div>
    </div>
  );
};

export default EmptyPage;