import React, { useEffect } from 'react';

function itemLocationList({
  businessId,
  itemName,
  locationName,
  setItemLocationList
}) {
  const requestBody = {
    itemName: itemName,
    locationName: locationName
  };

  const getItemLocationList = async () => {
    try {
      const response = await fetch(
        'https://slicer-backend.vercel.app/api/crud/business/item-inventory/read-all?businessId=' +
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
    } catch (error) {
      console.error('Error fetching Item List: ', error);
    }
  };

  useEffect(() => {
    getItemLocationList(); // Call the function when component mounts
  }, []);

  return null; // Return null as this component doesn't render anything
}

export default itemLocationList;
