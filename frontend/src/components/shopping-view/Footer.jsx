import React from "react";
import { Link } from "react-router-dom";

import { FiShoppingBag } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  const navLinks = [
    { name: "Home", path: "/shop" },
    { name: "Products", path: "/shop/products" },
    { name: "Men", path: "/shop/men" },
    { name: "Women", path: "/shop/women" },
    { name: "Kids", path: "/shop/kids" },
    { name: "Accessories", path: "/shop/accessories" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">

      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* LOGO */}
        <div>

          <div className="flex items-center gap-2 mb-4">
            <FiShoppingBag
              size={24}
              className="text-slate-700"
            />

            <h1 className="text-2xl font-bold text-slate-700">
              Ecommerce
            </h1>
          </div>

          <p className="text-sm text-gray-500 leading-6">
            Discover trending fashion, premium products,
            and best deals every day.
          </p>

        </div>

        {/* LINKS */}
        <div>

          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Quick Links
          </h2>

          <ul className="flex flex-col gap-3 text-sm text-gray-500">

            {navLinks.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="hover:text-black transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}

          </ul>

        </div>

        {/* SUPPORT */}
        <div>

          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Support
          </h2>

          <ul className="flex flex-col gap-3 text-sm text-gray-500">

            <li>
              <Link to="/shop/contact" className="hover:text-black">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/shop/faq" className="hover:text-black">
                FAQ
              </Link>
            </li>

            <li>
              <Link to="/shop/shipping" className="hover:text-black">
                Shipping
              </Link>
            </li>

            <li>
              <Link to="/shop/privacy" className="hover:text-black">
                Privacy Policy
              </Link>
            </li>

          </ul>

        </div>

        {/* NEWSLETTER */}
        <div>

          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Newsletter
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Subscribe for latest products and special offers.
          </p>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

            <input
              type="email"
              placeholder="Enter email"
              className="flex-1 px-3 py-3 text-sm outline-none"
            />

            <button className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 text-sm font-medium cursor-pointer">
              Subscribe
            </button>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-500">
            © 2026 Ecommerce. All rights reserved.
          </p>

          {/* SOCIAL */}
          <div className="flex items-center gap-4 text-slate-700">

            <button className="hover:text-black cursor-pointer transition">
              <FaFacebookF size={18} />
            </button>

            <button className="hover:text-black cursor-pointer transition">
              <FaInstagram size={18} />
            </button>

            <button className="hover:text-black cursor-pointer transition">
              <FaTwitter size={18} />
            </button>

            <button className="hover:text-black cursor-pointer transition">
              <FaYoutube size={18} />
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;