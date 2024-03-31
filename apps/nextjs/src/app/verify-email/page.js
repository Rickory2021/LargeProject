import React from 'react';
import VerifyEmail from './verify-email';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div>
      <Suspense>
        <VerifyEmail />
      </Suspense>
    </div>
  );
}
