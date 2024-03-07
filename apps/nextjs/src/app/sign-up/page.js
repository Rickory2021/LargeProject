import { redirect } from "next/navigation";

import SignUp from "./sign-up";
import Nav from "../../../../../packages/ui/src/nav";

export default async function Page() {
  return (
    <div>
      <Nav />
      <SignUp />
    </div>
  );
}
