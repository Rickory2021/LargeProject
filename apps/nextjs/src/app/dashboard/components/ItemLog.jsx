import React, { useState, useEffect } from 'react';

function ItemLog({ itemName, businessId, locationBucket, updateItemLog }) {
  const requestBody = {
    itemName: itemName,
    locationBucket: locationBucket
  };

  const getItemLog = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-location-log/read-all?businessId=${businessId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch item Log');
      }
      const data = await response.json();
      const locationLogs = data.outputList
        .map(item => item.locationLogs)
        .flat(); // flatten the array
      console.log(locationLogs);
      updateItemLog(locationLogs);
    } catch (error) {
      console.error('Error fetching item Log:', error);
    }
  };

  useEffect(() => {
    getItemLog(); // Call the function when component mounts
  }, []);

  return null; // Return null as this component doesn't render anything
}

export default ItemLog;
