import React, { useEffect } from 'react';

function Location({ itemName, businessId, updateLocationList }) {
  const requestBody = {
    itemName: itemName
  };

  const getLocationList = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-location/read-all?businessId=${businessId}`,
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
      console.log(`locationNames:${locationNames}`);
      updateLocationList(locationNames);
    } catch (error) {
      console.error('No locations exist:', error);
    }
  };
  useEffect(() => {
    getLocationList(); // Call the function when component mounts
  }, []);
}

export default Location;
