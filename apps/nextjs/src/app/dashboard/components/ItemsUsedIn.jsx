import React, { useEffect } from 'react';

function ItemsUsedIn({ businessId, itemName, setItemsUsedIn }) {
  const requestBody = {
    itemName: itemName
  };

  const fetchItemsUsedIn = async () => {
    try {
      const response = await fetch(
        'https://slicer-backend.vercel.app/api/crud/business/item-relation/read-used-in?businessId=' +
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
        throw new Error('Failed to fetch items used in');
      }
      const data = await response.json();
      const usedInList = data.outputList[0]?.usedInList || []; // Extract usedInList from response data
      return usedInList;
    } catch (error) {
      console.error('Error fetching items used in:', error);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    const fetchItemsUsedInAndSetState = async () => {
      const usedInList = await fetchItemsUsedIn();
      setItemsUsedIn(itemName, usedInList);
    };

    fetchItemsUsedInAndSetState(); // Call the function when component mounts or when itemName or businessId changes
  }, [businessId, itemName]); // Add businessId, itemName

  return null; // This component doesn't render anything directly
}

export default ItemsUsedIn;
