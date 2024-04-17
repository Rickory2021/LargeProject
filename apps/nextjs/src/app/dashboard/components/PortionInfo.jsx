import React, { useEffect } from 'react';

function PortionInfo({ businessId, itemName, setPortionInfoMap }) {
  console.log(itemName);
  const requestBody = {
    itemName: itemName
  };

  const fetchPortionInfo = async () => {
    try {
      const response = await fetch(
        'https://slicer-backend.vercel.app/api/crud/business/portion-info-list/read-all?businessId=' +
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
        throw new Error('Failed to fetch portion info');
      }
      const data = await response.json();
      const portionInfoList = data.outputList[0]?.portionInfoList || []; // Extract portionInfoList from response data
      return portionInfoList;
    } catch (error) {
      console.error('Error fetching portion info:', error);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    const fetchAndSetPortionInfo = async () => {
      const portionInfoList = await fetchPortionInfo();
      setPortionInfoMap(itemName, portionInfoList);
    };

    fetchAndSetPortionInfo(); // Call the function when component mounts or when itemName or businessId changes
  }, [businessId, itemName]); // Add businessId and itemName as dependencies

  return null; // This component doesn't render anything directly
}

export default PortionInfo;
