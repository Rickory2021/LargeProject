import React, { useState, useEffect } from 'react';

const DateComponent = ({ itemName, location, businessId }) => {
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log({ itemName, location }); // Logging both itemName and location

    const fetchDate = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/item-location/get-one-recent-date?businessId=${businessId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              itemName: itemName,
              locationName: location
            })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch date');
        }

        const data = await response.json();
        const outputList = data.outputList;
        console.log(outputList);

        if (outputList && outputList.length > 0) {
          const dateOnly = new Date(outputList[0]).toLocaleDateString();
          setDate(dateOnly);
        } else {
          throw new Error('Date not found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDate();
  }, [itemName, location, businessId]); // Added location to the dependency array

  if (loading) {
    return `Loading...`;
  }

  if (error) {
    return `No Recent Date Found`; // Display itemName and location in the error message
  }

  return date;
};

export default DateComponent;
