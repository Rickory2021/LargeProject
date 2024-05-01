'use client';
import React, { useState, useEffect } from 'react';
import SideNav from '../components/side-nav';
import CookieComponent from '../components/CookieComponent';
import ItemTotalCount from '../components/ItemTotalCount';
import LargestPortion from '../components/LargestPortion';
import PortionInfo from '../components/PortionInfo';
import ItemEstimateDeduction from '../components/ItemEstimateDeduction';
import ItemsNeeded from '../components/ItemsNeeded';
import ItemsUsedIn from '../components/ItemsUsedIn';
import Portal from '../components/Portal';
import ItemsNeededWrapper from '../components/ItemsNeededWrapper';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function UpdateByCalculator() {
  const [userId, setUserId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemCountMap, setItemCountMap] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [estimatedDeductionMap, setEstimatedDeductionMap] = useState({});
  const [maxPortionMap, setMaxPortionMap] = useState({});
  const [openPortionInfo, setOpenPortionInfo] = useState(false);
  const [openItemNeeded, setOpenItemNeeded] = useState(false);
  const [openItemUsedIn, setOpenItemUsedIn] = useState(false);
  const [itemPortionMap, setItemPortionMap] = useState([]);
  const [itemsNeededMap, setItemsNeededMap] = useState({});
  const [itemsUsedInMap, setItemsUsedInMap] = useState({});
  const [editPortionInfo, setEditPortionInfo] = useState('');
  const [editInventoryUsedInPopup, setEditInventoryUsedInPopup] = useState('');
  const [editInventoryNeededInPopup, setEditInventoryNeededInPopup] =
    useState('');
  const [clearEstimatePopup, setClearEstimatePopup] = useState('');
  const [index, getIndex] = useState('');
  const [deletePortionPopup, setdeletePortionPopup] = useState('');
  const [deletePopup, setDeletePopup] = useState('');
  const [addPortionPopup, setAddPortionPopup] = useState('');
  useState('');
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [openStates, setOpenStates] = useState({});
  const [makeEstimateByItemNeededPopup, setMakeEstimateByItemNeededPopup] =
    useState('');
  const [makeEstimateByALaCartePopup, setMakeEstimateByALaCartePopup] =
    useState('');
  const [portionInfoLoaded, setPortionInfoLoaded] = useState(false);

  const handleSideNavOpen = openState => {
    setIsSideNavOpen(openState);
    console.log(`openState:${openState}`);
    // Adjust the main page layout based on the open state
    // For example, you can set the left margin of the main page here
  };
  const [addItemConnection, setAddInventoryConnectionPopup] = useState('');
  const [tableKey, setTableKey] = useState(0);

  const [editedInventory, setEditedInventory] = useState({
    rawItemName: '',
    finishedItemName: '',
    newUnitCost: 0
  });

  const [editedPortion, setEditedPortion] = useState({
    itemName: '',
    findUnitName: '',
    newUnitName: '',
    newUnitNumber: 1
  });

  const handleMakeEstimateByItemNeededPopup = () => {
    setMakeEstimateByItemNeededPopup(true);
  };

  const handleMakeEstimateByALaCartePopup = () => {
    setMakeEstimateByALaCartePopup(true);
  };

  const updatedEstimateDeduction = async (
    newEstimateDeduction,
    findItemName
  ) => {
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/estimate-deduction/update?businessId=${businessId}`;

    const payload = {
      newEstimateDeduction: newEstimateDeduction,
      findItemName: findItemName
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST', // or 'POST' depending on your API
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating estimate deduction:', error);
      throw error;
    }
  };

  const getEstimateDeduction = async (businessId, itemName) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/estimate-deduction/read?businessId=${businessId}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ itemName: itemName })
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const estimateDeduction = data.output[0]?.estimateDeduction || 0;

      return estimateDeduction;
    } catch (error) {
      console.error(
        'There was a problem fetching the estimate deduction:',
        error
      );
      return null;
    }
  };

  const estimateByItemNeededCalculator = async () => {
    // Call the wrapper component to handle fetching and updating itemsNeeded
    console.log('Here');
    await (
      <ItemsNeededWrapper
        businessId={businessId}
        itemName={itemName}
        setItemsNeeded={setItemsNeeded}
      />
    );
    console.log('Here');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/estimate-deduction/calculate-estimate?businessId=${businessId}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemName: itemName,
        quantity: editedPortion.newUnitNumber
      })
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // const estimateDeduction = data.output[0]?.estimateDeduction || 0;
      await readAll();
      // return estimateDeduction;
    } catch (error) {
      console.error(
        'There was a problem fetching the estimate deduction:',
        error
      );
      return null;
    }
  };

  const estimateByALaCarteCalculator = async () => {
    // Fetch estimateDeduction
    const estimateDeduction = await getEstimateDeduction(businessId, itemName);
    // Calculate result
    const result = editedPortion.newUnitNumber * -1 + estimateDeduction;
    updatedEstimateDeduction(result, itemName);
    // Print result to console
    console.log(`Result for ${itemName}: ${result}`);
    readAll();
  };

  const handleCloseTablePopup = () => {
    setOpenStates(prevStates => ({
      ...prevStates,
      [itemName]: !prevStates[itemName]
    }));

    setOpenItemUsedIn(false);
    setOpenItemNeeded(false);
    setOpenPortionInfo(false);
  };
  const handleClosePopup = () => {
    setEditInventoryUsedInPopup(false);
    setdeletePortionPopup(false);
    setAddInventoryConnectionPopup(false);
    setEditPortionInfo(false);
    setClearEstimatePopup(false);
    setDeletePopup(false);
    setAddPortionPopup(false);
    setEditInventoryNeededInPopup(false);
    setMakeEstimateByItemNeededPopup(false);
    setMakeEstimateByALaCartePopup(false);
    setTableKey(prevKey => prevKey + 1);
  };

  const handleAddInventory = item => {
    setAddInventoryConnectionPopup(item);
  };

  const handleAddPortion = () => {
    setAddPortionPopup(true);
  };

  const handleInputChange = (event, name, type) => {
    const value = event.target.value;
    if (type === 'usedIn') {
      setEditedInventory(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else if (type == 'portion') {
      setEditedPortion(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  const updateEstimateDeduction = (itemName, newEstimatedDeduction) => {
    setEstimatedDeductionMap(prevState => ({
      ...prevState,
      [itemName]: newEstimatedDeduction
    }));
  };

  const handleButtonClick = (itemName, index, action) => {
    getItemName(itemName);
    switch (action) {
      case 'openPortionInfo':
        setOpenPortionInfo(true);
        setOpenItemNeeded(false);
        setOpenItemUsedIn(false);
        break;
      case 'openItemNeeded':
        setOpenItemNeeded(true);
        setOpenPortionInfo(false);
        setOpenItemUsedIn(false);
        break;
      case 'openItemUsedIn':
        setOpenItemUsedIn(true);
        setOpenPortionInfo(false);
        setOpenItemNeeded(false);
        break;
      default:
        break;
    }
  };

  const handleDeleteItemsUsed = () => {
    setdeletePortionPopup(true);
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
    setItemPortionMap(prevState => {
      console.log('Previous state:', prevState);

      if (
        JSON.stringify(prevState[itemName]) !== JSON.stringify(newPortionInfo)
      ) {
        const newState = {
          ...prevState,
          [itemName]: newPortionInfo
        };
        console.log('New state:', newState);
        return newState;
      }
      return prevState;
    });
  };

  const updateItemsUsedIn = (itemName, newItemsUsedIn) => {
    setItemsUsedInMap(prevState => ({
      ...prevState,
      [itemName]: newItemsUsedIn
    }));
  };

  const handleDeletePortion = item => {
    setEditedPortion({
      itemName: itemName,
      findUnitName: item.unitName
    });
    setDeletePopup(true);
  };

  const updateItem = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-relation/update-unit-cost?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rawItemName: editedInventory.rawItemName,
            finishedItemName: editedInventory.finishedItemName,
            newUnitCost: editedInventory.newUnitCost
          })
        }
      );
      if (!response.ok) {
        console.error('Failed to update item: ' + Error);
      }
      // Fetch the updated data after a successful update
      await fetchItem();
    } catch (error) {
      'Failed to update item: ' + error;
    }
  };

  const updateItemNeeded = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-relation/update-unit-cost?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rawItemName: editedInventory.rawItemName,
            finishedItemName: editedInventory.finishedItemName,
            newUnitCost: editedInventory.newUnitCost
          })
        }
      );
      if (!response.ok) {
        console.error('Failed to update item: ' + Error);
      }
      // Fetch the updated data after a successful update
      await fetchItemNeeded();
    } catch (error) {
      'Failed to update item: ' + error;
    }
  };

  const updatePortion = async () => {
    try {
      const response1 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/portion-info-list/update-name?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: editedPortion.itemName,
            findUnitName: editedPortion.findUnitName,
            newUnitName: editedPortion.newUnitName
          })
        }
      );
      if (!response1.ok) {
        console.error('Failed to update portion name: ' + Error);
      }
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/portion-info-list/update-number?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: editedPortion.itemName,
            findUnitName: editedPortion.newUnitName,
            newUnitNumber: editedPortion.newUnitNumber
          })
        }
      );
      if (!response2.ok) {
        console.error('Failed to update unitnumber: ' + Error);
      }
      await fetchNewPortion();
    } catch (error) {
      'Failed to update portion: ' + error;
    }
  };

  const fetchNewPortion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/portion-info-list/read-all?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemName: itemName })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch portion info');
      }

      const data = await response.json();
      const portionInfoList = data.outputList[0]?.portionInfoList || [];

      // Update the state
      updatePortionInfo(itemName, portionInfoList);
    } catch (error) {
      console.error('Error fetching new portion list: ', error);
    }
  };

  const addNewPortion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/portion-info-list/create?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: editedPortion.itemName,
            unitName: editedPortion.newUnitName,
            unitNumber: editedPortion.newUnitNumber
          })
        }
      );
      if (!response.ok) {
        console.error('Failed to create portion: ' + Error);
      }
      await fetchNewPortion();
    } catch (error) {
      'Failed to create portion: ' + error;
    }
  };

  const addNewItemConnection = async () => {
    console.log(editedInventory.rawItemName);
    console.log(editedInventory.finishedItemName);
    console.log(editedInventory.newUnitCost);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-relation/create?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rawItemName: editedInventory.rawItemName,
            finishedItemName: editedInventory.finishedItemName,
            unitCost: editedInventory.newUnitCost
          })
        }
      );
      if (!response.ok) {
        console.error('Failed to create item: ' + Error);
      }
      // Fetch the updated data after a successful update
      await fetchItem();
      await fetchItemNeeded();
    } catch (error) {
      'Failed to create item: ' + error;
    }
  };

  const deleteItemConnection = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-relation/delete?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rawItemName: editedInventory.rawItemName,
            finishedItemName: editedInventory.finishedItemName
          })
        }
      );

      if (!response.ok) {
        console.error('Failed to delete item connection: ' + Error);
      }

      // Fetch the updated data after a successful deletion
      await fetchItem();
      await fetchItemNeeded();
    } catch (error) {
      console.error('Failed to delete item connection: ' + error);
    }
  };

  const deletePortion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/portion-info-list/delete?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: editedPortion.itemName,
            unitName: editedPortion.findUnitName
          })
        }
      );

      if (!response.ok) {
        console.error('Failed to delete portion: ' + Error);
      }
      await fetchNewPortion();
    } catch (error) {
      console.error('Failed to delete portion: ' + error);
    }
  };

  const fetchItem = async () => {
    console.log(itemName);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-relation/read-used-in?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName
          })
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch ItemList: ' + Error);
      }
      const data = await response.json();
      const usedInList = data.outputList[0]?.usedInList || []; // Extract usedInList from response data
      setItemsUsedInMap(prevState => ({
        ...prevState,
        [itemName]: usedInList
      }));
    } catch (error) {
      'Failed to fetch ItemList: ' + error;
    }
  };

  const fetchItemNeeded = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-relation/read-needed?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName
          })
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch ItemList: ' + Error);
      }
      const data = await response.json();
      const usedInList = data.outputList[0]?.itemNeededList || []; // Extract usedInList from response data
      setItemsNeededMap(prevState => ({
        ...prevState,
        [itemName]: usedInList
      }));
    } catch (error) {
      'Failed to fetch ItemList: ' + error;
    }
  };

  const updateMaxPortionForItem = (itemName, newMaxPortion) => {
    setMaxPortionMap(prevState => ({
      ...prevState,
      [itemName]: newMaxPortion
    }));
  };

  const getBusinessId = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/auth/user/user-info?id=${userId}`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-list/read-all/?businessId=${businessId}`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-list/read-all/?businessId=${businessId}`,
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

  const clearEstimate = async itemName => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/estimate-deduction/update/?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            findItemName: itemName,
            newEstimateDeduction: 0
          })
        }
      );
      if (!response.ok) {
        throw new Error('Failed to clear estimate');
      }
      readAll();
    } catch (error) {
      console.error('Error fetching item names:', error);
    }
  };

  const handleEditInventoryUsedPopup = item => {
    setEditedInventory({
      rawItemName: itemName,
      finishedItemName: item.itemName,
      newUnitCost: item.unitCost
    });
    setEditInventoryUsedInPopup(true);
  };

  const handleEditInventoryNeededPopup = item => {
    setEditedInventory({
      rawItemName: item.itemName,
      finishedItemName: itemName,
      newUnitCost: item.unitCost
    });
    setEditInventoryNeededInPopup(true);
  };

  const handleEditPortionPopup = item => {
    setEditedPortion({
      itemName: itemName,
      newUnitName: item.unitName,
      newUnitNumber: item.unitNumber,
      findUnitName: item.unitName
    });
    setEditPortionInfo(true);
  };

  const handleClearEstimatePopup = itemName => {
    setItemName(itemName);
    setClearEstimatePopup(true);
  };

  useEffect(() => {
    console.log('here');
  }, [fetchNewPortion]);

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
          <div>
            <h2 className="text-2xl font-bold text-center mb-4 border-b border-gray-700">
              Update By Calculator
            </h2>

            <ul>
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
                            Clear Estimate
                          </th>
                          <th
                            scope="col"
                            className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                          >
                            Portion Info
                          </th>
                          <th
                            scope="col"
                            className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                          >
                            Items Needed
                          </th>
                          <th
                            scope="col"
                            className="px-8 py-4 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 w-[20%]"
                          >
                            Items Used
                          </th>
                          <th
                            scope="col"
                            className="px-8 py-4 text-center text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 border-l border-b"
                            colSpan="2"
                          >
                            Make Estimate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {itemList !== undefined &&
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
                                      item.totalCount /
                                      item.largestPortionNumber
                                    ).toFixed(2)
                                  : 'No'}{' '}
                                {item.largestPortionName &&
                                item.totalCount &&
                                item.largestPortionNumber
                                  ? item.largestPortionName
                                  : `Details`}
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
                                  : `Details`}
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                                <button
                                  onClick={() => {
                                    setItemName(item.itemName);
                                    handleClearEstimatePopup(item.itemName);
                                  }}
                                  type="button"
                                  className="inline-flex items-center justify-center w-50 h-6 rounded-full border border-red-500 shadow-sm bg-white text-sm text-red-500 hover:bg-red-50 hover:text-red-700 focus:outline-none"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                  </svg>
                                  Clear Estimate
                                </button>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                                <button
                                  onClick={e => {
                                    setItemName(item.itemName);
                                    setOpenPortionInfo(true);
                                    e.stopPropagation();
                                  }}
                                  type="button"
                                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                                >
                                  Portion Info
                                </button>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                                <button
                                  onClick={e => {
                                    handleButtonClick(
                                      item.itemName,
                                      index,
                                      'openItemNeeded'
                                    );
                                    e.stopPropagation();
                                  }}
                                  type="button"
                                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                                >
                                  Items Needed
                                </button>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                                <button
                                  onClick={e => {
                                    handleButtonClick(
                                      item.itemName,
                                      index,
                                      'openItemUsedIn'
                                    );
                                    e.stopPropagation();
                                  }}
                                  type="button"
                                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                                >
                                  UsedIn
                                </button>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 border-l w-[20%]">
                                <button
                                  onClick={e => {
                                    setItemName(item.itemName);
                                    handleMakeEstimateByItemNeededPopup();
                                    e.stopPropagation();
                                  }}
                                  type="button"
                                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                                >
                                  By Items Needed Info
                                </button>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 w-[20%]">
                                <button
                                  onClick={e => {
                                    setItemName(item.itemName);
                                    handleMakeEstimateByALaCartePopup();
                                    e.stopPropagation();
                                  }}
                                  type="button"
                                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 w-[20%]"
                                >
                                  By A La Carte
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {openPortionInfo && (
                <div>
                  <PortionInfo
                    businessId={businessId}
                    itemName={itemName}
                    setPortionInfoMap={updatePortionInfo}
                  />
                  <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm z-50">
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
                          Selected portion size:
                        </h6>
                        <button
                          onClick={e => {
                            setEditedPortion({
                              itemName: itemName
                            });
                            handleAddPortion();
                            e.stopPropagation();
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                        >
                          Add portion size
                        </button>
                        <table className="min-w-full border border-collapse border-gray-300">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit Name
                              </th>
                              <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit Number
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
                            {itemPortionMap[itemName] &&
                              itemPortionMap[itemName].map((portion, index) => (
                                <tr key={portion.id || index}>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {portion.unitName}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {portion.unitNumber}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                      onClick={e => {
                                        handleEditPortionPopup(portion);
                                        e.stopPropagation();
                                      }}
                                      aria-label={`Edit ${portion.unitName}`}
                                    >
                                      Edit
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                      onClick={e => {
                                        handleDeletePortion(portion);
                                        e.stopPropagation();
                                      }}
                                      aria-label={`Delete ${portion.unitName}`}
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
                </div>
              )}

              {openItemNeeded && (
                <div>
                  <ItemsNeeded
                    businessId={businessId}
                    itemName={itemName}
                    setItemsNeeded={setItemsNeeded}
                    onEditItem={() => {
                      fetchItemNeeded();
                    }}
                  />

                  <div
                    onClick={handleCloseTablePopup}
                    className="fixed top-0 left-0 w-full h-full backdrop-blur-sm z-50"
                  >
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
                      <div
                        className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm"
                        style={{
                          width: '40%',
                          maxHeight: '70%',
                          maxWidth: '90%'
                        }}
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
                        <h6 className="text-center mb-4">
                          Items {itemName} needs:
                        </h6>
                        <button
                          onClick={e => {
                            setEditedInventory({
                              rawItemName: '',
                              finishedItemName: itemName,
                              newUnitCost: ''
                            });
                            handleAddInventory(itemName);
                            e.stopPropagation();
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                        >
                          Add item connection
                        </button>
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
                            {itemsNeededMap[itemName] &&
                              itemsNeededMap[itemName].map((item, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {item.itemName}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {item.unitCost}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      onClick={e => {
                                        handleEditInventoryNeededPopup(item);
                                        e.stopPropagation();
                                      }}
                                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                      Edit
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      onClick={e => {
                                        setEditedInventory({
                                          rawItemName: item.itemName,
                                          finishedItemName: itemName,
                                          newUnitCost: item.unitCost
                                        });
                                        handleDeleteItemsUsed();
                                        e.stopPropagation();
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
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {openItemUsedIn && (
                <div>
                  <ItemsUsedIn
                    key={
                      itemsUsedInMap[itemName]
                        ? itemsUsedInMap[itemName].length
                        : 0
                    }
                    businessId={businessId}
                    itemName={itemName}
                    setItemsUsedIn={updateItemsUsedIn}
                    onEditItem={() => {
                      fetchItem;
                    }}
                  />

                  {/* Full-screen overlay with blur effect */}
                  <div
                    onClick={handleCloseTablePopup}
                    className="fixed top-0 left-0 w-full h-full backdrop-blur-sm z-50"
                  >
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
                          Items {itemName} is used in:
                        </h6>
                        <button
                          onClick={e => {
                            setEditedInventory({
                              rawItemName: itemName,
                              finishedItemName: '',
                              newUnitCost: ''
                            });
                            handleAddInventory(itemName);
                            e.stopPropagation();
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                        >
                          Add Item Connection
                        </button>
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
                            {itemsUsedInMap[itemName] &&
                              itemsUsedInMap[itemName].map((item, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {item.itemName}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {item.unitCost}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      onClick={e => {
                                        handleEditInventoryUsedPopup(item);
                                        e.stopPropagation();
                                      }}
                                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                      Edit
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 border-b border-gray-300 whitespace-nowrap text-center">
                                    <button
                                      onClick={e => {
                                        setEditedInventory({
                                          rawItemName: itemName,
                                          finishedItemName: item.itemName,
                                          newUnitCost: item.unitCost
                                        });
                                        handleDeleteItemsUsed();
                                        e.stopPropagation();
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
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {editInventoryUsedInPopup && (
                <Portal>
                  <div>
                    <div
                      style={{
                        position: 'fixed', // Add absolute positioning
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1000, // Increase the z-index value
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: 'blur(4px)' // Optional: Add a blur effect
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      {' '}
                      {/* Increased z-index to 150 */}
                      <div
                        className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150"
                        style={{
                          width: '40%',
                          maxHeight: '70%',
                          maxWidth: '90%',
                          zIndex: 110, // Increase the z-index value
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
                          Edit Item Connection(Item Cost Only):{' '}
                        </h6>
                        <p className="text-center mb-2">
                          Selected Item (with which {itemName} is used in):{' '}
                        </p>
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
                          name="newUnitCost"
                          value={editedInventory.newUnitCost}
                          onChange={e =>
                            handleInputChange(e, 'newUnitCost', 'usedIn')
                          }
                          className="bg-gray-200 rounded-md p-2 mb-2"
                        />
                        <br />
                        <button
                          onClick={() => {
                            updateItem();
                            handleClosePopup();
                            handleCloseTablePopup();
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Portal>
              )}
              {editInventoryNeededInPopup && (
                <Portal>
                  <div>
                    <div
                      style={{
                        position: 'fixed', // Add absolute positioning
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1000, // Increase the z-index value
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: 'blur(4px)' // Optional: Add a blur effect
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      {' '}
                      {/* Increased z-index to 150 */}
                      <div
                        className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150"
                        style={{
                          width: '40%',
                          maxHeight: '70%',
                          maxWidth: '90%',
                          zIndex: 110, // Increase the z-index value
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
                          Edit Item Connection(Item Cost Only):{' '}
                        </h6>
                        <p className="text-center mb-2">
                          Item used in {itemName}:{' '}
                        </p>
                        <input
                          type="text"
                          name="newNumber"
                          value={editedInventory.rawItemName}
                          readOnly
                          className="bg-gray-200 rounded-md p-2 mb-2"
                        />
                        <p className="text-center mb-2">Unit Cost: </p>
                        <input
                          type="text"
                          name="newUnitCost"
                          value={editedInventory.newUnitCost}
                          onChange={e =>
                            handleInputChange(e, 'newUnitCost', 'usedIn')
                          }
                          className="bg-gray-200 rounded-md p-2 mb-2"
                        />
                        <br />
                        <button
                          onClick={() => {
                            updateItemNeeded();
                            handleClosePopup();
                            handleCloseTablePopup();
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Portal>
              )}
              {deletePortionPopup && (
                <Portal>
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
                            deleteItemConnection();
                            handleClosePopup();
                            handleCloseTablePopup();
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
                </Portal>
              )}
              {addItemConnection && (
                <Portal>
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
                        Add new Item Connection:{' '}
                      </h6>
                      <p className="text-center mb-2">Raw Item Component: </p>
                      <input
                        type="text"
                        name="rawItemName"
                        value={editedInventory.rawItemName}
                        onChange={e =>
                          handleInputChange(e, 'rawItemName', 'usedIn')
                        }
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <p className="text-center mb-2">Finished Item: </p>
                      <input
                        type="text"
                        name="finishedItemName"
                        value={editedInventory.finishedItemName}
                        onChange={e =>
                          handleInputChange(e, 'finishedItemName', 'usedIn')
                        }
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <p className="text-center mb-2">
                        Unit cost (how much the finished item needs of the raw
                        item to make):{' '}
                      </p>
                      <input
                        type="text"
                        name="newUnitCost"
                        value={editedInventory.newUnitCost}
                        onChange={e =>
                          handleInputChange(e, 'newUnitCost', 'usedIn')
                        }
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <br />
                      <button
                        onClick={() => {
                          addNewItemConnection();
                          handleClosePopup();
                          handleCloseTablePopup();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Portal>
              )}
              {editPortionInfo && (
                <Portal>
                  <div>
                    <div
                      style={{
                        position: 'fixed', // Add absolute positioning
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1000, // Increase the z-index value
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: 'blur(4px)' // Optional: Add a blur effect
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      {' '}
                      {/* Increased z-index to 150 */}
                      <div
                        className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150"
                        style={{
                          width: '40%',
                          maxHeight: '70%',
                          maxWidth: '90%',
                          zIndex: 110, // Increase the z-index value
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
                          Edit Portion Size:{' '}
                        </h6>
                        <p className="text-center mb-2">Item: </p>
                        <input
                          type="text"
                          name="itemName"
                          value={editedPortion.itemName}
                          readOnly
                          className="bg-gray-200 rounded-md p-2 mb-2"
                        />
                        <p className="text-center mb-2">Selection Portion: </p>
                        <input
                          type="text"
                          name="newUnitName"
                          value={editedPortion.newUnitName}
                          onChange={e =>
                            handleInputChange(e, 'newUnitName', 'portion')
                          }
                          className="bg-gray-200 rounded-md p-2 mb-2"
                        />
                        <p className="text-center mb-2">Units: </p>
                        <input
                          type="text"
                          name="newUnitNumber"
                          value={editedPortion.newUnitNumber}
                          onChange={e =>
                            handleInputChange(e, 'newUnitNumber', 'portion')
                          }
                          className="bg-gray-200 rounded-md p-2 mb-2"
                        />
                        <br />
                        <button
                          onClick={() => {
                            updatePortion();
                            handleClosePopup();
                            handleCloseTablePopup();
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Portal>
              )}
              {deletePopup && (
                <Portal>
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
                        Are you sure you want to delete this portion size?
                      </h6>
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            handleClosePopup();
                            handleCloseTablePopup();
                            deletePortion();
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
                </Portal>
              )}
              {addPortionPopup && (
                <Portal>
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
                        Add new portion size:{' '}
                      </h6>
                      <p className="text-center mb-2">Item Name: </p>
                      <input
                        type="text"
                        name="rawItemName"
                        value={editedPortion.itemName}
                        readOnly
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <p className="text-center mb-2">Unit name: </p>
                      <input
                        type="text"
                        name="newUnitName"
                        value={editedPortion.newUnitName}
                        onChange={e =>
                          handleInputChange(e, 'newUnitName', 'portion')
                        }
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <p className="text-center mb-2">Unit Number: </p>
                      <input
                        type="text"
                        name="newUnitNumber"
                        value={editedPortion.newUnitNumber}
                        onChange={e =>
                          handleInputChange(e, 'newUnitNumber', 'portion')
                        }
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <br />
                      <button
                        onClick={() => {
                          addNewPortion();
                          handleClosePopup();
                          handleCloseTablePopup();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Portal>
              )}
              {makeEstimateByItemNeededPopup && (
                <Portal>
                  <ItemsNeeded
                    businessId={businessId}
                    itemName={itemName}
                    setItemsNeeded={setItemsNeeded}
                    onEditItem={() => {
                      fetchItemNeeded();
                    }}
                  />
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
                      backdropFilter: 'blur(4px)',
                      overflowY: 'auto' // Add this line to enable vertical scrolling
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div
                      className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150"
                      style={{
                        width: '40%',
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
                        Calculator By Item Needed:
                      </h6>
                      <p className="text-center mb-2">Item Name: </p>
                      <input
                        type="text"
                        name="itemName"
                        value={itemName}
                        readOnly
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <p className="text-center mb-2">
                        Input the item number(number of items sold/used):
                      </p>
                      <input
                        type="text"
                        name="newUnitName"
                        value={editedPortion.newUnitNumber}
                        onChange={e =>
                          handleInputChange(e, 'newUnitNumber', 'portion')
                        }
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <br />
                      {itemsNeededMap[itemName] &&
                      itemsNeededMap[itemName].length !== 0 ? (
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
                                Estimated Deduction Unit
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {itemsNeededMap[itemName] &&
                              itemsNeededMap[itemName].map((item, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {item.itemName}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {item.unitCost}
                                  </td>
                                  <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                    {(
                                      item.unitCost *
                                      editedPortion.newUnitNumber
                                    ).toFixed(3)}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>----------</p>
                      )}
                      <button
                        onClick={() => {
                          estimateByItemNeededCalculator();
                          handleClosePopup();
                          handleCloseTablePopup();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <br />
                    </div>
                  </div>
                </Portal>
              )}
              {makeEstimateByALaCartePopup && (
                <Portal>
                  <PortionInfo
                    businessId={businessId}
                    itemName={itemName}
                    setPortionInfoMap={updatePortionInfo}
                  />
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
                      backdropFilter: 'blur(4px)',
                      overflowY: 'auto' // Add this line to enable vertical scrolling
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div
                      className="bg-white p-8 rounded-md border border-gray-300 relative text-center backdrop-filter backdrop-blur-sm z-150"
                      style={{
                        width: '40%',
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
                        Calculator By A La Carte:
                      </h6>
                      <p className="text-center mb-2">Item Name: </p>
                      <input
                        type="text"
                        name="itemName"
                        value={itemName}
                        readOnly
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />
                      <p className="text-center mb-2">
                        Update Estimate by:<br></br>
                        Positive will Increase Estimated <br></br>
                        Negative will Decrease Estimated <br></br>
                      </p>
                      <input
                        type="text"
                        name="newUnitName"
                        value={editedPortion.newUnitNumber}
                        onChange={e =>
                          handleInputChange(e, 'newUnitNumber', 'portion')
                        }
                        className="bg-gray-200 rounded-md p-2 mb-2"
                      />

                      <br />
                      <button
                        onClick={() => {
                          estimateByALaCarteCalculator();
                          handleClosePopup();
                          handleCloseTablePopup();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
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
                        Selected portion size:
                      </h6>
                      <button
                        onClick={e => {
                          setEditedPortion({
                            itemName: itemName
                          });
                          handleAddPortion();
                          e.stopPropagation();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                      >
                        Add portion size
                      </button>
                      <table className="min-w-full border border-collapse border-gray-300">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit Name
                            </th>
                            <th className="px-6 py-3 border-r border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Based Unit Number
                            </th>
                            <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Net
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {itemPortionMap[itemName] &&
                          itemPortionMap[itemName].length !== 0 ? (
                            itemPortionMap[itemName].map((portion, index) => (
                              <tr key={portion.id || index}>
                                <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                  {portion.unitName}
                                </td>
                                <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                  {portion.unitNumber}
                                </td>
                                <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                  {(editedPortion.newUnitNumber /
                                    portion.unitNumber >=
                                  0
                                    ? '+' // Add "+" sign if the result is positive
                                    : '') + // Empty string if the result is negative
                                    (
                                      editedPortion.newUnitNumber /
                                      portion.unitNumber
                                    ).toFixed(3)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                {`Unit`}
                              </td>
                              <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                {1}
                              </td>
                              <td className="px-6 py-4 border-r border-b border-gray-300 whitespace-nowrap text-center">
                                {(editedPortion.newUnitNumber >= 0
                                  ? '+' // Add "+" sign if the result is positive
                                  : '') + // Empty string if the result is negative
                                  (editedPortion.newUnitNumber / 1).toFixed(3)}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <br />
                    </div>
                  </div>
                </Portal>
              )}
              {clearEstimatePopup && (
                <Portal>
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
                        Are you sure you want to Clear Estimate?
                      </h6>
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            handleClosePopup();
                            clearEstimate(itemName);
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
                </Portal>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateByCalculator;
