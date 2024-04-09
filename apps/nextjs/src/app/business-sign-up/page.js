import React from 'react';
import SignUp from './sign-up';
import { BusinessNav } from '../components/business-nav';

export default async function Page() {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <BusinessNav />
      <SignUp />
    </div>
  );
}
