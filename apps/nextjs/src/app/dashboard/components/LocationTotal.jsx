import React, { useState, useEffect } from 'react';

const LocationTotal = ({
  itemName,
  location,
  businessId,
  unitName,
  unitNumber
}) => {
  const [totalLocationCount, setTotalLocationCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`FROM LOCATIONTOTAL: LOCATION=>${location}=>${location}`);
    const fetchTotalLocationCount = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-location/total-location-count?businessId=${businessId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemName: itemName, locationName: location })
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch total location count');
        }
        const data = await response.json();
        const count = data.outputList[0];
        setTotalLocationCount(count);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching total location count:', error);
        setLoading(false);
      }
    };

    fetchTotalLocationCount();
  }, [itemName, businessId, location]);

  if (loading) {
    return `Loading...`;
  }
  // if (typeof unitNumber === 'undefined' || typeof unitName === 'undefined') {
  //   return (
  //     <p>
  //       Total Location Count: {totalLocationCount}
  //       (unitNumber or unitName is undefined)
  //     </p>
  //   );
  // }

  return `${(totalLocationCount / unitNumber).toFixed(2)} ${unitName}`;
};

export default LocationTotal;
