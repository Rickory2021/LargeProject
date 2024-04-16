'use client';
import React, { useState, useEffect } from 'react';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import Distributor from '../components/Distributor';
import DistributorPopup from '../components/DistributorPopup';

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
    setDistributorPopup(null);
    setEditPopup(null);
    setaddDistributorPopup(null);
    setEditMode(false);
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

  const getItemName = itemName => {
    console.log('Item Name:', itemName);
    setItemName(itemName);
  };

  const addDistributor = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/distributor-item/create?businessId=' +
          businessId,
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
            priorityChoice: newDistributor.priorityChoice
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
        'http://localhost:3001/api/crud/business/distributor-item/update-distributor-item-name?businessId=' +
          businessId,
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
        'http://localhost:3001/api/crud/business/distributor-item/update-item-portion?businessId=' +
          businessId,
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
        'http://localhost:3001/api/crud/business/distributor-item/update-item-cost?businessId=' +
          businessId,
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
        'http://localhost:3001/api/crud/business/distributor-metadata-list/update-deadline-date?businessId=' +
          businessId,
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
        'http://localhost:3001/api/crud/business/distributor-metadata-list/update-delivery-date?businessId=' +
          businessId,
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
        'http://localhost:3001/api/crud/business/distributor-metadata-list/update-meta-data?businessId=' +
          businessId,
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
      'http://localhost:3001/api/crud/business/distributor-item/read-all?businessId=' +
        businessId,
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

  useEffect(() => {
    console.log(distributorList);
  }, [distributorList]);
  useEffect(() => {
    console.log('Index: ' + index);
  }, [index]);

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
      <SideNav />
      <div className="flex justify-center items-center flex-col flex-1">
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
                      }}
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
                    <div className="mb-2">
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
                      <button
                        className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                        onClick={() => {
                          getItemName(item.itemName);
                          handleAddPopup(item);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {openIndex === index && (
                    <div className="ml-12">
                      <div className="flex items-center ml-2">
                        <h6 className="mr-auto">Distributors:</h6>
                      </div>
                      <Distributor
                        itemName={item.itemName}
                        businessId={businessId}
                        updateDistributorList={updateDistributorList}
                      />

                      <ul>
                        {distributorList.map((distributor, i) => (
                          <li
                            key={i}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
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
                            <div className="flex items-baseline">
                              <p className="mr-2">
                                Item: {distributor.distributorItemName}
                              </p>
                              <button
                                onClick={() => {
                                  setIndex(i);
                                  handleEditDistributor(distributor);
                                }}
                                type="button"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                              >
                                Edit
                              </button>
                            </div>
                            <p>
                              PortionSize: {distributor.distributorItemPortion}
                            </p>
                            <p>Cost: {distributor.distributorItemCost}</p>
                            <p>Priority: {distributor.priorityChoice}</p>
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
        {popupDistributor && (
          <div>
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50"
              onClick={handleClosePopup}
            >
              <div
                className="bg-white p-4 rounded-md relative"
                onClick={e => e.stopPropagation()}
              >
                <DistributorPopup
                  businessId={businessId}
                  distributorName={popupDistributor.distributorName}
                  updateDistributorMetaData={updateDistributorMetaData}
                />
                <button
                  className="absolute top-2 right-2"
                  onClick={handleClosePopup}
                >
                  X
                </button>
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
                    <button onClick={EditDistributorMetaData}>Save</button>
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
                    <button onClick={() => setEditMode(true)}>Edit</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {editPopupDistributor && (
          <div>
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50"
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
                <button onClick={() => EditDistributor(itemName)}>Save</button>
              </div>
            </div>
          </div>
        )}
        {addDistributorPopup && (
          <div>
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50"
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
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
