import React from 'react';
import { SimpleNav } from '../components/simple-nav';
import ForgotPasswordChange from './forgot-password-change';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div>
      <SimpleNav />
      <Suspense>
        <ForgotPasswordChange />
      </Suspense>
    </div>
  );
}
