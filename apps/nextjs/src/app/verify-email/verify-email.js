'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  // pages/users/[userId].js
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  //console.log(token);
  useEffect(async () => {
    //console.log('Start');
    try {
      const response = await fetch(
        `http://localhost:3001/api/auth/user/verify-email?token=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify() // Replace with your payload
        }
      );
      const responseData = await response.json();
      console.log(responseData); // Logging response from server
      // Handle response as needed
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  /*useEffect(() => {
    // Function to make the POST request
    const postData = async () => {
      console.log('Start');
      try {
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key: 'value' }) // Replace with your payload
        });

        const responseData = await response.json();
        console.log(responseData); // Logging response from server
        // Handle response as needed
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the function to make the POST request when component mounts
    postData();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  /*const getQueryParams = () => {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    // Accessing specific query parameter
    const parameterValue = queryParams.get('parameterName'); // Change 'parameterName' to your query parameter name
    console.log('Query Parameter:', parameterValue);
  };

  getQueryParams();
  //const router = useRouter();

  useEffect(() => {
    // Accessing query parameters
    const getQueryParams = () => {
      const queryString = window.location.search;
      const queryParams = new URLSearchParams(queryString);
      // Accessing specific query parameter
      const parameterValue = queryParams.get('parameterName'); // Change 'parameterName' to your query parameter name
      console.log('Query Parameter:', parameterValue);
    };

    getQueryParams();
  }, []); // Re-run effect when location.search changes*/

  return (
    <div>
      <h1>This is the email-verify page</h1>
    </div>
  );
}

/*
'use client';
import React, { useEffect } from 'react';

function EmailVerify() {
  //const [username, setUsername] = useState('');
  //const [password, setPassword] = useState('');

  useEffect(() => {
    // Accessing query parameters
    const getQueryParams = () => {
      const queryString = window.location.search;
      const queryParams = new URLSearchParams(queryString);
      // Accessing specific query parameter
      const parameterValue = queryParams.get('parameterName'); // Change 'parameterName' to your query parameter name
      console.log('Query Parameter:', parameterValue);
    };

    getQueryParams();
  }, []); // Re-run effect when location.search changes

  return (
    <div>
      <h1>This is the email-verify page</h1>
    </div>
  );
}*/
