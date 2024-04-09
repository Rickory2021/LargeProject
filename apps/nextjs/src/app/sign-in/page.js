import React from 'react';
import { SimpleNav } from '../components/simple-nav';
import SignIn from './sign-in';

export default async function Page() {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <SimpleNav />
      <SignIn />
    </div>
  );
}
