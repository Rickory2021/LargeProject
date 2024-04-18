import React, { useState, useEffect } from 'react';

const LocationTotal = ({ itemName, location, businessId, setCount }) => {
  const [totalLocationCount, setTotalLocationCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalLocationCount = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/crud/business/item-location/total-location-count?businessId=' +
            businessId,
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
        setCount(count); // Directly pass the count value here
        setLoading(false);
      } catch (error) {
        console.error('Error fetching total location count:', error);
        setLoading(false);
      }
    };

    fetchTotalLocationCount();
  }, [itemName, businessId, location, setCount]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Total Location Count: {totalLocationCount}</p>
    </div>
  );
};

export default LocationTotal;
