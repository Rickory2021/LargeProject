import React, { useEffect } from 'react';

function ItemsNeededWrapper({ businessId, itemName, setItemsNeeded }) {
  const requestBody = {
    itemName: itemName
  };

  const fetchItemsNeeded = async () => {
    console.log('here');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-relation/read-needed?businessId=${businessId}`,
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
      const itemNeededList = data.outputList[0]?.itemNeededList || [];
      console.log(`itemNeededList from ITEMSNEEDEDWRAPPER:${itemNeededList}`);
      return itemNeededList;
    } catch (error) {
      console.error('Error fetching items needed:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchItemsNeededAndSetState = async () => {
      const itemNeededList = await fetchItemsNeeded();
      console.log(itemNeededList);
      setItemsNeeded(itemName, itemNeededList);
    };

    fetchItemsNeededAndSetState();
  }, [businessId, itemName]);

  return null; // This component doesn't render anything directly
}

export default ItemsNeededWrapper;
