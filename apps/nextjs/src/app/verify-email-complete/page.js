import React from 'react';
import VerifyEmailComplete from './verify-email-complete';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div>
      <Suspense>
        <VerifyEmailComplete />
      </Suspense>
    </div>
  );
}
