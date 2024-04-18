import React, { useState, useEffect } from 'react';

function LargestPortion({ businessId, itemName, updateMaxPortion }) {
  let defaultPortion = {
    unitName: 'N/A',
    unitNumber: 0
  };
  // Use useEffect to fetch max portion and update the state
  useEffect(() => {
    const requestBody = {
      itemName: itemName
    };
    const fetchMaxPortion = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/crud/business/portion-info-list/read-all?businessId=' +
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
          throw new Error('Failed to fetch largest portion');
        }
        const data = await response.json();
        if (data.outputList && data.outputList[0].portionInfoList.length > 0) {
          const portionList = data.outputList[0].portionInfoList;
          let maxUnitNumber = -Infinity;
          let maxUnitIndex = null;
          portionList.forEach((item, index) => {
            if (item.unitNumber > maxUnitNumber) {
              maxUnitNumber = item.unitNumber;
              maxUnitIndex = index;
            }
          });
          // Check if maxUnitIndex is not null before updating
          updateMaxPortion(itemName, portionList[maxUnitIndex]);
        } else {
          // If outputList doesn't exist or is empty, update with null
          updateMaxPortion(itemName, defaultPortion);
        }
      } catch (error) {
        console.error('Error fetching largest portion:', error);
      }
    };

    fetchMaxPortion();
  }, []);
}

export default LargestPortion;
