import { redirect } from "next/navigation";

import SignUp from "./sign-up";


export default async function Page() {
  return (
    <div>
      
      <SignUp />
    </div>
  );
}
