'use client';
import React, { useState, useEffect } from 'react';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import Distributor from '../components/Distributor';
import DistributorPopup from '../components/DistributorPopup';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function Distributors() {
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [index, setIndex] = useState('');
  const [distributorList, setDistributorList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [popupDistributor, setDistributorPopup] = useState('');
  const [editPopupDistributor, setEditPopup] = useState('');
  const [updataDistributorMetaData, setDistributorMetaData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [addDistributorPopup, setaddDistributorPopup] = useState('');
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [deletePopup, setDeletePopup] = useState('');
  const [distributorPopup, setDistributorsPopup] = useState('');

  const handleSideNavOpen = openState => {
    setIsSideNavOpen(openState);
    console.log(`openState:${openState}`);
    // Adjust the main page layout based on the open state
    // For example, you can set the left margin of the main page here
  };

  const [editedDistributorData, setEditedDistributorData] = useState({
    distributorName: '',
    distributorItemName: '',
    unitAmount: '',
    cost: ''
  });

  const [editedDistributorMetaData, setEditedDistributorMetaData] = useState({
    deadlineDate: '',
    deliveryDate: '',
    noteMetaData: ''
  });

  const [newDistributor, setNewDistributor] = useState({
    distributorName: '',
    itemName: '',
    itemPortion: '',
    itemCost: '',
    priority: ''
  });

  const handleInputChange = (event, name, distributorType) => {
    const value = event.target.value;
    if (distributorType === 'edited') {
      if (
        name === 'deadlineDate' ||
        name === 'deliveryDate' ||
        name === 'noteMetaData'
      ) {
        setEditedDistributorMetaData(prevState => ({
          ...prevState,
          [name]: value
        }));
      } else {
        setEditedDistributorData(prevState => ({
          ...prevState,
          [event.target.name]: value
        }));
      }
    } else if (distributorType === 'new') {
      setNewDistributor(prevState => ({
        ...prevState,
        [event.target.name]: value
      }));
    }
  };

  const updateDistributorList = newDistbutorList => {
    setDistributorList(newDistbutorList);
  };

  const updateDistributorMetaData = newDistbutorMetaData => {
    setDistributorMetaData(newDistbutorMetaData);
  };

  // Function to handle userId change
  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const handleDistributorPopup = distributor => {
    setDistributorPopup(distributor);
  };

  const handleAddPopup = item => {
    setaddDistributorPopup(item);
  };

  const handleClosePopup = () => {
    setDistributorPopup(false);
    setEditPopup(null);
    setaddDistributorPopup(null);
    setEditMode(false);
    setDeletePopup(false);
  };
  const handleCloseTablePopup = () => {
    setDistributorsPopup(false);
  };

  const handleEditDistributor = distributor => {
    setEditPopup(distributor);

    setEditedDistributorData({
      distributorItemName: distributor.distributorItemName,
      unitAmount: distributor.distributorItemPortion,
      cost: distributor.distributorItemCost
    });
  };

  const updateEditedMetaData = () => {
    setEditedDistributorMetaData({
      deadlineDate: updataDistributorMetaData.distributorDeadlineDate,
      deliveryDate: updataDistributorMetaData.distributorDeliveryDate,
      noteMetaData: updataDistributorMetaData.distributorMetaData
    });
  };

  const getNewDistributor = () => {
    console.log('Distributor Name: ' + newDistributor.distributorName);
    console.log('Item Name: ' + newDistributor.itemName);
    console.log('Item Portion: ' + newDistributor.itemPortion);
    console.log('Item Cost: ' + newDistributor.itemCost);
    console.log('Priority: ' + newDistributor.priority);
  };

  const handleDeleteDistributor = () => {
    setDeletePopup(true);
  };

  const getItemName = itemName => {
    console.log('Item Name:', itemName);
    setItemName(itemName);
  };

  const addDistributor = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-item/create?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            distributorName: newDistributor.distributorName,
            distributorItemName: newDistributor.itemName,
            distributorItemPortion: newDistributor.itemPortion,
            distributorItemCost: newDistributor.itemCost,
            priorityChoice: newDistributor.priority
          })
        }
      );
      if (!response.ok) {
        console.error('Error creating new distributor: ', Error);
      }
      // Fetch the updated distributor list
      const updatedDistributorList = await fetchUpdatedDistributorList();

      console.log(updatedDistributorList);
      // Update the distributor list state with the updated list
      setDistributorList(updatedDistributorList);
    } catch (error) {
      console.error('Error creating distributor:', error);
    }
  };

  const EditDistributor = async () => {
    console.log(index);
    try {
      // Make the first API call to update the distributor item name
      const response1 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-item/update-distributor-item-name?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            index: index,
            newDistributorItemName: editedDistributorData.distributorItemName
          })
        }
      );
      if (!response1.ok) {
        throw new Error('Failed to update distributor item name');
      }

      console.log('Unit Amount: ' + editedDistributorData.unitAmount);
      // Make the second API call to update the unit amount
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-item/update-item-portion?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            index: index,
            newItemPortion: editedDistributorData.unitAmount
          })
        }
      );
      if (!response2.ok) {
        throw new Error('Failed to update unit amount');
      }

      // Make the third API call to update the cost
      const response3 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-item/update-item-cost?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            index: index,
            newItemCost: editedDistributorData.cost
          })
        }
      );
      if (!response3.ok) {
        throw new Error('Failed to update cost');
      }

      // Fetch the updated distributor list
      const updatedDistributorList = await fetchUpdatedDistributorList();

      console.log(updatedDistributorList);
      // Update the distributor list state with the updated list
      setDistributorList(updatedDistributorList);

      // Handle successful updates
      console.log('Distributor information updated successfully');
      // Optionally, close the popup after successful update
      handleClosePopup();
    } catch (error) {
      console.error('Error updating distributor information:', error);
    }
  };

  const EditDistributorMetaData = async () => {
    console.log('HRERE');
    try {
      const response1 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-metadata-list/update-deadline-date?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            findDistributorName: updataDistributorMetaData.distributorName,
            newDistributorDeadlineDate: editedDistributorMetaData.deadlineDate
          })
        }
      );
      if (!response1.ok) {
        throw new Error('Failed to update Deadline Date');
      }
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-metadata-list/update-delivery-date?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            findDistributorName: updataDistributorMetaData.distributorName,
            newDistributorDeliveryDate: editedDistributorMetaData.deliveryDate
          })
        }
      );
      if (!response2.ok) {
        throw new Error('Failed to update Delivery Date');
      }
      const response3 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-metadata-list/update-meta-data?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            findDistributorName: updataDistributorMetaData.distributorName,
            newDeliveryMetaData: editedDistributorMetaData.noteMetaData
          })
        }
      );
      if (!response3.ok) {
        throw new Error('Failed to update metadata notes!');
      }

      // Optionally, you can handle successful updates here
      console.log('Distributor metadata updated successfully');
      // Close the popup after successful update
      handleClosePopup();
    } catch (error) {
      console.error('Error updating distributor metadata: ', error);
    }
  };

  const fetchUpdatedDistributorList = async () => {
    // Fetch the updated distributor list from the server

    const requestBody = {
      itemName: itemName
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-item/read-all?businessId=${businessId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch updated distributor list');
    }
    const data = await response.json();
    const outputList = data.outputList;
    const distributorNames = outputList
      .map(item => item.distributorItemList)
      .flat();
    return distributorNames; // Assuming the response contains the updated distributor list
  };

  const deleteDistributor = async () => {
    const requestBody = {
      itemName: itemName,
      index: index
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/distributor-item/delete?businessId=${businessId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch updated distributor list');
    }
    const updatedDistributorList = await fetchUpdatedDistributorList();

    console.log(updatedDistributorList);
    // Update the distributor list state with the updated list
    setDistributorList(updatedDistributorList);
  };

  const getBusinessId = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/user-info?id=${userId}`,
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
    console.log('here');
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

      console.log(fieldValues);

      setItemList(fieldValues);
    } catch (error) {
      console.error('Error fetching item names:', error);
    }
  };

  useEffect(() => {
    console.log(distributorList);
  }, [distributorList]);
  useEffect(() => {
    console.log('Index: ' + index);
  }, [index]);

  useEffect(() => {
    console.log('Updated itemList:', itemList);
  }, [itemList]);

  useEffect(() => {
    if (editMode) {
      setEditedDistributorMetaData({
        deadlineDate: updataDistributorMetaData.distributorDeadlineDate || '',
        deliveryDate: updataDistributorMetaData.distributorDeliveryDate || '',
        noteMetaData: updataDistributorMetaData.distributorMetaData || ''
      });
    }
  }, [editMode, updataDistributorMetaData]);

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
            <h2 className="text-2xl font-bold text-center mb-4 border-b border-gray-700">
              Distributors
            </h2>
            {itemList !== null && (
              <table className="w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-20 py-4 text-start text-lg font-medium text-gray-500 uppercase dark:text-neutral-500 w-[50%]"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-20 py-4 text-start text-lg font-medium text-gray-500 uppercase dark:text-neutral-500 w-[50%]"
                    >
                      Distributor Info
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {itemList.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 dark:hover:bg-neutral-700 h-24 overflow-y-auto"
                    >
                      <td className="px-20 py-6 whitespace-nowrap text-lg font-medium text-gray-800 dark:text-neutral-200 w-[50%]">
                        <div className="relative">
                          <div className="flex items-center ml-2">
                            <div className="mb-2">{item.itemName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-20 py-6 whitespace-nowrap text-lg font-medium text-gray-800 dark:text-neutral-200 w-[50%]">
                        <button
                          onClick={e => {
                            setItemName(item.itemName);
                            setDistributorsPopup(true);
                            e.stopPropagation();
                          }}
                          type="button"
                          className="inline-flex items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[100%]"
                        >
                          Distributor Info
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ul>
        )}

        {distributorPopup && (
          <div
            className="ml-12"
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
                maxHeight: '80%', // Adjusted to 80% to leave space at the bottom
                maxWidth: '90%',
                zIndex: 110,
                position: 'relative',
                overflowY: 'auto' // Added to make the popup content scrollable
              }}
              onClick={e => e.stopPropagation()}
            >
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
              <div className="flex items-center ml-2">
                <h6 className="mr-auto">Distributors:</h6>
              </div>
              <Distributor
                itemName={itemName}
                businessId={businessId}
                updateDistributorList={updateDistributorList}
              />
              <ul>
                <button
                  className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                  onClick={() => {
                    getItemName(itemName);
                    handleAddPopup(itemName);
                  }}
                >
                  Add Distributor
                </button>
                <table className="min-w-full border border-collapse border-gray-300">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distributor Name
                      </th>
                      <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Portion Size
                      </th>
                      <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {distributorList.map((distributor, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                          <p>
                            Distributor: {distributor.distributorName}
                            <button
                              onClick={() =>
                                handleDistributorPopup(distributor)
                              }
                              type="button"
                              className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                              i
                            </button>
                          </p>
                        </td>
                        <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                          <div className="flex items-baseline">
                            <p className="mr-2">
                              {distributor.distributorItemName}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                          {distributor.distributorItemPortion}
                        </td>
                        <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                          {distributor.distributorItemCost}
                        </td>
                        <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                          {distributor.priorityChoice}
                        </td>
                        <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                          <button
                            onClick={() => {
                              setIndex(i);
                              handleEditDistributor(distributor);
                            }}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setIndex(i);
                              setItemName(itemName);
                              handleDeleteDistributor(distributor);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ul>
            </div>
          </div>
        )}

        {popupDistributor && (
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
              <DistributorPopup
                businessId={businessId}
                distributorName={popupDistributor.distributorName}
                updateDistributorMetaData={updateDistributorMetaData}
              />
              <h6>{updataDistributorMetaData.distributorName} MetaData</h6>
              {editMode ? (
                <>
                  <p>Deadline Date: </p>
                  <input
                    type="text"
                    value={editedDistributorMetaData.deadlineDate}
                    onChange={e =>
                      handleInputChange(e, 'deadlineDate', 'edited')
                    }
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <p>Delivery Date: </p>
                  <input
                    type="text"
                    value={editedDistributorMetaData.deliveryDate}
                    onChange={e =>
                      handleInputChange(e, 'deliveryDate', 'edited')
                    }
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <p>Notes (MetaData): </p>
                  <input
                    type="text"
                    value={editedDistributorMetaData.noteMetaData}
                    onChange={e =>
                      handleInputChange(e, 'noteMetaData', 'edited')
                    }
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  {/* Add other input fields */}
                  <br />
                  {/* Save button */}
                  <button
                    onClick={() => {
                      EditDistributorMetaData(itemName);
                      handleClosePopup();
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p>
                    Deadline Date:{' '}
                    {updataDistributorMetaData.distributorDeadlineDate}
                  </p>
                  <p>
                    Delivery Date:{' '}
                    {updataDistributorMetaData.distributorDeliveryDate}
                  </p>
                  <p>
                    Notes (MetaData):{' '}
                    {updataDistributorMetaData.distributorMetaData}
                  </p>
                  {/* Display other metadata */}
                  <br />
                  {/* Edit button */}
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {editPopupDistributor && (
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
                <h6>Edit: {updataDistributorMetaData.distributorName}</h6>
                <p>Distributor Item Name: </p>
                <input
                  type="text"
                  name="distributorItemName"
                  value={editedDistributorData.distributorItemName}
                  onChange={e =>
                    handleInputChange(e, 'distributorItemName', 'edited')
                  }
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />
                <p>Unit Amount: </p>
                <input
                  type="text"
                  name="unitAmount"
                  value={editedDistributorData.unitAmount}
                  onChange={e => handleInputChange(e, 'unitAmount', 'edited')}
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />
                <p>Cost: </p>
                <input
                  type="text"
                  name="cost"
                  value={editedDistributorData.cost}
                  onChange={e => handleInputChange(e, 'cost', 'edited')}
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />
                <br></br>
                <button
                  onClick={() => {
                    EditDistributor(itemName);
                    handleClosePopup();
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {addDistributorPopup && (
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
                <h6>Create a new distributor/distributor item: </h6>

                {/* const [newDistributor, setNewDistributor] = useState({
                  distributorName: '',
                  itemName: '',
                  itemPortion: '',
                  itemCost: '',
                  priortiy: ''
                }) */}

                <p>Distributor name: </p>

                <input
                  type="text"
                  name="distributorName"
                  value={newDistributor.distributorName}
                  onChange={e => handleInputChange(e, 'distributorName', 'new')}
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />

                <p>Item name: </p>

                <input
                  type="text"
                  name="itemName"
                  value={newDistributor.itemName}
                  onChange={e => handleInputChange(e, 'itemName', 'new')}
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />
                <p>Item Portion: </p>

                <input
                  type="text"
                  name="itemPortion"
                  value={newDistributor.itemPortion}
                  onChange={e => handleInputChange(e, 'itemPortion', 'new')}
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />

                <p>Item Cost: </p>

                <input
                  type="text"
                  name="itemCost"
                  value={newDistributor.itemCost}
                  onChange={e => handleInputChange(e, 'itemCost', 'new')}
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />

                <p>Priority: </p>

                <input
                  type="text"
                  name="priority"
                  value={newDistributor.priority}
                  onChange={e => handleInputChange(e, 'priority', 'new')}
                  className="bg-gray-100 rounded-md p-2 mb-2"
                />
                <br></br>
                <button
                  onClick={() => {
                    addDistributor();
                    handleClosePopup();
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        {deletePopup && (
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
                Are you sure you want to delete this connection?
              </h6>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    handleClosePopup();
                    deleteDistributor();
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
      </div>
    </div>
  );
}
