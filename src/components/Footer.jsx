import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Septian Jauhariansyah. All rights reserved.
        </p>
        <p className="text-sm mt-2">
          Dibuat dengan ❤️ oleh <a href="https://github.com/alchemista27" className="underline hover:text-gray-300">alchemista27</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
