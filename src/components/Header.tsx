import React from "react";

interface HeaderProps {
  onSignout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignout }) => (
  <div className="p-5 px-5 md:px-10">
    <div className="flex justify-between items-center">
      <h1 className="text-lg md:text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
        Task Manager
      </h1>
      <button
        onClick={onSignout}
        className="bg-red-100 text-xs md:text-base text-red-500 font-semibold md:py-2 md:px-4 py-1 px-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2"
        aria-label="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </button>
    </div>
  </div>
);

export default Header;