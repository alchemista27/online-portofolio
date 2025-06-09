import React from "react";
import favicon from "../assets/favicon.png"; // pastikan path ini sesuai lokasi file favicon Anda

const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      <div className="flex items-center space-x-2">
        <img src={favicon} alt="Logo SJ" className="w-10 h-10" />
        {/* Jika ingin menambahkan teks di samping logo, buka komentar di bawah */}
        {/* <span className="font-bold text-xl">Septian Jauhariansyah</span> */}
      </div>
      <nav className="space-x-6">
        <a href="#home" className="text-gray-700 hover:text-gray-900">Home</a>
        <a href="#portfolio" className="text-gray-700 hover:text-gray-900">Portfolio</a>
        <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
