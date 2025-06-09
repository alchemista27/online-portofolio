// src/components/Hero.jsx
import React from 'react';
import profileImage from '../assets/profile.jpg';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4 pt-20">
      <img
        src={profileImage}
        alt="Septian Jauhariansyah"
        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md mb-4"
      />
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Septian Jauhariansyah
      </h2>
      <p className="text-gray-600 max-w-xl mb-6">
        Data Analyst • Machine Learning Developer • Full-Stack Learner <br />
        Membantu kamu mengolah, menganalisis, dan memahami data secara profesional.
      </p>
      <a
        href="#portfolio"
        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
      >
        Lihat Portofolio
      </a>
    </section>
  );
};

export default Hero;
