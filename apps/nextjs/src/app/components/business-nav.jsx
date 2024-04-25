'use client';
import * as React from 'react';
import Link from 'next/link';
import { GiKnifeFork } from 'react-icons/gi';
import { FaSignOutAlt } from 'react-icons/fa';

export function BusinessNav() {
  return (
    <div className="flex flex-1 flex-row justify-center">
      <nav className="bg-blue-600 p-4 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold flex-shrink-0">
            <GiKnifeFork size="28" />
            Slicer
          </div>
          <div className="text-white">
            <button onClick={handleLogout}>
              <FaSignOutAlt size="40" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

const handleLogout = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/auth/user/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      // Clear the cookie upon successful logout
      document.cookie =
        'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Change yourCookieName to the name of your cookie
      // Redirect to login page or any other appropriate page after successful logout
      window.location.href = '/sign-in'; // Adjust the path to your login page
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error occurred while logging out:', error);
  }
};
