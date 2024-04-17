'use client';
import React, { useState, useEffect } from 'react';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import ItemTotalCount from '../components/ItemTotalCount';
import LargestPortion from '../components/LargestPortion';
import PortionInfo from '../components/PortionInfo';
import ItemsNeeded from '../components/ItemsNeeded';
import ItemsUsedIn from '../components/ItemsUsedIn';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function UpdateByCalculator() {
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemCountMap, setItemCountMap] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [maxPortionMap, setMaxPortionMap] = useState({});
  const [openPortionInfo, setOpenPortionInfo] = useState(false);
  const [openItemNeeded, setOpenItemNeeded] = useState(false);
  const [openItemUsedIn, setOpenItemUsedIn] = useState(false);
  const [itemPortionMap, setItemPortionMap] = useState([]);
  const [itemsNeededMap, setItemsNeededMap] = useState({});
  const [itemsUsedInMap, setItemsUsedInMap] = useState({});
  const [editPortionInfo, setEditPortionInfo] = useState('');
  const [editInventoryUsedInPopup, setEditInventoryUsedInPopup] = useState('');
  const [deletePortionPopup, setdeletePortionPopup] = useState('');
  const [deleteInventoryConnectionPopup, setdeleteInventoryConnectionPopup] =
    useState('');
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  const handleSideNavOpen = openState => {
    setIsSideNavOpen(openState);
    console.log(`openState:${openState}`);
    // Adjust the main page layout based on the open state
    // For example, you can set the left margin of the main page here
  };
  const [editedInventory, setEditedInventory] = useState({
    rawItemName: '',
    finishedItemName: '',
    newUnitCost: 0
  });

  const handleCloseTablePopup = () => {
    setOpenItemUsedIn(false);
  };
  const handleClosePopup = () => {
    setEditInventoryUsedInPopup(false);
  };

  const setItemsNeeded = (itemName, usedInList) => {
    setItemsNeededMap(prevState => ({
      ...prevState,
      [itemName]: usedInList
    }));
  };
  // Function to handle userId change
  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const getItemName = itemName => {
    console.log('Item Name:', itemName);
    setItemName(itemName);
  };

  const updateItemCount = (itemName, newItemTotal) => {
    setItemCountMap(prevState => ({
      ...prevState,
      [itemName]: newItemTotal
    }));
  };

  const updatePortionInfo = (itemName, newPortionInfo) => {
    setItemPortionMap(prevState => ({
      ...prevState,
      [itemName]: newPortionInfo
    }));
  };

  const updateItemsUsedIn = (itemName, newItemsUsedIn) => {
    setItemsUsedInMap(prevState => ({
      ...prevState,
      [itemName]: newItemsUsedIn
    }));
  };

  const updateMaxPortionForItem = (itemName, newMaxPortion) => {
    setMaxPortionMap(prevState => ({
      ...prevState,
      [itemName]: newMaxPortion
    }));
  };

  const getBusinessId = async () => {
    const response = await fetch(
      'https://slicer-backend.vercel.app/api/auth/user/user-info?id=' + userId,
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
        'https://slicer-backend.vercel.app/api/crud/business/item-list/read-all/?businessId=' +
          businessId
      );
      const response = await fetch(
        'https://slicer-backend.vercel.app/api/crud/business/item-list/read-all/?businessId=' +
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

  const handleEditInventoryUsedPopup = item => {
    setEditedInventory({
      rawItemName: item.itemName,
      finishedItemName: itemName,
      newUnitCost: item.unitCost
    });
    setEditInventoryUsedInPopup(item);
  };

  useEffect(() => {
    console.log('Maxportion' + maxPortionMap);
  }, [maxPortionMap]);

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
          <ul>
            {itemList.map((item, index) => (
              <li key={index}>
                <div className="relative">
                  <div className="flex items-center ml-2">
                    <button
                      onClick={() => {
                        getItemName(item.itemName);
                        setOpenIndex(openIndex === index ? null : index);
                        setOpenPortionInfo(false);
                        setOpenItemNeeded(false);
                        setOpenItemUsedIn(false);
                      }}
                      type="button"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${openIndex === index ? 'rotate-180' : 'rotate-90'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <div className="flex items-center ml-2">
                      <button
                        onClick={() => {
                          getItemName(item.itemName);
                          setOpenIndex(openIndex === index ? null : index);
                        }}
                        type="button"
                        className="inline-flex items-center justify-center ml-2 mr-2 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
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
                            itemCountMap[item.itemName] /
                              maxPortionMap[item.itemName].unitNumber}{' '}
                          {maxPortionMap[item.itemName] &&
                            maxPortionMap[item.itemName].unitName}
                        </p>
                        <p className="m-8">Estimated:</p>
                      </>
                    </div>
                  </div>
                  {openIndex === index && (
                    <div className="ml-12">
                      <div className="flex">
                        <button
                          onClick={() => {
                            setOpenPortionInfo(!openPortionInfo);
                            setOpenItemNeeded(false);
                            setOpenItemUsedIn(false);
                          }}
                          className="dropdown-button flex items-center"
                        >
                          <span className="mr-2">Portion Info</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 mr-2 ${openPortionInfo ? 'rotate-180' : 'rotate-90'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Add
                        </button>
                      </div>
                      <br />
                      {openPortionInfo && (
                        <div>
                          {/* Content for Portion Info dropdown */}
                          <PortionInfo
                            businessId={businessId}
                            itemName={item.itemName}
                            setPortionInfoMap={updatePortionInfo}
                          />
                          {/* Display the portionInfoList */}
                          {itemPortionMap[item.itemName] && (
                            <ul>
                              {itemPortionMap[item.itemName].map(
                                (portion, portionIndex) => (
                                  <li key={portionIndex}>
                                    <div className="grid grid-cols-6 gap-4 items-center border-t border-b border-gray-300 py-2">
                                      <div className="col-span-1 border-r pr-2">
                                        Unit Name:
                                      </div>
                                      <div className="col-span-1 border-r pr-2">
                                        {portion.unitName}
                                      </div>
                                      <div className="col-span-1 border-r pr-2">
                                        Unit Number:
                                      </div>
                                      <div className="col-span-1 border-r pr-2">
                                        {portion.unitNumber}
                                      </div>

                                      <button className="col-span-1 bg-green-500 text-white px-2 py-1 rounded text-sm">
                                        Edit
                                      </button>
                                      <button className="col-span-1 bg-red-500 text-white px-2 py-1 rounded text-sm">
                                        Delete
                                      </button>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      )}
                      <div className="flex">
                        <button
                          onClick={() => {
                            setOpenItemNeeded(!openItemNeeded);
                            setOpenPortionInfo(false);
                            setOpenItemUsedIn(false);
                          }}
                          className="dropdown-button flex items-center mr-2"
                        >
                          <span className="mr-2">Items Needed</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 mr-2 ${openItemNeeded ? 'rotate-180' : 'rotate-90'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Add
                        </button>
                      </div>

                      <br />
                      {openItemNeeded && (
                        <div>
                          <ItemsNeeded
                            businessId={businessId}
                            itemName={item.itemName}
                            setItemsNeeded={setItemsNeeded}
                          />
                          {/* Content for Item Needed dropdown */}
                          {itemsNeededMap[itemName] && (
                            <ul>
                              <div className="overflow-auto">
                                <div className="grid grid-cols-4 gap-2 items-center border-t border-b border-gray-300 py-2">
                                  <div className="col-span-1 border-r border-l pr-2 text-center font-bold">
                                    Item Name
                                  </div>
                                  <div className="col-span-1 border-r pr-2 text-center font-bold">
                                    Unit Cost
                                  </div>
                                  <div className="col-span-1 border-r pr-2 text-center font-bold">
                                    Edit
                                  </div>
                                  <div className="col-span-1 border-r pr-2 text-center font-bold">
                                    Delete
                                  </div>
                                </div>
                                {itemsNeededMap[itemName].map((item, index) => (
                                  <li key={index}>
                                    <div className="grid grid-cols-4 gap-2 items-center border-t border-b border-gray-300 py-2">
                                      <div className="col-span-1 border-r border-l pr-2 text-center">
                                        {item.itemName}
                                      </div>
                                      <div className="col-span-1 border-r pr-2 text-center">
                                        {item.unitCost}
                                      </div>
                                      <div className="col-span-1 border-r pr-2 text-center">
                                        <button className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                                          Edit
                                        </button>
                                      </div>
                                      <div className="col-span-1 border-r pr-2 text-center">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </div>
                            </ul>
                          )}
                        </div>
                      )}
                      <div className="flex">
                        <button
                          onClick={() => {
                            setOpenItemUsedIn(!openItemUsedIn);
                            setOpenPortionInfo(false);
                            setOpenItemNeeded(false);
                          }}
                          className="dropdown-button flex items-center"
                        >
                          <span className="mr-2">Item UsedIn</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 mr-2 ${openItemUsedIn ? 'rotate-180' : 'rotate-90'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Add
                        </button>
                      </div>
                      <br />
                      {openItemUsedIn && (
                        <div>
                          <ItemsUsedIn
                            businessId={businessId}
                            itemName={item.itemName}
                            setItemsUsedIn={updateItemsUsedIn}
                          />
                          {itemsUsedInMap[itemName] && (
                            <ul>
                              <div className="overflow-auto">
                                {itemsUsedInMap[itemName].length > 0 && (
                                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm">
                                      <div className="flex justify-end p-2">
                                        <button
                                          onClick={handleCloseTablePopup}
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
                                        Items Used in {itemName}
                                      </h6>
                                      <table className="min-w-full border border-collapse border-gray-300">
                                        <thead>
                                          <tr>
                                            <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Item Name
                                            </th>
                                            <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Unit Cost
                                            </th>
                                            <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Edit
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Delete
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                          {itemsUsedInMap[itemName].map(
                                            (item, index) => (
                                              <tr key={index}>
                                                <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                                  {item.itemName}
                                                </td>
                                                <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                                  {item.unitCost}
                                                </td>
                                                <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                                  <button
                                                    onClick={() =>
                                                      handleEditInventoryUsedPopup(
                                                        item
                                                      )
                                                    }
                                                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                                  >
                                                    Edit
                                                  </button>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-300 whitespace-nowrap text-center">
                                                  <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                                                    Delete
                                                  </button>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {editInventoryUsedInPopup && (
                    <div>
                      <div
                        className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm"
                        onClick={handleClosePopup}
                      >
                        <div
                          className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm"
                          style={{
                            width: '40%',
                            maxHeight: '70%',
                            maxWidth: '90%'
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
                            Edit Item Connection(Item Cost Only):{' '}
                          </h6>
                          <p className="text-center mb-2">
                            Item Used In Selected Item:{' '}
                          </p>
                          <input
                            type="text"
                            name="newNumber"
                            value={editedInventory.rawItemName}
                            readOnly
                            className="bg-gray-200 rounded-md p-2 mb-2"
                          />
                          <p className="text-center mb-2">Selected Item: </p>
                          <input
                            type="text"
                            name="newMetaData"
                            value={editedInventory.finishedItemName}
                            readOnly
                            className="bg-gray-200 rounded-md p-2 mb-2"
                          />
                          <p className="text-center mb-2">Unit Cost: </p>
                          <input
                            type="text"
                            name="newMetaData"
                            value={editedInventory.newUnitCost}
                            className="bg-gray-200 rounded-md p-2 mb-2"
                          />
                          <br />
                          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UpdateByCalculator;
