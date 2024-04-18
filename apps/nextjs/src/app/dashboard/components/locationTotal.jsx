import React, { useState, useEffect } from 'react';

function locationTotal({ itemName, locationName, businessId, maxPortionMap }) {
  const [totalCount, setTotalCount] = useState(null);

  const getlocationTotal = async () => {
    try {
      const response = await fetch(
        'https://slicer-backend.vercel.app/api/crud/business/item-location/total-location-count?businessId=' +
          businessId,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: itemName,
            locationName: locationName
          })
        }
      );

      if (!response.ok) {
        console.error(
          'error fetching location total count:',
          response.statusText
        );
        return;
      }

      const data = await response.json();
      const totalCountFromApi = data.outputList[0]; // Extract the number from outputList array
      setTotalCount(totalCountFromApi);
    } catch (error) {
      console.error('error fetching location total count:', error);
    }
  };

  useEffect(() => {
    getlocationTotal();
  }, [itemName, locationName, businessId]);

  return (
    <>
      <p className="m-8">
        Total Count:{' '}
        {maxPortionMap[itemName] && totalCount ? totalCount : 'Loading...'}{' '}
        {maxPortionMap[itemName] && maxPortionMap[itemName].unitName}
      </p>
    </>
  );
}

export default locationTotal;
