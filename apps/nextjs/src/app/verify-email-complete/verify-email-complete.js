'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { RiMailSendFill } from 'react-icons/ri';

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-wgite-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <FaCheckCircle className="text-6xl text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
        <p className="text-lg text-gray-800 mb-6">
          Your email has been successfully verified. You can now close this tab.
        </p>
        <div className="justify-center">
          <Link href="/sign-in" className="px-5">
            <button className="text-white font-bold bg-blue-700 px-3 py-2 rounded-md">
              Go to Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
