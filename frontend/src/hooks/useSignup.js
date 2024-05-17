import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const useSignup = () => {
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (email,password,username) => {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/user/signup',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({email,password,username})
        })
        const json = await response.json()
        if(!response.ok){
            setLoading(false)
            setError(json.error)
        }
        if(response.ok){
            localStorage.setItem('user',JSON.stringify(json))
            dispatch({type:'LOGIN',payload:json})

            setLoading(false)
        }
    }

    return {signup,loading,error}
}

