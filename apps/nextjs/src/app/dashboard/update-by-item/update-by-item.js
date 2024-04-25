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
import LocationTotal from '../components/LocationTotal';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function UpdateByItem() {
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [largestPortionName, setLargestUnitName] = useState('');
  const [largestPortionNumber, setLargestUnitNumber] = useState('');
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
  const [locationLoad, setLocationLoad] = useState('');

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
  const handleCloseTablePopup = () => {
    setLocationLoad(false);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-location/create?businessId=${businessId}`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-inventory/create?businessId=${businessId}`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-inventory/update-number?businessId=${businessId}`,
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
      console.log(newInventoryItem.newMetaData);
      console.log(newInventoryItem.index);
      console.log(locationName);
      console.log(itemName);
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-inventory/update-metadata?businessId=${businessId}`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-inventory/delete?businessId=${businessId}`,
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

  const fetchUpdatedInventoryList = async () => {
    const requestBody = {
      itemName: itemName,
      locationName: locationName
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-inventory/read-all?businessId=${businessId}`,
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-location/read-all?businessId=${businessId}`,
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
    if (businessId !== '') readAll();
  }, [businessId]);

  const readAll = async () => {
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
        throw new Error('Failed to fetch item names');
      }
      const data = await response.json();
      const fieldValues = data.outputList;

      setItemList(fieldValues);
    } catch (error) {
      console.error('Error fetching item names:', error);
    }
  };

  const upItemCount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/crud/business/item-list/total-item-count?businessId=${businessId}`,
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
                                  setLargestUnitNumber(
                                    item.largestPortionNumber
                                  );
                                  setLargestUnitName(item.largestPortionName);
                                  setLocationLoad(true);
                                  e.stopPropagation();
                                }}
                                type="button"
                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                              >
                                Location
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
                    zIndex: 300,
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
                      width: '80%', // Increased width
                      maxHeight: '80%', // Increased maxHeight
                      maxWidth: '90%',
                      zIndex: 110,
                      position: 'relative',
                      overflowY: 'auto' // Added to allow scrolling if content exceeds maxHeight
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
                    <div className="ml-12">
                      <div className="flex items-center ml-2">
                        <h6 className="mr-auto">Location: </h6>
                        <button
                          onClick={() => handleAddLocationPopup(itemName)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        >
                          Add new location
                        </button>
                      </div>
                      <div className="flex items-center">
                        {locationList && locationList.length > 0 ? (
                          <table className="min-w-full border border-collapse border-gray-300">
                            <thead>
                              <tr>
                                <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Location
                                </th>
                                <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Inventory List
                                </th>
                                <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Location Info
                                </th>
                                <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Location Total Count
                                </th>
                                <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Last Updated
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {locationList.map((location, i) => (
                                <tr key={i}>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {location}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      onClick={() =>
                                        handleLocationPopup(location)
                                      }
                                      type="button"
                                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-transparent text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                                      aria-label={`Info for ${location}`}
                                    >
                                      Inventory List
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      onClick={() =>
                                        handleLocationPopup(location)
                                      }
                                      type="button"
                                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                                      aria-label={`Info for ${location}`}
                                    >
                                      i
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    <LocationTotal
                                      itemName={itemName}
                                      businessId={businessId}
                                      location={location}
                                      unitName={largestPortionName}
                                      unitNumber={largestPortionNumber}
                                    />
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    <DateComponent
                                      itemName={itemName}
                                      location={location}
                                      businessId={businessId}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No locations available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showDropdownMap[location] && (
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <p className="font-bold">Inventory List:</p>
                  <DropdownSelection
                    businessId={businessId}
                    itemName={itemName}
                    onItemSelected={handleItemSelected}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => {
                      setLocationName(location);
                      handleAddInventoryPopup(itemName);
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
                            {item.portionNumber / selectedItem.unitNumber}{' '}
                            {selectedItem.unitName}
                          </p>
                        ) : (
                          <p>portionNumber: {item.portionNumber} Base Units</p>
                        )}
                        <p className="ml-4">Note: {item.metaData}</p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => {
                            setLocationName(location);
                            console.log(index);
                            handleEditInventoryItemPopup(item, index);
                          }}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setLocationName(location);
                            handleDeleteInventoryPopup(location, index);
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
            {popupLocation && (
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
                      <p>Address: {locationMetaData.locationAddress}</p>
                      <p>
                        Notes (MetaData): {locationMetaData.locationMetaData}
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
            )}

            {addLocationPopup && (
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
                onClick={handleClosePopup}
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
                  <h6>Create a new Location: </h6>
                  <p>Location name: </p>
                  <input
                    type="text"
                    name="locationName"
                    value={newLocation.locationName}
                    onChange={e =>
                      handleInputChange(e, 'locationName', 'location')
                    }
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <br />
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
            )}

            {editInventoryItemPopup && (
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
                onClick={handleClosePopup}
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
                  <h6>Edit Inventory Input: </h6>
                  <p>Portion Number: </p>
                  <input
                    type="text"
                    name="newNumber"
                    value={newInventoryItem.newNumber}
                    onChange={e => handleInputChange(e, 'newNumber', 'Item')}
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <p>Note: </p>
                  <input
                    type="text"
                    name="newMetaData"
                    value={newInventoryItem.newMetaData}
                    onChange={e => handleInputChange(e, 'newMetaData', 'Item')}
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
            )}

            {addInventoryPopup && (
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
                onClick={handleClosePopup}
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
                    onChange={e => handleInputChange(e, 'newNumber', 'Item')}
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <p>Note(MetaData): </p>
                  <input
                    type="text"
                    name="newMetaData"
                    value={newInventoryItem.newMetaData}
                    onChange={e => handleInputChange(e, 'newMetaData', 'Item')}
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <p>Log Reason: </p>
                  <input
                    type="text"
                    name="logReason"
                    value={newLocation.logReason}
                    onChange={e => handleInputChange(e, 'logReason', 'Item')}
                    className="bg-gray-100 rounded-md p-2 mb-2"
                  />
                  <br />
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
            )}

            {deleteInventoryPopup && (
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
                onClick={handleClosePopup}
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
                  <br />
                  <p className="max-w-sm text-center">
                    Are you sure you want to delete this Inventory Item?
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
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UpdateByItem;
