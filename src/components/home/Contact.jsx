import React from "react";
import { Mail } from "react-feather"; // Import the Mail icon from react-feather
import contactImage from '../../components/assets/contact_bg.jpg';

function ContactSection() {
  return (
    <div
      className="relative bg-cover bg-center mb-4"
      style={{ backgroundImage: `url(${contactImage})`, minHeight: "300px" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative container mx-auto px-8 py-16">
        <h2 className="text-3xl flex justify-center font-bold text-white mb-8">Contact Us</h2>
        <div className="max-w-md mx-auto">
          <form className="flex flex-col sm:flex-row items-center">
            <input
              type="email"
              placeholder="Your Email"
              className="bg-white w-full text-gray-800 border border-gray-400 rounded py-2 px-4 mb-4 sm:mb-0 sm:mr-4 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
              <Mail size={24} /> {/* Use the Mail icon with a size of 20 */}
            </button>
          </form>
          <p className="text-white text-center mt-4 italic">
            Please feel free to contact us with any questions, concerns, or feedback. We'll get back to you as soon as possible.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;
