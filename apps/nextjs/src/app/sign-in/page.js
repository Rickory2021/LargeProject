import React from 'react';
import { SimpleNav } from '../components/simple-nav';
import SignIn from './sign-in';

export default async function Page() {
  return (
    <div>
      <SimpleNav />
      <SignIn />
    </div>
  );
}
