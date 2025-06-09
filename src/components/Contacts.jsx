import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Hubungi Saya</h2>
        
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* Netlify hidden input */}
          <input type="hidden" name="form-name" value="contact" />

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nama
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nama Anda"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="email@domain.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Pesan
            </label>
            <textarea
              name="message"
              id="message"
              required
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Tulis pesan Anda di sini..."
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Kirim Pesan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
