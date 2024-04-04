import React from 'react';
import { SimpleNav } from '../components/simple-nav';
import SignUp from './sign-up';

export default async function Page() {
  return (
    <div>
      <SimpleNav />
      <SignUp />
    </div>
  );
}
