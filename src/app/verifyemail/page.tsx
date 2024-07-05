"use client"

import { Player } from "@lottiefiles/react-lottie-player";
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import loadingAnimation from "@/assets/animation-loading.json"
import { useRouter } from "next/navigation";


export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerfied] = useState(false);
    const [error, setError] = useState(false);

    const router = useRouter();

    const verifyUserEmail= async ()=>{
        try{

            await axios.post('/api/users/verifyemail',{ token })
    
            setVerfied(true);

            setTimeout(()=>router.push('/login'),5000);

        }catch(error: any){
            setError(true);
            console.log(JSON.stringify(error));
        }
    }

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];

        if(urlToken.length == 0){
            alert("Invalid link. Token is missing!");
            setError(true)
        }

        setToken(urlToken);
    },[])

    useEffect(()=>{
        if(token.length > 0 ){
            verifyUserEmail();
        }
    },[token])


    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{token}</h1>
            { error && !verified ?
                <div className="flex flex-col items-center justify-center min-h-screen py-2">
                    <h1 className="bg-red-700 text-white text-center">Error</h1>
                    <h3 className="text-xs m-4">Something went wrong ... </h3> 
                    <Link href={"/login"} className="hover:text-blue-700"> Back to Login </Link>
                    </div>:
            <>
            <h1 className="text-">{!verified ? 'Verifying Email':'Email Verfied ✅'}</h1>
            <span>
                {
                    verified ? 
                    null : 
                    <Player
                        src={loadingAnimation}
                        loop
                        autoplay
                        className="h-20 w-20"
                    />
                }
            </span>
            </>
            }
        </div>
    )


}