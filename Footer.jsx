import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const socialIcons = [FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn];

  return (
    <footer className="relative w-full bg-gradient-to-t from-gray-900 via-gray-950 to-black text-gray-300 mt-20 overflow-hidden">
      {/* Top wave */}
      <div className="absolute w-full overflow-hidden leading-none transform -translate-y-[99%]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#111827"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 animate-gradient-x">
              FoodChef
            </h2>
            <p className="text-gray-400 leading-relaxed">
              LocalChefBazaar Industries Ltd.<br />
              Providing homemade happiness and connecting communities through food since 2025.
            </p>
            <div className="pt-2">
              <span className="block font-bold text-orange-500">Working Hours:</span>
              <span>Mon - Fri (9:00 AM - 10:00 PM)</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-gradient-to-r border-orange-400 w-fit pb-1">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Home", "Available Foods", "Add Food", "Login"].map((item, index) => (
                <li key={index}>
                  <Link
                    to="/"
                    className="group flex items-center transition-all duration-300 hover:text-orange-400"
                  >
                    <motion.span whileHover={{ x: 6 }} className="inline-block">
                      <span className="text-orange-500 mr-2">›</span> {item}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-orange-500 w-fit pb-1">
              Contact Us
            </h3>
            <div className="space-y-4">
              <p className="flex items-start">
                <span className="text-orange-500 font-bold mr-2">Address:</span>
                123 Culinary Street, Foodie City, FC 45678
              </p>
              <p className="flex items-center group cursor-pointer transition-all hover:text-orange-400">
                <span className="text-orange-500 font-bold mr-2">Email:</span>
                support@foodchef.com
              </p>
              <p className="flex items-center group cursor-pointer transition-all hover:text-orange-400">
                <span className="text-orange-500 font-bold mr-2">Phone:</span>
                +880 123 456 789
              </p>
            </div>
          </div>

          {/* Column 4: Newsletter & Socials */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b-2 border-orange-500 w-fit pb-1">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4 text-sm">Subscribe to get the latest food updates.</p>
            <div className="relative mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700 transition-all duration-300"
              />
              <motion.button 
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px #f97316" }}
                className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-2 rounded-md transition-all duration-300"
              >
                <FaPaperPlane />
              </motion.button>
            </div>

            <div className="flex space-x-4">
              {socialIcons.map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -5, scale: 1.2, color: "#f97316" }}
                  className="bg-gray-800 p-3 rounded-full text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 shadow-lg transition-all duration-300"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FoodChef. All rights reserved.</p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
