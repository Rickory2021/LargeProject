import React, { useState, useEffect } from 'react';

function Distributor({ itemName, businessId, updateDistributorList }) {
  const [loading, setLoading] = useState(true);

  const requestBody = {
    itemName: itemName
  };

  useEffect(() => {
    const getDistributorList = async () => {
      try {
        const response = await fetch(
          'https://slicer-backend.vercel.app/api/crud/business/distributor-item/read-all?businessId=' +
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
        const distributorNames = outputList
          .map(item => item.distributorItemList)
          .flat();
        updateDistributorList(distributorNames);
      } catch (error) {
        console.error('Error fetching Distributor List:', error);
      } finally {
        setLoading(false); // Update loading status when operation completes
      }
    };

    if (itemName && businessId) {
      getDistributorList();
    }
  }, []); // Add dependencies for useEffect

  if (loading) {
    return <p>Loading...</p>;
  }

  return null;
}

export default Distributor;
