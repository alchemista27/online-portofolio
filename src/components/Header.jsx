// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Septian Jauhariansyah
        </h1>
        <nav className="space-x-6">
          <a href="#home" className="text-gray-600 hover:text-blue-500">Home</a>
          <a href="#portfolio" className="text-gray-600 hover:text-blue-500">Portfolio</a>
          <a href="#contact" className="text-gray-600 hover:text-blue-500">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
