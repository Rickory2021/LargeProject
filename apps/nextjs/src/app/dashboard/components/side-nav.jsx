import React, { useState } from 'react';
import { HiArchive, HiCreditCard } from 'react-icons/hi';
import { FaHome, FaTruck, FaSignOutAlt } from 'react-icons/fa'; // Added FaSignOutAlt icon
import { TbReportSearch } from 'react-icons/tb';
import Link from 'next/link';
import { GiKnifeFork } from 'react-icons/gi';
import {BsArrowLeftShort, BsChevronDown, BsReverseLayoutTextSidebarReverse} from "react-icons/bs";
import {useSidebar} from './SidebarContext';

const SideNav = () => {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const Menus = [

    
    {title: "Dashboard", spacing: true, icon: <FaHome size = "60"/> },
    
    
    {
      title: "Inventory",
      icon: <BsReverseLayoutTextSidebarReverse size = "60"/>,
      submenu: true,
      submenuItems: [

      {title: "Products", icon: <TbReportSearch />  },
      {title: "Materials", icon: <TbReportSearch />},

      ],
    },


    { title: "Orders", icon: <HiCreditCard size = "60"/>},
    { title: "Suppliers", icon: <FaTruck size = "60"/>},
    { title: "Reports", icon: <TbReportSearch size = "60"/>},
  
  
  ];



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

  return (
    <div className={`fixed top-0 left-0 h-screen m-0 flex flex-col 
      bg-blue-600 text-white ${open ? "w-32" : "w-72"} duration-300 relative`}>
        
      <BsArrowLeftShort 
        className={`bg-black text-white text-3xl rounded-full
        absolute -right-3 top-9 border border-blue cursor-pointer 
        ${open && "rotate-180"}`} 
        onClick={() => setOpen(!open)} 
        open={open} 
      />

      <div classname = "inline-flex">
      <Link href = "/">
      <SideBarIcon icon={<GiKnifeFork size="60" />} text="Slicer" open={open} />
      </Link>
      </div>

      <ul className = "pt-1">
        {Menus.map((menu,index) =>(
          <>
            <li 
            key = {index} 
            className = {`text-white-300  text-sm flex items-center gap-x-4 cursor-pointer p-5 hover:bg-black rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
              <span className = "text-2xl block float-left">
              {menu.title === "Dashboard" ? (
              <Link href="/dashboard">
                {menu.icon ? menu.icon : <FaHome />}
              </Link>
              ) : (
                <Link href={`/dashboard/${menu.title.toLowerCase()}`}>
                {menu.icon ? menu.icon : <FaHome />}
              </Link>
              )}
              </span>
              
              <span className={`text-white font-medium font-cursive text-lg m-2 duration-300 ${open && "hidden"}`}>
                {menu.title === "Dashboard" ? (
                  <Link href="/dashboard">
                    {menu.title}
                  </Link>
                ) : (
                  <Link href={`/dashboard/${menu.title.toLowerCase()}`}>
                    {menu.title}
                  </Link>
                )}
              </span>
          
            {menu.submenu && !open && ( 
              <BsChevronDown className = {`absolute right-4 duration-300 ${submenuOpen && "rotate-180"}`} onClick= {() => 
                setSubmenuOpen(!submenuOpen)} />
              

            )}
            </li>

            {menu.submenu && submenuOpen && !open &&(
              <ul>
                {menu.submenuItems.map((submenuItem, index) => (
                
                <li key = {index} className = "text-white-300 text-sm gap-x-4 cursor-pointer p-4 pl-10 hover:bg-black rounded-md">
                 <Link href={`/dashboard/inventory/${submenuItem.title.toLowerCase()}`} >
                   {submenuItem.title}
                  </Link>
                </li>
            ))}
            </ul>   
        )}
      </>
    ))}
  </ul>

      
      
      <div className="mt-auto">
        <button onClick={handleLogout}>
          <SideBarIcon icon={<FaSignOutAlt size="60" />} text="Logout" open={open} />
        </button>
      </div>
    </div>
  );
}

const SideBarIcon = ({ icon, text, open }) => (
  <div className = "inline-flex">


    
  <div className={`group relative flex items-center justify-center h-20 w-20 m-3  
    text-white hover:bg-black hover:text-blue-600 hover:rounded-xl duration-500 
    ${!open && "rotate-[360deg]"} `}>
    {icon}
    
    </div>
    <h1 className = {`text-white font-medium font-cursive text-2xl m-3 pt-6 duration-300 
  ${open && "scale-0"}`}>
    {text}
    </h1>
   
  
  </div>
);

export default SideNav;