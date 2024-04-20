'use client';
import React, { useState, useEffect } from 'react';
import SideNav from './components/side-nav';
import CookieComponent from './components/CookieComponent';
import Location from './components/location';
import LargestPortion from './components/LargestPortion';
import LocationPopup from './components/LocationPopup';
import ItemTotalCount from './components/ItemTotalCount';
import ItemEstimateDeduction from './components/ItemEstimateDeduction';
import LocationTotalCount from './components/LocationTotalCount';
import ItemLog from './components/ItemLog'; // Import ItemLog here
import LocationTotal from './components/LocationTotal';
import DateComponent from './components/DateComponent';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function Dashboard() {
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
  const [estimatedDeductionMap, setEstimatedDeductionMap] = useState({});
  const [locationInventory, setLocationInventory] = useState({});
  const [maxPortionMap, setMaxPortionMap] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [addItemPopup, setAddItemPopups] = useState('');
  const [count, setCount] = useState('');
  const [maxPortionNumber, setMaxPortionNumber] = useState('');

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

  const [newLocationMetaData, setNewLocationMetaData] = useState({
    locationAddress: '',
    locationMetaData: ''
  });

  const [addJson, setAddJson] = useState({
    itemName: ''
  });

  const handleInputChange = (event, name, type) => {
    const value = event.target.value;
    if (type === 'location') {
      {
        setNewLocationMetaData(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else if (type === 'item') {
      setAddJson(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const EditLocationMetaData = async location => {
    try {
      const response1 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/location-metadata-list/update-address?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            findLocationName: location,
            newLocationAddress: newLocationMetaData.locationAddress
          })
        }
      );
      if (!response1.ok) {
        throw new Error('Failed to update location address: ', Error);
      }
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/location-metadata-list/update-metadata?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            findLocationName: location,
            newLocationMetaData: newLocationMetaData.locationMetaData
          })
        }
      );
      if (!response2.ok) {
        throw new Error('Failed to update location metadata: ', Error);
      }
    } catch (error) {
      console.error('Error updating location meta data: ', error);
    }
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

  const updateEstimateDeduction = (itemName, newEstimatedDeduction) => {
    setEstimatedDeductionMap(prevState => ({
      ...prevState,
      [itemName]: newEstimatedDeduction
    }));
  };

  const updateMaxPortionForItem = (itemName, newMaxPortion) => {
    setMaxPortionMap(prevState => ({
      ...prevState,
      [itemName]: newMaxPortion
    }));
  };

  const handleLocationPopup = location => {
    setPopupLocation(location);
  };

  const handleAddPopup = () => {
    setAddItemPopups(true);
  };

  const handleItemLogPopup = itemName => {
    setSelectedItemName(itemName);
    setPopupItemLog(true);
  };

  const handleClosePopup = () => {
    setPopupLocation(null);
    setPopupItemLog(false); // Set popupItemLog to false to close the popup
    setEditMode(false);
    setAddItemPopups(false);
  };

  const getBusinessId = async () => {
    try {
      console.log(
        `NEXT_PUBLIC_BACKEND_URL:${process.env.NEXT_PUBLIC_BACKEND_URL}`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/user-info?id=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
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
    } catch (error) {
      console.log(error.error);
    }
  };

  const addItem = async () => {
    console.log(addJson.itemName);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-list/create?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemName: addJson.itemName })
        }
      );
      if (!response.ok) {
        console.log('error');
        return null;
      }
      await fetchNewItemList(); // Wait for fetchNewItemList to complete
    } catch (error) {
      console.log(error.error);
    }
  };

  const fetchNewItemList = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-list/read-all/?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.ok) {
        console.log('error');
        return null;
      }
      const data = await response.json();
      const fieldValues = data.outputList;

      setItemList(fieldValues); // Update itemList state with new data
    } catch (error) {
      console.error('Error fetching item names:', error);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-list/read-all/?businessId=${businessId}`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-list/read-all/?businessId=${businessId}`,
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
      const fieldValues = data.outputList;
      console.log('FIELD NAMES:\n' + fieldValues);

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

  return (
    <div className="flex ">
      <SideNav openCallback={handleSideNavOpen} />
      <div
        className={`p-5 border-blue-500 flex justify-center items-center flex-col flex-1 ${isSideNavOpen ? 'ml-72' : 'ml-36'} lg:${isSideNavOpen ? 'ml-80' : 'ml-40'} xl:${isSideNavOpen ? 'ml-88' : 'ml-44'}`}
      >
        {loading ? (
          <CookieComponent
            cookieName={'accessToken'}
            onUserIdChange={handleUserIdChange}
          />
        ) : (
          <ul>
            <div>
              <h2 className="text-2xl font-bold text-center mb-4 border-b border-gray-700">
                Current Inventory
              </h2>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAddPopup}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
              >
                Add Item
              </button>
            </div>
            {itemList !== null &&
              itemList.map((item, index) => (
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
                      {!estimatedDeductionMap[item.itemName] && (
                        <div>
                          <ItemEstimateDeduction
                            businessId={businessId}
                            itemName={item.itemName}
                            estimateDeduction={updateEstimateDeduction}
                          />
                        </div>
                      )}
                      <LargestPortion
                        businessId={businessId}
                        itemName={item.itemName}
                        updateMaxPortion={updateMaxPortionForItem}
                      />
                      {/* Display the item count if available */}

                      <>
                        <p className="m-8">
                          Total Count:{' '}
                          {maxPortionMap[item.itemName] &&
                          itemCountMap[item.itemName] &&
                          maxPortionMap[item.itemName].unitNumber
                            ? (
                                itemCountMap[item.itemName] /
                                maxPortionMap[item.itemName].unitNumber
                              ).toFixed(2)
                            : 'No'}{' '}
                          {maxPortionMap[item.itemName] &&
                          itemCountMap[item.itemName] &&
                          maxPortionMap[item.itemName].unitNumber
                            ? maxPortionMap[item.itemName].unitName
                            : `Portion Details`}{' '}
                        </p>
                        <p className="m-8">
                          Estimate:{' '}
                          {maxPortionMap[item.itemName] &&
                          estimatedDeductionMap[item.itemName] &&
                          maxPortionMap[item.itemName].unitNumber
                            ? (
                                estimatedDeductionMap[item.itemName]
                                  .estimateDeduction /
                                maxPortionMap[item.itemName].unitNumber
                              ).toFixed(2)
                            : 'No'}{' '}
                          {maxPortionMap[item.itemName] &&
                          itemCountMap[item.itemName] &&
                          maxPortionMap[item.itemName].unitNumber
                            ? maxPortionMap[item.itemName].unitName
                            : `PortinDetails`}{' '}
                        </p>
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
                                  <LargestPortion
                                    businessId={businessId}
                                    itemName={item.itemName}
                                    updateMaxPortion={updateMaxPortionForItem}
                                  />
                                </div>
                              ) : (
                                <>
                                  <LocationTotal
                                    itemName={item.itemName}
                                    location={location}
                                    businessId={businessId}
                                    setCount={setCount}
                                  />
                                  <p className="m-8">
                                    Last Updated:
                                    <DateComponent
                                      itemName={item.itemName}
                                      location={location}
                                      businessId={businessId}
                                    />
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
        )}
      </div>
      {popupLocation && (
        <div>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(4px)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150"
              style={{
                width: '40%',
                maxHeight: '70%',
                maxWidth: '90%',
                zIndex: 110,
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-end p-2">
                <button
                  onClick={handleClosePopup}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              {/* <h6>Information about {popupLocation}</h6> */}

              <LocationPopup
                locationName={popupLocation}
                businessId={businessId}
                updataLocationMetaData={updataLocationMetaData}
              />

              {editMode ? (
                <>
                  <h6>Edit {popupLocation}</h6>
                  <p>Address: </p>
                  <input
                    type="text"
                    name="locationAddress"
                    value={newLocationMetaData.locationAddress}
                    onChange={e =>
                      handleInputChange(e, 'locationAddress', 'location')
                    }
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <p>Notes(MetaData): </p>
                  <input
                    type="text"
                    name="locationMetaData"
                    value={newLocationMetaData.locationMetaData}
                    onChange={e =>
                      handleInputChange(e, 'locationMetaData', 'location')
                    }
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <br />
                  <button
                    onClick={() => {
                      EditLocationMetaData(popupLocation);
                      handleClosePopup(); // Close the popup after saving
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <br></br>
                  <h6>Information about {popupLocation}: </h6>
                  <p>Address: {locationMetaData.locationAddress}</p>
                  <p>Notes (MetaData): {locationMetaData.locationMetaData}</p>
                  <br></br>
                  <button
                    onClick={() => {
                      setNewLocationMetaData(locationMetaData);
                      setEditMode(true);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {popupItemLog && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white p-4 rounded-md relative overflow-y-auto max-h-80"
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
            <p>{selectedItemName}</p>

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
      {addItemPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div
            className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150"
            style={{
              width: '40%',
              maxHeight: '70%',
              maxWidth: '90%',
              zIndex: 110,
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={handleClosePopup}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <h6 className="text-center mb-4">Add new portion size: </h6>
            <p className="text-center mb-2">Item Name: </p>
            <input
              type="text"
              name="itemName"
              value={addJson.itemName}
              onChange={e => handleInputChange(e, 'itemName', 'item')}
              className="bg-gray-200 rounded-md p-2 mb-2"
            />
            <br />
            <button
              onClick={() => {
                addItem();
                handleClosePopup();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
