import Fiends from "@/components/chat/Fiends"
import Messages from "@/components/chat/Messages"
import Profile from "@/components/chat/Profile"

export const ChatLayout = () => {
  return (
    <div className="grid md:grid-cols-[1fr_3fr_1fr] h-screen">
        <Fiends />
        <Messages />
        <Profile />
    </div>
  )
}
