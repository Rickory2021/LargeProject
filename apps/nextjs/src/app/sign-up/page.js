import { redirect } from 'next/navigation';
import React from 'react';

import SignUp from './sign-up';

export default async function Page() {
  return (
    <div>
      <SignUp />
    </div>
  );
}
