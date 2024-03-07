"use client";
import React from "react";
import Link from "next/link";

function Nav() {
  return (
    <div classname="flex flex-1 flex-col justify-center">
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0">
            <a href="./" className="text-white text-xl font-bold">
              Slicer
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
