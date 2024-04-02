'use client'
import { useState } from 'react';
import { HiArchive, HiCreditCard } from 'react-icons/hi';
import { FaHome, FaTruck, FaSignOutAlt } from 'react-icons/fa'; // Added FaSignOutAlt icon
import { TbReportSearch } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

function SideNav() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleDasboard = () => {
    router.push('/dashboard');
  }

  const handleInventory = () =>{
    router.push('/dashboard/inventory');
  }

  const handleOrders = () =>{
    router.push('/dashboard/orders');
  }

  const handleSuppliers = () =>{

    router.push('/dashboard/suppliers');
  }

  const handleReport = () => {
      router.push('/dashboard/reports');
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch('http://localhost:3001/api/auth/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        // Clear the cookie upon successful logout
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Change yourCookieName to the name of your cookie
        // Redirect to login page or any other appropriate page after successful logout
        router.push('/sign-in'); // Adjust the path to your login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error occurred while logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="inset-y-0 left-0 h-screen w-150px m-0 flex flex-col bg-blue-600 text-white">
        <button onClick={handleDasboard} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<FaHome size="66" />} text="Dashboard" />
        </button>

        <button onClick={handleInventory} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<HiArchive size="66" />} text="Inventory" />
        </button>

        <button onClick={handleOrders} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<HiCreditCard size="66" />} text="Orders" />
        </button>

        <button onClick = {handleSuppliers} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<FaTruck size="62" />} text="Suppliers" />
        </button>

        <button onClick = {handleReport} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
          <SideBarIcon icon={<TbReportSearch size="62" />} text="Reports" />
        </button>

      {/* Logout button using Link */}
      <button onClick={handleLogout} className="absolute bottom-0 right-0 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
        <SideBarIcon icon={<FaSignOutAlt size="62" />} text="Logout" />
      </button>
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

export { SideNav, SideBarIcon };