import React, { useState } from 'react';
import { HiArchive, HiCreditCard } from 'react-icons/hi';
import { FaHome, FaTruck, FaSignOutAlt } from 'react-icons/fa'; // Added FaSignOutAlt icon
import { TbReportSearch } from 'react-icons/tb';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SideNav() {
  return (
    <div className="fixed top-0 left-0 h-screen w-auto m-0 flex flex-col bg-blue-600 text-white">
      <Link href="/dashboard">
        <SideBarIcon icon={<FaHome size="66" />} text="Dashboard" />
      </Link>
      <Link href="/dashboard/inventory">
        <SideBarIcon icon={<HiArchive size="66" />} text="Inventory" />
      </Link>
      <Link href="/dashboard/orders">
        <SideBarIcon icon={<HiCreditCard size="66" />} text="Orders" />
      </Link>
      <Link href="/dashboard/suppliers">
        <SideBarIcon icon={<FaTruck size="62" />} text="Suppliers" />
      </Link>
      <Link href="/dashboard/reports">
        <SideBarIcon icon={<TbReportSearch size="62" />} text="Reports" />
      </Link>
      <div className="mt-auto">
        <button onClick={handleLogout}>
          <SideBarIcon icon={<FaSignOutAlt size="60" />} text="Logout" />
        </button>
      </div>
    </div>
  );
}
const handleLogout = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

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

const SideBarIcon = ({ icon, text }) => (
  <div
    className="group relative flex items-center justify-center h-20 w-20 m-3  
            text-white hover:bg-white hover:text-blue-600 hover:rounded-xl "
  >
    {icon}
    <span className="group-hover:scale-100 absolute w-auto p-3 m-5 min-w-max left-20 rounded-md shadow-md text-white bg-blue-600 text-s font-bold transition-all duration-100 scale-0 origin-left">
      {text}
    </span>
  </div>
);
