import Link from 'next/link'; // Import Link from Next.js

import { HiArchive, HiCreditCard } from "react-icons/hi";
import { FaHome, FaTruck } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";

export function SideNav() {
  return (
    <div className="fixed top-0 left-0 h-screen w-46 m-0 flex flex-col bg-blue-600 text-white">
      <Link href="/dashboard">
        <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<FaHome size="66" />} text="Dashboard" />
        </button>
      </Link>   
      
      <Link href="/inventory">
        <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<HiArchive size="66" />} text="Inventory" />
        </button>
      </Link>   

      <Link href="/orders">
        <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<HiCreditCard size="66" />} text="Orders" />
        </button>
      </Link> 

      <Link href="/suppliers">
        <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<FaTruck size="62" />} text="Suppliers" />
        </button>
      </Link>   

       <Link href="/reports">
        <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<TbReportSearch size="62" />} text="Reports" />
        </button>
      </Link>   

    </div>
  );
}

const SideBarIcon = ({ icon, text }) => (
  <div className="group relative flex items-center justify-center h-21 w-21 mt-2 mb-2">
    {icon}
    <span className="group-hover:scale-100 absolute w-auto p-3 m-3 min-w-max left-20 rounded-md shadow-md text-white bg-blue-600 text-s font-bold transition-all duration-100 scale-0 origin-left">
      {text}
    </span>
  </div>
);