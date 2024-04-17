'use client';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import React from 'react';
import { useState } from 'react';
const userId = <CookieComponent cookieName={'accessToken'} />;
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

  return (
    <div className="flex">
      {/* Left Section (CookieComponent and SideNav) */}
      <div>
        <CookieComponent
          cookieName={'accessToken'}
          onUserIdChange={handleUserIdChange}
        />
        <SideNav openCallback={handleSideNavOpen} />
      </div>
      <div className="flex flex-col">
        {/* Right Section (Card Components) */}
        <div className="flex-grow flex flex-row">
          {/* Example of multiple cards */}
          <Card className="bg-gray-300 m-5 p-3 ">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>

          <Card className="bg-gray-300 m-5 p-3 ">
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>Another Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>More Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Another Card Footer</p>
            </CardFooter>
          </Card>
        </div>
        <div className="flex-grow flex flex-row">
          {/* Example of multiple cards */}
          <Card className="bg-gray-300 m-5 p-3 ">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>

          <Card className="bg-gray-300 m-5 p-3 ">
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>Another Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>More Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Another Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
