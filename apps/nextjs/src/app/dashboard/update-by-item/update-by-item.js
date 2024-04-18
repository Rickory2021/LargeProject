'use client';
import React, { useState, useEffect } from 'react';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import ItemTotalCount from '../components/ItemTotalCount';
import LargestPortion from '../components/LargestPortion';
import Location from '../components/location';
import LocationPopup from '../components/LocationPopup';
import ItemLocationList from '../components/ItemLocationList';
import ItemEstimateDeduction from '../components/ItemEstimateDeduction';
import Distributor from '../components/Distributor';
import DistributorPopup from '../components/DistributorPopup';
import LocationTotalCount from '../components/LocationTotalCount';
import DropdownSelection from '../components/DropdownSelection';
import DateComponent from '../components/DateComponent';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function UpdateByItem() {
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [index, setIndex] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [itemCountMap, setItemCountMap] = useState({});
  const [estimatedDeductionMap, setEstimatedDeductionMap] = useState({});
  const [distributorList, setDistributorList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [popupDistributor, setDistributorPopup] = useState('');
  const [editPopupDistributor, setEditPopup] = useState('');
  const [updataDistributorMetaData, setDistributorMetaData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [maxPortionMap, setMaxPortionMap] = useState({});
  const [popupLocation, setPopupLocation] = useState('');
  const [locationInventory, setLocationInventory] = useState({});
  const [locationMetaData, setLocationMetaData] = useState({});
  const [addLocationPopup, setAddLocationPopup] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownStates, setDropdownStates] = useState({});
  const [showDropdownMap, setShowDropdownMap] = useState({});
  const [itemLocationList, setItemLocationList] = useState([]);
  const [editInventoryItemPopup, setEditInventoryItemPopup] = useState('');
  const [locationName, setLocationName] = useState('');
  const [addInventoryPopup, setAddInventoryPopup] = useState('');
  const [deleteInventoryPopup, setDeleteInventoryPopup] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  const updateEstimateDeduction = (itemName, newEstimatedDeduction) => {
    setEstimatedDeductionMap(prevState => ({
      ...prevState,
      [itemName]: newEstimatedDeduction
    }));
  };

  const handleSideNavOpen = openState => {
    setIsSideNavOpen(openState);
    console.log(`openState:${openState}`);
    // Adjust the main page layout based on the open state
    // For example, you can set the left margin of the main page here
  };

  const toggleDropdownForLocation = location => {
    setShowDropdownMap(prevState => ({
      ...prevState,
      [location]: !prevState[location] || false
    }));
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

  const [newLocation, setNewLocation] = useState({
    itemName: '',
    locationName: ''
  });

  const [newLocationMetaData, setNewLocationMetaData] = useState({
    locationAddress: '',
    locationMetaData: ''
  });

  const [newInventoryItem, setNewInventoryItem] = useState({
    newMetaData: '',
    index: '',
    newNumber: '',
    logReason: ''
  });

  const [defaultPortion] = useState({
    unitName: 'N/A',
    unitNumber: 0
  });

  const handleInputChange = (event, name, type) => {
    const value = event.target.value;
    if (type === 'locationMetaData') {
      {
        setNewLocationMetaData(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else if (type === 'location') {
      {
        setNewLocation(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else if (type === 'Item') {
      {
        setNewInventoryItem(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
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

  const handleDeleteInventoryPopup = (location, index) => {
    setIndex(index);
    setDeleteInventoryPopup(location);
  };

  const handleEditInventoryItemPopup = (item, index) => {
    setNewInventoryItem({
      newMetaData: item.metaData,
      index: index,
      newNumber: item.portionNumber
    });
    setEditInventoryItemPopup(item);
  };

  const handleAddLocationPopup = item => {
    setAddLocationPopup(item);
  };
  const handleAddInventoryPopup = item => {
    setAddInventoryPopup(item);
    setNewInventoryItem({
      newMetaData: '',
      index: '',
      newNumber: ''
    });
  };

  const updataLocationMetaData = newLocationMetaData => {
    setLocationMetaData(newLocationMetaData);
  };

  const updateLocationList = newLocationList => {
    setLocationList(newLocationList);
  };

  const handleLocationPopup = location => {
    setPopupLocation(location);
  };

  const handleClosePopup = () => {
    setAddLocationPopup(false);
    setAddInventoryPopup(false);
    setDeleteInventoryPopup(false);
    setPopupLocation(null);
    setEditInventoryItemPopup(false);
    setEditMode(false);
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

  const defaultLocationInventory = {
    portionNumber: 0,
    metaData: 'No Input Exists'
  };

  const handleEditDistributor = distributor => {
    setEditPopup(distributor);

    setEditedDistributorData({
      distributorItemName: distributor.distributorItemName,
      unitAmount: distributor.distributorItemPortion,
      cost: distributor.distributorItemCost
    });
  };

  const handleItemSelected = selectedItem => {
    console.log('selectedItem: ' + setSelectedItem);
    setSelectedItem(selectedItem);
    // Do something with the selected item
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

  const updateItemCount = (itemName, newItemTotal) => {
    setItemCountMap(prevState => ({
      ...prevState,
      [itemName]: newItemTotal
    }));
  };

  const updateMaxPortionForItem = (itemName, newMaxPortion) => {
    setMaxPortionMap(prevState => ({
      ...prevState,
      [itemName]: newMaxPortion
    }));
  };

  const addLocation = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/item-location/create?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            locationName: newLocation.locationName
          })
        }
      );
      if (!response.ok) {
        console.error('Error creating new location: ', Error);
      }
      // Fetch the updated distributor list
      const updatedLocationList = await fetchUpdatedLocationList();

      console.log(updatedLocationList);
      // Update the distributor list state with the updated list
      updateLocationList(updatedLocationList);
    } catch (error) {
      console.error('Error creating distributor:', error);
    }
  };

  const addInventoryItem = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/item-inventory/create?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            locationName: locationName,
            portionNumber: newInventoryItem.newNumber,
            metaData: newInventoryItem.newMetaData,
            logReason: newInventoryItem.logReason
          })
        }
      );
      if (!response.ok) {
        console.error('Error creating new location: ', Error);
      }
      // Fetch the updated distributor list
      await fetchUpdatedInventoryList();
    } catch (error) {
      console.error('Error creating distributor:', error);
    }
  };

  const updateInventoryItem = async () => {
    console.log(itemName);
    console.log(locationName);
    console.log(newInventoryItem.index);
    console.log(newInventoryItem.newNumber);
    try {
      const response1 = await fetch(
        'http://localhost:3001/api/crud/business/item-inventory/update-number?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            findLocationName: locationName,
            index: newInventoryItem.index,
            newNumber: newInventoryItem.newNumber
          })
        }
      );
      if (!response1.ok) {
        console.Error('Error updating inventory item name: ', Error);
      }
      const response2 = await fetch(
        'http://localhost:3001/api/crud/business/item-inventory/update-metadata?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            findLocationName: locationName,
            index: newInventoryItem.index,
            newMetaData: newInventoryItem.newMetaData
          })
        }
      );
      if (!response2.ok) {
        console.Error('Error updating inventory item metaData: ', Error);
      }

      await fetchUpdatedInventoryList();
    } catch (error) {
      console.error('Error updating new Inventory Item');
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
      const updatedDistributorList = await fetchUpdatedLocationList();

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

  const handleDeleteItem = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/item-inventory/delete?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            locationName: locationName,
            index: index
          })
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      await fetchUpdatedInventoryList();
    } catch (error) {
      console.error('Error deleting Item: ', error);
    }
  };

  const EditDistributorMetaData = async () => {
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

  const EditLocationMetaData = async location => {
    try {
      const response1 = await fetch(
        'http://localhost:3001/api/crud/business/location-metadata-list/update-address?businessId=' +
          businessId,
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
        'http://localhost:3001/api/crud/business/location-metadata-list/update-metadata?businessId=' +
          businessId,
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

  const fetchUpdatedInventoryList = async () => {
    const requestBody = {
      itemName: itemName,
      locationName: locationName
    };

    const response = await fetch(
      'http://localhost:3001/api/crud/business/item-inventory/read-all?businessId=' +
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
      throw new Error('Failed to fetch Item list');
    }
    const data = await response.json();
    const itemList = data.outputList.map(item => item.inventoryList).flat();
    console.log(itemList);
    setItemLocationList(itemList);
  };

  const fetchUpdatedLocationList = async () => {
    // Fetch the updated distributor list from the server

    const requestBody = {
      itemName: itemName
    };

    const response = await fetch(
      'http://localhost:3001/api/crud/business/item-location/read-all?businessId=' +
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
      throw new Error('Failed to fetch item names');
    }
    const data = await response.json();
    const outputList = data.outputList;
    const locationNames = outputList.map(item => item.locationName).flat();
    return locationNames; // Assuming the response contains the updated distributor list
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
        'hhttp://localhost:3001/api/crud/business/item-list/read-all/?businessId=' +
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

  const upItemCount = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/item-list/total-item-count?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemName: itemName })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch item count');
      }
      const data = await response.json();
      const itemCount = data.outputList[0];
      updateItemCount(itemName, itemCount);
    } catch (error) {
      console.error('Error fetching item count:', error);
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

  useEffect(() => {
    console.log('Maxportion' + maxPortionMap);
  }, [maxPortionMap]);

  useEffect(() => {
    console.log('newInventoryItem: ' + newInventoryItem.newNumber);
  }, [newInventoryItem]);

  useEffect(() => {
    upItemCount();
  }, [itemLocationList]);

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
              Item List
            </h2>
            {itemList !== null &&
              itemList.map((item, index) => (
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
                              : 'Portion Details'}{' '}
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
                              : 'Portion Details'}{' '}
                          </p>
                        </>
                      </div>
                    </div>
                    {openIndex === index && (
                      <div className="ml-12">
                        <div className="flex items-center ml-2">
                          <h6 className="mr-auto">Location: </h6>
                          <button
                            onClick={handleAddLocationPopup}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                          >
                            Add new location
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
                                <div className="flex items-center">
                                  <button
                                    onClick={() => {
                                      setItemName(item.itemName);
                                      toggleDropdownForLocation(location);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                  >
                                    {location}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleLocationPopup(location)
                                    }
                                    type="button"
                                    className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full border border-black shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-500 focus:outline-none"
                                  >
                                    i
                                  </button>
                                  <p className="m-8">
                                    Last Updated:{' '}
                                    <DateComponent
                                      itemName={item.itemName}
                                      location={location}
                                      businessId={businessId}
                                    />
                                  </p>
                                  {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                    {' '}
                                    Clear estimate{' '}
                                  </button> */}
                                </div>
                              )}
                              {showDropdownMap[location] && (
                                <div>
                                  <div className="flex items-center space-x-4 mb-4">
                                    <p className="font-bold">Inventory List:</p>
                                    <DropdownSelection
                                      businessId={businessId}
                                      itemName={item.itemName}
                                      onItemSelected={handleItemSelected}
                                    />
                                    <button
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                      onClick={() => {
                                        setLocationName(location);
                                        handleAddInventoryPopup(item);
                                      }}
                                    >
                                      Add Inventory element{' '}
                                    </button>
                                  </div>
                                  <div className="flex flex-col items-start space-y-4">
                                    <ItemLocationList
                                      businessId={businessId}
                                      itemName={itemName}
                                      locationName={location}
                                      setItemLocationList={setItemLocationList}
                                    />
                                    {itemLocationList.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between w-full border p-4 rounded-md"
                                      >
                                        <div className="w-1/2 pl-4 flex items-center">
                                          {selectedItem &&
                                          selectedItem.unitNumber !== 0 &&
                                          selectedItem.unitNumber ? (
                                            <p>
                                              portionNumber:{' '}
                                              {item.portionNumber /
                                                selectedItem.unitNumber}{' '}
                                              {selectedItem.unitName}
                                            </p>
                                          ) : (
                                            <p>
                                              portionNumber:{' '}
                                              {item.portionNumber} Base Units
                                            </p>
                                          )}
                                          <p className="ml-4">
                                            Note: {item.metaData}
                                          </p>
                                        </div>
                                        <div className="flex space-x-4">
                                          <button
                                            onClick={() => {
                                              setLocationName(location);
                                              console.log(index);
                                              handleEditInventoryItemPopup(
                                                item,
                                                index
                                              );
                                            }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => {
                                              setLocationName(location);
                                              handleDeleteInventoryPopup(
                                                location,
                                                index
                                              );
                                            }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {popupLocation && (
                      <div>
                        <div
                          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50"
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
                            {/* <h6>Information about {popupLocation}</h6> */}

                            {editMode ? (
                              <>
                                <h6>Edit {popupLocation}</h6>
                                <p>Address: </p>
                                <input
                                  type="text"
                                  name="locationAddress"
                                  value={newLocationMetaData.locationAddress}
                                  onChange={e =>
                                    handleInputChange(
                                      e,
                                      'locationAddress',
                                      'locationMetaData'
                                    )
                                  }
                                  className="bg-gray-100 rounded-md p-2 mb-2"
                                />
                                <p>Notes(MetaData): </p>
                                <input
                                  type="text"
                                  name="locationMetaData"
                                  value={newLocationMetaData.locationMetaData}
                                  onChange={e =>
                                    handleInputChange(
                                      e,
                                      'locationMetaData',
                                      'locationMetaData'
                                    )
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
                                <p>
                                  Address: {locationMetaData.locationAddress}
                                </p>
                                <p>
                                  Notes (MetaData):{' '}
                                  {locationMetaData.locationMetaData}
                                </p>
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
                    {addLocationPopup && (
                      <div>
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
                              <h6>Create a new Location: </h6>
                              <p>Location name: </p>

                              <input
                                type="text"
                                name="locationName"
                                value={newLocation.locationName}
                                onChange={e =>
                                  handleInputChange(
                                    e,
                                    'locationName',
                                    'location'
                                  )
                                }
                                className="bg-gray-100 rounded-md p-2 mb-2"
                              />
                              <br></br>
                              <button
                                onClick={() => {
                                  addLocation();
                                  handleClosePopup();
                                }}
                              >
                                Create
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {editInventoryItemPopup && (
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
                            <h6>Edit Inventory Input: </h6>
                            <p>Portion Number: </p>
                            <input
                              type="text"
                              name="newNumber"
                              value={newInventoryItem.newNumber}
                              onChange={e =>
                                handleInputChange(e, 'newNumber', 'Item')
                              }
                              className="bg-gray-100 rounded-md p-2 mb-2"
                            />
                            <p>Note: </p>
                            <input
                              type="text"
                              name="newMetaData"
                              value={newInventoryItem.newMetaData}
                              onChange={e =>
                                handleInputChange(e, 'newMetaData', 'Item')
                              }
                              className="bg-gray-100 rounded-md p-2 mb-2"
                            />
                            <br />
                            <button
                              onClick={() => {
                                updateInventoryItem(), handleClosePopup();
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {addInventoryPopup && (
                      <div>
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
                              <h6>Create a new Inventory Item: </h6>
                              <p>Item Name: </p>

                              <input
                                type="text"
                                name="itemName"
                                value={itemName}
                                readOnly
                                className="bg-gray-100 rounded-md p-2 mb-2"
                              />
                              <p>Location Name: </p>

                              <input
                                type="text"
                                name="locationName"
                                value={locationName}
                                readOnly
                                className="bg-gray-100 rounded-md p-2 mb-2"
                              />
                              <p>Portion Number: </p>

                              <input
                                type="text"
                                name="newNumber"
                                value={newInventoryItem.newNumber}
                                onChange={e =>
                                  handleInputChange(e, 'newNumber', 'Item')
                                }
                                className="bg-gray-100 rounded-md p-2 mb-2"
                              />
                              <p>Note(MetaData): </p>

                              <input
                                type="text"
                                name="newMetaData"
                                value={newInventoryItem.newMetaData}
                                onChange={e =>
                                  handleInputChange(e, 'newMetaData', 'Item')
                                }
                                className="bg-gray-100 rounded-md p-2 mb-2"
                              />
                              <p>Log Reason: </p>

                              <input
                                type="text"
                                name="logReason"
                                value={newLocation.logReason}
                                onChange={e =>
                                  handleInputChange(e, 'logReason', 'Item')
                                }
                                className="bg-gray-100 rounded-md p-2 mb-2"
                              />
                              <br></br>
                              <button
                                onClick={() => {
                                  addInventoryItem();
                                  handleClosePopup();
                                }}
                              >
                                Create
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {deleteInventoryPopup && (
                      <div>
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
                              <br />
                              <p className="max-w-sm text-center">
                                Are you sure you want to delete this Inventory
                                Item?
                              </p>
                              <br />
                              <div className="flex justify-between">
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                                  onClick={() => {
                                    handleDeleteItem();
                                    handleClosePopup();
                                  }}
                                >
                                  Yes
                                </button>
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                                  onClick={handleClosePopup}
                                >
                                  No
                                </button>
                              </div>
                            </div>
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

export default UpdateByItem;
