'use client';
import React, { useState, useEffect } from 'react';
import SideNav from './components/side-nav';
import CookieComponent from './components/CookieComponent';
import Location from './components/location';
import LocationPopup from './components/LocationPopup';
import ItemLog from './components/ItemLog'; // Import ItemLog here
import LocationTotal from './components/LocationTotal';
import DateComponent from './components/DateComponent';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function Dashboard() {
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [largestPortionName, setLargestPortionName] = useState('');
  const [largestPortionNumber, setLargestPortionNumber] = useState('');
  /* Includes:
  itemName, estimate, totalCount, largestPortionName, largestPortionNumber
  Defaults largestPortionName, largestPortionNumber=> 1 Unit
  */
  const [locationList, setLocationList] = useState([]);
  const [locationMetaData, setLocationMetaData] = useState({});
  const [itemLog, setItemLog] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [popupLocation, setPopupLocation] = useState('');
  const [popupItemLog, setPopupItemLog] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [addItemPopup, setAddItemPopups] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationLoad, setLocationLoad] = useState('');
  const [deleteItemPopup, setDeleteItemPopup] = useState('');

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
    setLoadingLocation(false);
  };

  const updataLocationMetaData = newLocationMetaData => {
    setLocationMetaData(newLocationMetaData);
  };

  const updateItemLog = newItemLog => {
    setItemLog(newItemLog);
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
    setDeleteItemPopup(false);
  };

  const handleTableClosePopup = () => {
    setLocationLoad(false);
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

  const deleteItem = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-list/delete?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemName: itemName })
        }
      );
      if (!response.ok) {
        console.log('error');
        return null;
      }
      await fetchNewItemList(); // Wait for fetchNewItemList to complete
    } catch (error) {
      console.log(error);
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

  const formatDate = dateTimeStr => {
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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

            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-[1500px] inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="table-fixed min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                        >
                          Total Count
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                        >
                          Estimated
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {itemList !== null &&
                        itemList.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 dark:hover:bg-neutral-700 h-24 overflow-y-auto"
                          >
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                              {item.itemName}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                              {item.largestPortionName &&
                              item.totalCount &&
                              item.largestPortionNumber
                                ? (
                                    item.totalCount / item.largestPortionNumber
                                  ).toFixed(2)
                                : 'No'}{' '}
                              {item.largestPortionName &&
                              item.totalCount &&
                              item.largestPortionNumber
                                ? item.largestPortionName
                                : `Portion Details`}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                              {item.largestPortionName &&
                              item.totalCount &&
                              item.estimate &&
                              item.largestPortionNumber
                                ? (
                                    item.estimate / item.largestPortionNumber
                                  ).toFixed(2)
                                : 'No'}{' '}
                              {item.largestPortionName &&
                              item.totalCount &&
                              item.estimate &&
                              item.largestPortionNumber
                                ? item.largestPortionName
                                : `Portion Details`}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                              <button
                                onClick={e => {
                                  setItemName(item.itemName);
                                  setLargestPortionName(
                                    item.largestPortionName
                                  );
                                  setLargestPortionNumber(
                                    item.largestPortionNumber
                                  );
                                  setLocationLoad(true);
                                  e.stopPropagation();
                                }}
                                type="button"
                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                              >
                                Location
                              </button>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                              <button
                                onClick={e => {
                                  setItemName(item.itemName);
                                  setDeleteItemPopup(true);
                                  e.stopPropagation();
                                }}
                                type="button"
                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ul>
        )}
      </div>
      {locationLoad && (
        <div>
          <Location
            itemName={itemName}
            businessId={businessId}
            updateLocationList={updateLocationList}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100,
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
                  onClick={handleTableClosePopup}
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
              <div>
                <div className="flex items-center ml-2">
                  <h6 className="mr-auto">Location:</h6>
                  <button
                    onClick={() => handleItemLogPopup(itemName)}
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 focus:outline-none"
                    style={{
                      verticalAlign: 'middle'
                    }}
                  >
                    Item Log
                  </button>
                </div>
                <br></br>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-collapse border-gray-300">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Info
                        </th>
                        <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Count
                        </th>
                        <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {locationList && locationList.length > 0 ? (
                        locationList.map((location, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                              {location}
                            </td>
                            <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleLocationPopup(location)}
                                type="button"
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                                aria-label={`Info for ${location}`}
                              >
                                i
                              </button>
                            </td>
                            <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                              {
                                <LocationTotal
                                  itemName={itemName}
                                  location={location}
                                  businessId={businessId}
                                  unitName={largestPortionName}
                                  unitNumber={largestPortionNumber}
                                />
                              }
                            </td>
                            <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                              {
                                <DateComponent
                                  itemName={itemName}
                                  location={location}
                                  businessId={businessId}
                                />
                              }
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center"></td>
                          <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center"></td>
                          <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center"></td>
                          <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
      {deleteItemPopup && (
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
            <h6 className="text-center mb-4">
              Are you sure you want to delete this Item?
            </h6>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  handleClosePopup();
                  deleteItem();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded mr-4"
              >
                Yes
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {popupItemLog && (
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
              className="bg-white rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150 overflow-y-auto"
              style={{
                width: '30%', // Adjusted width
                maxHeight: '80%', // Adjusted maxHeight
                maxWidth: '95%', // Adjusted maxWidth
                zIndex: 110,
                position: 'relative',
                height: '500px', // Adjusted height
                padding: '0' // Remove padding
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
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

                {/* Render ItemLog component here */}
                <ItemLog
                  itemName={selectedItemName}
                  businessId={businessId}
                  locationBucket={'2024'}
                  updateItemLog={updateItemLog}
                />
                <p>{selectedItemName}</p>
                <br />

                {itemLog.map((log, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-300 pb-4 mb-4"
                    style={{ fontSize: '30px' }}
                  >
                    {' '}
                    {/* Added fontSize style */}
                    <p style={{ fontSize: '16px' }}>
                      Location: {log.locationName}
                    </p>{' '}
                    {/* Increased font size and added bold weight */}
                    <p style={{ fontSize: '16px' }}>
                      Date + Time: {formatDate(log.updateDate)}
                    </p>{' '}
                    {/* Increased font size */}
                    <p style={{ fontSize: '16px' }}>
                      Description: {log.logReason}
                    </p>{' '}
                    {/* Increased font size */}
                    <p style={{ fontSize: '16px' }}>
                      Initial Portion: {log.initialPortion}
                    </p>{' '}
                    {/* Increased font size */}
                    <p style={{ fontSize: '16px' }}>
                      Final Portion: {log.finalPortion}
                    </p>{' '}
                    {/* Increased font size */}
                  </div>
                ))}
              </div>
            </div>
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
