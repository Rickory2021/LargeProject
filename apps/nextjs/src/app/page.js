import Image from "next/image";
import Link from "next/link";


import { Navbar } from "./components/nav";


export default function HomePage() {
  return (
    <div classname="flex flex-1 flex-col justify-center">
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0">
            <a href="#" className="text-white text-xl font-bold">
              Slicer
            </a>
          </div>
          <div className="hidden md:block .justify-center ">
            <Link href="/sign-in">
              <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
                SignIn
              </button>
            </Link>

            <Link href="/sign-up">
              <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
