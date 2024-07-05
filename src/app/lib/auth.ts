import { jwtVerify } from "jose"


interface UserJwtPayload {
    jti: string,
    iat: number 
}

export const getJwtSecretKey = ()=>{
    const secret = process.env.TOKEN_SECRET

    if(!secret || secret.length === 0){
        throw new Error('The env variable TOKEN_SECRET is not set.')
    }

    return secret
}

export const verifyAuth = async (token:string)=>{
    try {
        const verified = await jwtVerify(token,new TextEncoder().encode(getJwtSecretKey()))

        return verified.payload as UserJwtPayload
    }catch(error){
        throw new Error('Token has Expired')
    }
}