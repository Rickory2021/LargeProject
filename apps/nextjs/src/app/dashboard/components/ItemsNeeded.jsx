import React, { useEffect } from 'react';

function ItemsNeeded({ businessId, itemName, setItemsNeeded }) {
  const requestBody = {
    itemName: itemName
  };

  const fetchItemsNeeded = async () => {
    try {
      const response = await fetch(
        'https://slicer-backend.vercel.app/api/crud/business/item-relation/read-needed?businessId=' +
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
        throw new Error('Failed to fetch items needed');
      }
      const data = await response.json();
      const itemNeededList = data.outputList[0]?.itemNeededList || []; // Extract itemNeededList from response data
      return itemNeededList;
    } catch (error) {
      console.error('Error fetching items needed:', error);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    const fetchItemsNeededAndSetState = async () => {
      const itemNeededList = await fetchItemsNeeded();
      setItemsNeeded(itemName, itemNeededList);
    };

    fetchItemsNeededAndSetState(); // Call the function when component mounts or when itemName or businessId changes
  }, [businessId, itemName]); // Add businessId, itemName

  return null; // This component doesn't render anything directly
}

export default ItemsNeeded;
