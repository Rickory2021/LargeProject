import { redirect } from 'next/navigation';

import VerifyEmail from './verify-email';

export default async function Page() {
  return (
    <div>
      <VerifyEmail />
    </div>
  );
}
