import React, { useEffect, useState } from 'react';

const DropdownSelection = ({ businessId, itemName, onItemSelected }) => {
  const requestBody = {
    itemName: itemName
  };

  const [portionList, setPortionList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchPortionList = async () => {
    try {
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
        throw new Error('Failed to fetch portion list');
      }
      const data = await response.json();
      if (data.outputList && data.outputList[0].portionInfoList.length > 0) {
        const portionListData = data.outputList[0].portionInfoList;
        setPortionList(portionListData);
        setSelectedItem(null); // set default selected item to null
      }
    } catch (error) {
      console.error('Error fetching portion list:', error);
    }
  };

  const handleSelectChange = e => {
    const selectedUnitName = e.target.value;
    if (selectedUnitName === 'baseUnitsOption') {
      // Reset selected item to null when "Base Units" is selected
      setSelectedItem(null);
      onItemSelected(null); // Pass null or a default value to onItemSelected as needed
    } else {
      const selectedItemData = portionList.find(
        item => item.unitName === selectedUnitName
      );
      setSelectedItem(selectedItemData);
      if (selectedItemData) {
        onItemSelected(selectedItemData); // Pass the selected item data
      }
    }
  };

  useEffect(() => {
    fetchPortionList();
  }, []);

  return (
    <div className="mt-4">
      <label
        htmlFor="itemSelect"
        className="block text-sm font-medium text-gray-700"
      >
        Select a portion size:
      </label>
      <select
        id="itemSelect"
        name="itemSelect"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        onChange={handleSelectChange}
        value={selectedItem ? selectedItem.unitName : 'baseUnitsOption'}
      >
        <option value="baseUnitsOption">Base Units</option>
        {portionList.map((item, index) => (
          <option key={index} value={item.unitName}>
            {item.unitName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelection;
