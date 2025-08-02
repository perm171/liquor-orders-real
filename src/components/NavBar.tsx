"use client";

import Link from "next/link";
import { Search, User, ShoppingCart } from "lucide-react";

export default function NavBar() {
  const links = [
    { name: "Home", href: "/" },
    { name: "Beer", href: "#beer" },
    { name: "Liquor", href: "#liquor" },
    { name: "Wine", href: "#wine" },
    { name: "Mixers & More", href: "#" },
    { name: "Tobacco", href: "#" },
    { name: "Recipes", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  return (
    <div className="border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div
            className="text-3xl font-extrabold tracking-wide"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#b91c1c", // deep red
            }}
          >
            1666 LIQUORS
          </div>

          {/* Search and icons */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Drinks"
                className="w-48 md:w-64 bg-white text-gray-800 placeholder-gray-500 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-red-600 transition"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
            </div>
            <User className="cursor-pointer text-gray-300 hover:text-white w-5 h-5 transition" />
            <ShoppingCart className="cursor-pointer text-gray-300 hover:text-white w-5 h-5 transition" />
          </div>
        </div>
      </div>

      {/* Category links */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 py-3 text-sm font-semibold text-gray-700">
          {links.map((link) => (
            <Link key={link.name} href={link.href} scroll={true}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
