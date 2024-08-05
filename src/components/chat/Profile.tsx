import { useAuth } from "reactfire"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"

const Profile = () => {

  const auth = useAuth()
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    setUser(auth.currentUser)
  }, [auth.currentUser])

  const handleClickLogout = async () => {
    await auth.signOut()
  }

  return (
    <div className="p-4 text-center border-l">
        <h2 className="text-2xl font-bold">Perfil</h2>
        { user 
          ?  (
            <>
                <img 
                  className="rounded-md mb-4 mx-auto w-24 h-24" 
                  src={user?.photoURL || "https://randomuser.me/api/portraits/thumb/men/51.jpg"}
                  alt="" 
              />
              <p className="font-semibold">{user?.displayName || "Nombre de usuario"}</p>
              <p className="text-gray-500 mb-2">{user?.email}</p>
            <Button onClick={handleClickLogout} className="w-full">Cerrar sesión</Button>
            </>
          )
          : (
            <div>Cargando la información...</div>
          )
        }
    </div>
  )
}

export default Profile