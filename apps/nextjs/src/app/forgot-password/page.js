import React from 'react';
import { SimpleNav } from '../components/simple-nav';
import ForgotPassword from './forgot-password';

export default async function Page() {
  return (
    <div>
      <SimpleNav />
      <ForgotPassword />
    </div>
  );
}
