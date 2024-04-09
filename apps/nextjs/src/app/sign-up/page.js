import React from 'react';
import { SimpleNav } from '../components/simple-nav';
import SignUp from './sign-up';

export default async function Page() {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <SimpleNav />
      <SignUp />
    </div>
  );
}
