import { redirect } from "next/navigation";


import SignIn from  "./sign-in"


export default async function Page(){
    return(
        <div>
            
            <SignIn />
        </div>
    );
}