import React, { useEffect } from 'react';

function DistributorPopup({
  businessId,
  distributorName,
  updateDistributorMetaData
}) {
  const requestBody = {
    businessId: businessId
  };

  const getDistributorMetaData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/crud/business/distributor-metadata-list/read-all?businessId=' +
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
        throw new Error('Failed to fetch distributor metadata');
      }
      const data = await response.json();

      // Filter the distributor data based on distributorName
      const distributorData = data.outputList.find(
        distributor => distributor.distributorName === distributorName
      );

      if (!distributorData) {
        throw new Error(`Distributor '${distributorName}' not found`);
      }

      updateDistributorMetaData(distributorData);
    } catch (error) {
      console.error('Error fetching distributor metadata:', error);
    }
  };
  useEffect(() => {
    getDistributorMetaData(); // Call the function when component mounts
  }, []);
}

export default DistributorPopup;
