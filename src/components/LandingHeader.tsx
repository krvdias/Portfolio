import React from "react";



const LandingHeader: React.FC = () => {
  return (
    <div className="relative p-10 pl-15 pr-15"> {/* Add relative positioning here */}
      <nav className="w-full py-5 sm:px-8 lg:px-30 bg-white shadow-md max-h-[80px] rounded-4xl">
        {/* Left side: WINSI LOGO */}
        <div className="flex items-center justify-center h-full pl-2 sm:pl-4">
          <h1 className="text-4xl font-bold">Portfolio</h1>
        </div>
      </nav>
    </div>
  );
};

export default LandingHeader;