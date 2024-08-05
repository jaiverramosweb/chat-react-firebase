import Login from "@/components/auth/Login"
import Register from "@/components/auth/Register"
import { useState } from "react"
import { ChatLayout } from "./chat-layout"
import { useUser } from "reactfire"
import { useLoadingStore } from "@/store/loading-store"

const RootLayout = () => {

    const { status, data: userdb } = useUser()
    const { loading } = useLoadingStore()

    const [register, setregister] = useState<boolean>(false)

    const changeRegister = () => {
        setregister(!register)
    }

    if(status === "loading") return (<div>Loading...</div>)

  return (
    <div className="">
        { userdb && !loading
            ? (<ChatLayout /> )
            : (
                <div className="min-h-screen grid place-content-center place-items-center bg-indigo-300">
                    {
                        register 
                         ? <Register handleClick={changeRegister} />
                         : <Login handleClick={changeRegister}/>
                    }                  
                </div>
            )
        }
    </div>
  )
}

export default RootLayout