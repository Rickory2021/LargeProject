import React, { useEffect, useState } from 'react';

function PortionInfo({ businessId, itemName, setPortionInfoMap }) {
  const [loading, setLoading] = useState(true);
  const [portionInfoList, setPortionInfoList] = useState([]);

  const fetchPortionInfo = async () => {
    try {
      const requestBody = {
        itemName: itemName
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/crud/business/portion-info-list/read-all?businessId=${businessId}`,
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
      const fetchedPortionInfoList = data.outputList[0]?.portionInfoList || [];
      return fetchedPortionInfoList;
    } catch (error) {
      console.error('Error fetching portion info:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPortionInfoList = await fetchPortionInfo();
        setPortionInfoList(fetchedPortionInfoList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, itemName]); // Dependencies for useEffect

  useEffect(() => {
    // Pass the fetched portionInfoList to the parent component
    setPortionInfoMap(itemName, portionInfoList);
  }, [portionInfoList, itemName, setPortionInfoMap]); // Dependencies for useEffect

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
}

export default PortionInfo;
