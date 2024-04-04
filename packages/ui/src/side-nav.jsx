'use client';
import React, { useState } from 'react';
import { HiArchive, HiCreditCard } from 'react-icons/hi';
import { FaHome, FaTruck } from 'react-icons/fa'; // Added FaSignOutAlt icon
import { TbReportSearch } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

export function SideNav() {
  return (
    <div className="fixed top-0 left-0 h-screen w-46 m-0 flex flex-col bg-blue-600 text-white">
      <SideBarIcon icon={<FaHome size="66" />} text="Dashboard" />
      <SideBarIcon icon={<HiArchive size="66" />} text="Inventory" />
      <SideBarIcon icon={<HiCreditCard size="66" />} text="Orders" />
      <SideBarIcon icon={<FaTruck size="62" />} text="Suppliers" />
      <SideBarIcon icon={<TbReportSearch size="62" />} text="Reports" />
    </div>
  );
}

const SideBarIcon = ({ icon, text }) => (
  <div
    className="group relative flex items-center justify-center h-20 w-20 mt-2 mb-2 
            text-white hover:bg-white hover:text-blue-600 hover:rounded-xl "
  >
    {icon}
    <span className="group-hover:scale-100 absolute w-auto p-3 m-3 min-w-max left-20 rounded-md shadow-md text-white bg-blue-600 text-s font-bold transition-all duration-100 scale-0 origin-left">
      {text}
    </span>
  </div>
);
