import React, { useEffect } from 'react';

function Location({ itemName, businessId, updateLocationList }) {
  const requestBody = {
    itemName: itemName
  };

  const getLocationList = async () => {
    try {
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
      updateLocationList(locationNames);
    } catch (error) {
      console.error('Error fetching item names:', error);
    }
  };
  useEffect(() => {
    getLocationList(); // Call the function when component mounts
  }, []);
}

export default Location;
