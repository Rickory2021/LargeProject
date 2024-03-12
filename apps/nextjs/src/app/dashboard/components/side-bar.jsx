import Link from 'next/link'; // Import Link from Next.js

import { HiArchive, HiCreditCard } from "react-icons/hi";
import { FaHome, FaTruck } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";

export function SideNav() {
  return (
    <div className="fixed top-0 left-0 h-screen w-46 m-0 flex flex-col bg-blue-600 text-white">
      <SideBarIcon icon={<FaHome size="66" />} text="Dashboard" href="/dashboard" />
      <SideBarIcon icon={<HiArchive size="66" />} text="Inventory" href="/inventory" />
      <SideBarIcon icon={<HiCreditCard size="66" />} text="Orders" href="/orders" />
      <SideBarIcon icon={<FaTruck size="62" />} text="Suppliers" href="/suppliers"/>
      <SideBarIcon icon={<TbReportSearch size="62" />} text="Reports" href="/reports" />
    </div>
  );
}

const SideBarIcon = ({ icon, text, href }) => (
  <Link href={href}>
    <a className="group relative flex items-center justify-center h-21 w-21 mt-2 mb-2 text-white hover:bg-white hover:text-blue-600 hover:rounded-xl">
      <div>
        {icon}
        <span className="group-hover:scale-100 absolute w-auto p-3 m-3 min-w-max left-20 rounded-md shadow-md text-white bg-blue-600 text-s font-bold transition-all duration-100 scale-0 origin-left">
          {text}
        </span>
      </div>
    </a>
  </Link>
);