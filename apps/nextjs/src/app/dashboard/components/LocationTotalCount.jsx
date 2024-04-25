import React, { useEffect, useState } from 'react';

function LocationTotalCount({
  itemName,
  businessId,
  locationName,
  updateLocationInventory
}) {
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const getLocationTotal = async () => {
      try {
        const requestBody = {
          itemName: itemName,
          locationName: locationName
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-inventory/read-all?businessId=${businessId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch Location Inventory total');
        }
        const data = await response.json();
        const inventoryList = data.outputList[0].inventoryList[0];

        // Check if inventoryList is an empty array
        if (Array.isArray(inventoryList) && inventoryList.length === 0) {
          console.log(inventoryList);
          updateLocationInventory(null); // Return null if empty array
        } else {
          updateLocationInventory(locationName, itemName, inventoryList);
        }
      } catch (error) {
        console.error('Error fetching Location Inventory: ', error);
      } finally {
        setLoading(false); // Update loading status when operation completes
      }
    };

    // Check if itemName, businessId, or locationName has changed before fetching data
    if (itemName && businessId && locationName) {
      getLocationTotal();
    }
  }, []); // Add dependencies for useEffect

  // Render loading indicator while fetching data
  if (loading) {
    return <p>Loading...</p>;
  }

  return null;
}

export default LocationTotalCount;
