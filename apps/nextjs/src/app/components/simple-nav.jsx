import * as React from 'react';
import Link from 'next/link';
import { GiKnifeFork } from 'react-icons/gi';

export function SimpleNav() {
  return (
    <div className="flex flex-1 flex-row justify-center">
      <nav className="bg-blue-600 p-4 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="./" className="text-white text-xl font-bold">
              <GiKnifeFork size="28" />
              Slicer
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
