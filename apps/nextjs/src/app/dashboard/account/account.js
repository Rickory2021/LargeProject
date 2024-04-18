'use client';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export function Account() {
  const [userId, setUserId] = useState(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [businessId, setBusinessId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSideNavOpen = openState => {
    setIsSideNavOpen(openState);
    console.log(`openState:${openState}`);
    // Adjust the main page layout based on the open state
    // For example, you can set the left margin of the main page here
  };

  // Function to handle userId change
  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const getBusinessId = async () => {
    const response = await fetch(
      'http://localhost:3001/api/auth/user/user-info?id=' + userId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      console.log(``);
      const { businessIdList } = responseData;
      return { businessIdList };
    } else {
      console.log('error');
      const errorData = await response.json();
      return null;
    }
  };

  const getBusinessName = async () => {
    const response = await fetch(
      'http://localhost:3001/api/auth/business/business-name?businessId=' +
        businessId,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      const { businessName } = responseData;
      return { businessName };
    } else {
      console.log('error');
      const errorData = await response.json();
      return null;
    }
  };

  useEffect(() => {
    if (userId !== null && userId !== '') {
      console.log('IM NOT NULL:' + userId);
      setLoading(false);
      getBusinessId().then(data => {
        console.log('Business: ', data.businessIdList[0]);
        setBusinessId(data.businessIdList[0]);
      });
      getUserInfo().then(data => {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (businessId !== null && businessId !== '') {
      getBusinessName().then(data => {
        console.log('WHAT' + data.businessName);
        setBusinessName(data.businessName);
      });
    }
  }, [businessId]);

  useEffect(() => {
    if (businessName) {
      console.log('Current businessName:', businessName);
    }
  }, [businessName]);

  const getUserInfo = async () => {
    const response = await fetch(
      'http://localhost:3001/api/auth/user/user-info?id=' + userId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      const { firstName, lastName, username, email } = responseData;
      return { firstName, lastName, username, email };
    } else {
      console.log('error');
      const errorData = await response.json();
      return null;
    }
  };

  if (loading) {
    return (
      <CookieComponent
        cookieName={'accessToken'}
        onUserIdChange={handleUserIdChange}
      />
    );
  }

  return (
    <div className="flex">
      <SideNav openCallback={handleSideNavOpen} />
      <div
        className={`flex justify-center items-center flex-col flex-1 ${isSideNavOpen ? 'ml-72' : 'ml-36'} lg:${isSideNavOpen ? 'ml-80' : 'ml-40'} xl:${isSideNavOpen ? 'ml-88' : 'ml-44'}`}
      >
        {loading ? (
          <CookieComponent
            cookieName={'accessToken'}
            onUserIdChange={handleUserIdChange}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-screen pb-16">
            <h2 className="text-2xl font-bold text-center mb-4 border-b border-gray-700">User Information</h2>
            <div className="bg-blue-400 shadow-lg rounded-lg p-8 text-center">
              <table className="table-fixed min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700 h-16 overflow-y-auto">
                    <td className="px-6 py-4 text-start text-lg font-medium text-gray-800 dark:text-neutral-200">
                      Name:
                    </td>
                    <td className="px-6 py-4 text-end text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {firstName} {lastName}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700 h-16 overflow-y-auto">
                    <td className="px-6 py-4 text-start text-lg font-medium text-gray-800 dark:text-neutral-200">
                      Email:
                    </td>
                    <td className="px-6 py-4 text-end text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {email}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700 h-16 overflow-y-auto">
                    <td className="px-6 py-4 text-start text-lg font-medium text-gray-800 dark:text-neutral-200">
                      Business Id:
                    </td>
                    <td className="px-6 py-4 text-end text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {businessId}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700 h-16 overflow-y-auto">
                    <td className="px-6 py-4 text-start text-lg font-medium text-gray-800 dark:text-neutral-200">
                      Business Name:
                    </td>
                    <td className="px-6 py-4 text-end text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {businessName}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
