'use client';
import { SideNav } from '@repo/ui/side-nav';
import CookieComponent from '../components/CookieComponent';
import React from 'react';
import { useState, useEffect } from 'react';

export function Inventory() {
  const [userId, setUserId] = useState(null);
  const [businessId, setbusinessId] = useState('');
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  // Function to handle userId change
  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const addItem = async () => {
    console.log(
      'http://localhost:3001/api/crud/business/item-list/create?businessId=' +
        businessId +
        '&itemName=' +
        name
    );
    const response = await fetch(
      'http://localhost:3001/api/crud/business/item-list/create?businessId=' +
        businessId +
        '&itemName=' +
        name,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      console.log('create works!');
    }
  };

  const searchItem = async () => {
    console.log(
      'http://localhost:3001/api/crud/business/item-list/read-one/?businessId=' +
        businessId +
        '&itemName=' +
        name
    );

    const response = await fetch(
      'http://localhost:3001/api/crud/business/item-list/read-one/?businessId=' +
        businessId +
        '&itemName=' +
        name,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      console.log('read works!');
    }
  };

  const updateItem = async () => {
    console.log(
      'http://localhost:3001/api/crud/business/item-list/update?businessId=' +
        businessId +
        '&findItemName=' +
        name +
        '&newItemName=' +
        newName
    );

    const response = await fetch(
      'http://localhost:3001/api/crud/business/item-list/update?businessId=' +
        businessId +
        '&findItemName=' +
        name +
        '&newItemName=' +
        newName,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      console.log('update works!');
    }
  };

  const deleteItem = async () => {
    console.log(
      'http://localhost:3001/api/crud/business/item-list/delete?businessId=' +
        businessId +
        '&itemName=' +
        name
    );
    const response = await fetch(
      'http://localhost:3001/api/crud/business/item-list/delete?businessId=' +
        businessId +
        '&itemName=' +
        name,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      console.log('delete works!');
    }
  };

  const getBusinessId = async () => {
    console.log(userId);
    const response = await fetch(
      'http://localhost:3001/api/auth/user/user-info?id=' + userId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      const { businessIdList } = responseData;
      return { businessIdList };
    } else {
      //nothing returned (wont happen with how api is setup but just in case)
      console.log('error');
      const errorData = await response.json();
      return null;
    }
  };

  useEffect(() => {
    getBusinessId().then(data => {
      console.log('Business: ', data.businessIdList[0]);
      setbusinessId(data.businessIdList[0]);
    });
  });

  return (
    <div className="w-full h-screen grid grid-cols-[min-content_auto] grid-rows-[5fr_1fr]">
      <CookieComponent
        cookieName={'accessToken'}
        onUserIdChange={handleUserIdChange}
      />
      <div className="bg-green-500">
        <SideNav />
      </div>
      <div className="flex justify-center flex-col items-center">
        {businessId}
        <label>Insert Item- </label>
        <label>Item name: </label>
        <input
          className="border-2 bg-black-500 w-300px h-50px text-lg"
          type="text"
          onChange={event => {
            setName(event.target.value);
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={addItem}
        >
          Add item
        </button>

        <label>Item name: </label>
        <input
          className="border-2 bg-black-500 w-300px h-50px text-lg"
          type="text"
          onChange={event => {
            setName(event.target.value);
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={searchItem}
        >
          search for item
        </button>

        <label>Current Item name: </label>
        <input
          className="border-2 bg-black-500 w-300px h-50px text-lg"
          type="text"
          onChange={event => {
            setName(event.target.value);
          }}
        />
        <label>Name to replace with: </label>
        <input
          className="border-2 bg-black-500 w-300px h-50px text-lg"
          type="text"
          onChange={event => {
            setNewName(event.target.value);
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={updateItem}
        >
          update an item
        </button>

        <label> Delete an item </label>
        <input
          className="border-2 bg-black-500 w-300px h-50px text-lg"
          type="text"
          onChange={event => {
            setName(event.target.value);
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={deleteItem}
        >
          delete an item
        </button>
      </div>
      <div>Player</div>
    </div>
  );
}
