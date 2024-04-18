import React, { useEffect } from 'react';

function ItemEstimateDeduction({ businessId, itemName, estimateDeduction }) {
  const requestBody = {
    itemName: itemName
  };

  const getEstimateDeduction = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/estimate-deduction/read?businessId=' +
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
        throw new Error('Failed to fetch item count');
      }
      const data = await response.json();
      const estimateResult = data.output[0];
      console.log(data);
      console.log(estimateResult.estimateDeduction);
      estimateDeduction(itemName, estimateResult);
    } catch (error) {
      console.error('Error fetching item count:', error);
    }
  };

  useEffect(() => {
    getEstimateDeduction(estimateDeduction); // Call the function when component mounts or when itemName or businessId changes
    console.log();
  }, [businessId, itemName]); // Add businessId and itemName as dependencies

  return null; // This component doesn't render anything directly
}

export default ItemEstimateDeduction;
