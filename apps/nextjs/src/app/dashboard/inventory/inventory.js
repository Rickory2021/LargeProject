'use client';
import React, { useState, useEffect } from 'react';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import Location from '../components/location';
import LocationPopup from '../components/LocationPopup';
import ItemTotalCount from '../components/ItemTotalCount';
import LocationTotalCount from '../components/LocationTotalCount';
import ItemLog from '../components/ItemLog'; // Import ItemLog here
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function Inventory() {
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [locationMetaData, setLocationMetaData] = useState({});
  const [itemLog, setItemLog] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [popupLocation, setPopupLocation] = useState('');
  const [popupItemLog, setPopupItemLog] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [itemCountMap, setItemCountMap] = useState({});
  const [locationInventory, setLocationInventory] = useState({});

  // Function to handle userId change
  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const updateLocationList = newLocationList => {
    setLocationList(newLocationList);
  };

  const updataLocationMetaData = newLocationMetaData => {
    setLocationMetaData(newLocationMetaData);
  };

  const updateItemLog = newItemLog => {
    setItemLog(newItemLog);
  };

  const defaultLocationInventory = {
    portionNumber: 0,
    metaData: 'No Input Exists'
  };

  const updateLocationInventory = (
    locationName,
    itemName,
    newLocationInventory
  ) => {
    if (newLocationInventory == null) {
      setLocationInventory(prevState => ({
        ...prevState,
        [locationName]: {
          ...prevState[locationName],
          [itemName]: defaultLocationInventory
        }
      }));
      console.log(locationInventory);
    } else {
      setLocationInventory(prevState => ({
        ...prevState,
        [locationName]: {
          ...prevState[locationName],
          [itemName]: newLocationInventory
        }
      }));
      console.log(locationInventory);
    }
  };

  const updateItemCount = (itemName, newItemTotal) => {
    setItemCountMap(prevState => ({
      ...prevState,
      [itemName]: newItemTotal
    }));
  };

  const handleLocationPopup = location => {
    setPopupLocation(location);
  };

  const handleItemLogPopup = itemName => {
    setSelectedItemName(itemName);
    setPopupItemLog(true);
  };

  const handleClosePopup = () => {
    setPopupLocation(null);
    setPopupItemLog(false); // Set popupItemLog to false to close the popup
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
      const { businessIdList } = responseData;
      return { businessIdList };
    } else {
      console.log('error');
      const errorData = await response.json();
      return null;
    }
  };

  useEffect(() => {
    if (userId !== '') {
      setLoading(false);
      getBusinessId().then(data => {
        console.log('Business: ', data.businessIdList[0]);
        setBusinessId(data.businessIdList[0]);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (businessId !== '') readAll();
  }, [businessId]);

  const readAll = async () => {
    try {
      console.log(
        'http://localhost:3001/api/crud/business/item-list/read-all/?businessId=' +
          businessId
      );
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
      if (!response.ok) {
        throw new Error('Failed to fetch item names');
      }
      const data = await response.json();
      const fieldValues = data.output;

      setItemList(fieldValues);
    } catch (error) {
      console.error('Error fetching item names:', error);
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

  if (businessId !== '') {
    return (
      <div>
        <SideNav />
        <div className="flex justify-center items-center flex-col flex-1">
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
                    {!itemCountMap[item.itemName] && (
                      <div>
                        <ItemTotalCount
                          businessId={businessId}
                          itemName={item.itemName}
                          updateItemCount={updateItemCount}
                        />
                      </div>
                    )}

                    {/* Display the item count if available */}

                    <>
                      <p className="m-8">
                        Total Count: {itemCountMap[item.itemName]} Largest
                        Portion
                      </p>
                      <p className="m-8">Estimated:</p>
                    </>
                  </div>
                  {openIndex === index && (
                    <div className="ml-12">
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
                      <Location
                        itemName={item.itemName}
                        businessId={businessId}
                        updateLocationList={updateLocationList}
                      />
                      <ul>
                        {locationList.map((location, i) => (
                          <li
                            key={i}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            {location}
                            <button
                              onClick={() => handleLocationPopup(location)}
                              type="button"
                              className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                              i
                            </button>

                            {!locationInventory[location] ||
                            !locationInventory[location][item.itemName] ? (
                              <div>
                                <LocationTotalCount
                                  itemName={item.itemName}
                                  businessId={businessId}
                                  locationName={location}
                                  updateLocationInventory={
                                    updateLocationInventory
                                  }
                                />
                              </div>
                            ) : (
                              <>
                                <p className="m-8">
                                  Total count:{' '}
                                  {
                                    locationInventory[location][item.itemName]
                                      .portionNumber
                                  }
                                </p>
                                <p className="m-8">
                                  Last Updated:{' '}
                                  {
                                    locationInventory[location][item.itemName]
                                      .metaData
                                  }
                                </p>
                                <p className="m-8">Estimated:</p>
                              </>
                            )}
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
            <LocationPopup
              locationName={popupLocation}
              businessId={businessId}
              updataLocationMetaData={updataLocationMetaData}
            />
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
              <p>Address: {locationMetaData.locationAddress}</p>
              <p>Notes(MetaData): {locationMetaData.locationMetaData}</p>
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
              {/* Render ItemLog component here */}
              <ItemLog
                itemName={selectedItemName}
                businessId={businessId}
                locationBucket={'2024'}
                updateItemLog={updateItemLog}
              />
              <p>{selectedItemName} Log</p>
              {itemLog.map((log, index) => (
                <div key={index}>
                  <p>Location: {log.locationName}</p>
                  <p>Date + Time: {log.updateDate}</p>
                  <p>Description: {log.logReason}</p>
                  <p>Initial Portion: {log.initialPortion}</p>
                  <p>Final Portion: {log.finalPortion}</p>
                  <br />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Inventory;
