import { redirect } from "next/navigation";


import SignIn from  "./sign-in"
import Nav from "../../../../../packages/ui/src/nav"

export default async function Page(){
    return(
        <div>
            <Nav />
            <SignIn />
        </div>
    );
}