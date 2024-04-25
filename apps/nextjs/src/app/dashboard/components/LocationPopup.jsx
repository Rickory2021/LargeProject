import React, { useEffect } from 'react';

function LocationPopup({ locationName, businessId, updataLocationMetaData }) {
  const requestBody = {
    locationName: locationName
  };

  const getLocationMetaData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/location-metadata-list/read-one?businessId=${businessId}`,
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
      const locationData = data.outputList[0];
      console.log(locationData);
      updataLocationMetaData(locationData);
    } catch (error) {
      console.error('Error fetching item names:', error);
    }
  };
  useEffect(() => {
    getLocationMetaData(); // Call the function when component mounts
  }, []);
}

export default LocationPopup;
