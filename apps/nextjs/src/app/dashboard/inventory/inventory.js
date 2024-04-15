'use client';
import { SideNav } from '@repo/ui/side-nav';
import CookieComponent from '../components/CookieComponent';
import React from 'react';
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function Inventory() {
  const [userId, setUserId] = useState('');
  const [businessId, setbusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [popupLocation, setPopupLocation] = useState(null);
  const [popupItemLog, setPopupItemLog] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);

  const Location = [{ locations: ['On-site'] }, { locations: ['Garage'] }];
  // Function to handle userId change
  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const handleLocationPopup = location => {
    // Handle logic to show popup with information about the location
    // For now, let's just set the location for simplicity
    setPopupLocation(location);
  };

  const handleItemLogPopup = itemName => {
    // Add logic to handle the Item Log popup
    setSelectedItemName(itemName);
    setPopupItemLog(true);
  };

  const handleClosePopup = () => {
    setPopupLocation(null);
    setPopupItemLog(null);
  };

  const getBusinessId = async () => {
    console.log(userId);
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
      const { businessIdList } = responseData;
      return { businessIdList };
    } else {
      //nothing returned (wont happen with how api is setup but just in case)
      console.log('error');
      const errorData = await response.json();
      return null;
    }
  };

  useEffect(() => {
    const readAll = async () => {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/item-list/read-all/?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        const { fieldValues } = responseData;
        setItemList(fieldValues);
      } else {
        console.log('error');
      }
    };
    readAll();
  }, [businessId]);

  useEffect(() => {
    if (userId != '') {
      setLoading(false);
      getBusinessId().then(data => {
        console.log('Business: ', data.businessIdList[0]);
        setbusinessId(data.businessIdList[0]);
      });
    }
  }, [userId]);

  if (loading) {
    return (
      <CookieComponent
        cookieName={'accessToken'}
        onUserIdChange={handleUserIdChange}
      />
    );
  }

  if (businessId != '') {
    return (
      <div className="w-full h-screen grid grid-cols-[min-content_auto] grid-rows-[5fr_1fr]">
        <div className="bg-green-500">
          <SideNav />
        </div>
        <div className="justify-center flex-col items-center">
          <ul>
            {itemList.map((item, index) => (
              <li key={index}>
                <div className="relative">
                  <div className="flex items-center ml-2">
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      type="button"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {openIndex === index ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      type="button"
                      className="inline-flex items-center justify-center ml-2 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      id="dropdown-menu-button"
                    >
                      {item.itemName}
                    </button>
                    Total Count: Estimated:
                  </div>
                  {openIndex === index && (
                    <div className="ml-12">
                      {' '}
                      {/* Adjust the value to fit your design */}
                      <div className="flex items-center ml-2">
                        <h6 className="mr-auto">Location:</h6>
                        <button
                          onClick={() => handleItemLogPopup(item.itemName)}
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                          style={{
                            marginRight: '100px',
                            verticalAlign: 'middle'
                          }}
                        >
                          Item Log
                        </button>
                      </div>
                      <ul>
                        {Location.map((location, i) => (
                          <li
                            key={i}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            {location.locations}
                            <button
                              onClick={() =>
                                handleLocationPopup(location.locations)
                              }
                              type="button"
                              className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                              {/* Your button icon (e.g., an 'i' for information) */}
                              i
                            </button>
                            Total Count: Last Updated: Estimated:
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>Player</div>
        {popupLocation && (
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-white p-4 rounded-md relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2"
                onClick={handleClosePopup}
              >
                X
              </button>
              <p>Information about {popupLocation}</p>
              <p>Address: </p>
              <p>Notes(MetaData): </p>
              {/* Add more information about the location as needed */}
            </div>
          </div>
        )}

        {popupItemLog && (
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-white p-4 rounded-md relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2"
                onClick={handleClosePopup}
              >
                X
              </button>
              <p>{selectedItemName} Log</p>
              <p>Location: </p>
              <p>Date + Time: </p>
              <p>Description: </p>
              <p>Initial Portion: </p>
              <p>Final Portion: </p>
              {/* Add item log content here */}
            </div>
          </div>
        )}
      </div>
    );
  }
}
