import React, { useState, useEffect } from 'react';

const DateComponent = ({ itemName, location, businessId }) => {
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await fetch(
          'https://slicer-backend.vercel.app/api/crud/business/item-location/get-one-recent-date?businessId=' +
            businessId,
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
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <p>Date: {date}</p>
    </div>
  );
};

export default DateComponent;
