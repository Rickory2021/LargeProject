import React, { useEffect } from 'react';

function ItemTotalCount({ businessId, itemName, updateItemCount }) {
  const requestBody = {
    itemName: itemName
  };

  const getItemTotalCount = async () => {
    try {
      const response = await fetch(
        'https://slicer-backend.vercel.app/api/crud/business/item-list/total-item-count?businessId=' +
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
    getItemTotalCount(); // Call the function when component mounts or when itemName or businessId changes
  }, [businessId, itemName]); // Add businessId and itemName as dependencies

  return null; // This component doesn't render anything directly
}

export default ItemTotalCount;
