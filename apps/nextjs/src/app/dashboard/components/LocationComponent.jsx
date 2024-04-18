import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LocationComponent = ({
  itemName,
  businessId,
  locationName,
  maxPortionMap,
  setCount
}) => {
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/crud/business/item-location/total-location-count?businessId=' +
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

        const data = await response.json();
        if (data.outputList && data.outputList.length > 0) {
          const totalCountValue = data.outputList[0];
          setTotalCount(totalCountValue);
          // Calculate the divided count
          setCount(totalCountValue);
          console.log(totalCountValue);
        }
      } catch (error) {
        console.error('Error fetching total location count:', error);
      }
    };

    fetchData();
  }, [itemName, businessId, locationName, maxPortionMap, setCount]);

  return totalCount !== null ? totalCount : <span>Loading...</span>;
};

LocationComponent.propTypes = {
  itemName: PropTypes.string.isRequired,
  businessId: PropTypes.string.isRequired,
  locationName: PropTypes.string.isRequired,
  maxPortionMap: PropTypes.object.isRequired,
  setCount: PropTypes.func.isRequired
};

export default LocationComponent;
