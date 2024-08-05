import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill, BsFillSendFill  } from "react-icons/bs";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Messaje from "@/components/chat/Messaje"

const Messages = () => {

    const [message, setMessage] = useState("")
    const [showEmoji, setShowEmoji] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
    }, [])
    

    const handleSend = () => {
        if(!message) return
        console.log(message)

        // Clear input
        setMessage("")
        setShowEmoji(false)
    }

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji)
    }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">

        <header className="border-b p-4">
            <div className="flex justify-between items-center">
                <div className="flex">
                    <img className="rounded-md size-16" src="https://randomuser.me/api/portraits/thumb/men/51.jpg" alt="" />
                    <div className="ml-4">
                        <p className="text-2xl font-bold">name</p>
                        <p className="text-green-500 font-bold">Active</p>
                    </div>
                </div>
                <div>
                    <Button>Cerrar</Button>
                </div>
            </div>
        </header>

        <main ref={containerRef} className="overflow-y-auto custom-scrollbar">
            <Messaje 
                imageURL="https://randomuser.me/api/portraits/thumb/men/51.jpg"
                message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus architecto veniam, eos quisquam tempore Laboriosam voluptates suscipit sequi ipsa."
                date={new Date().toLocaleString()}
            />

            <Messaje 
                imageURL="https://randomuser.me/api/portraits/thumb/men/51.jpg"
                message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus architecto veniam, eos quisquam tempore nemo voluptas, laborum, harum nostrum cum ullam corporis ea asperiores culpa? Laboriosam voluptates suscipit sequi ipsa."
                date={new Date().toLocaleString()} position={true}
            />   

            <Messaje 
                imageURL="https://randomuser.me/api/portraits/thumb/men/51.jpg"
                message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus architecto veniam, eos quisquam tempore nemo voluptas, laborum, harum nostrum cum ullam corporis ea asperiores culpa? Laboriosam voluptates suscipit sequi ipsa."
                date={new Date().toLocaleString()} position={true}
            />

            <Messaje 
                imageURL="https://randomuser.me/api/portraits/thumb/men/51.jpg"
                message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus architecto veniam, eos quisquam tempore nemo voluptas, laborum, harum nostrum cum ullam corporis ea asperiores culpa? Laboriosam voluptates suscipit sequi ipsa."
                date={new Date().toLocaleString()}
            />

            <Messaje 
                imageURL="https://randomuser.me/api/portraits/thumb/men/51.jpg"
                message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus architecto veniam, eos quisquam tempore nemo voluptas, laborum, harum nostrum cum ullam corporis ea asperiores culpa? Laboriosam voluptates suscipit sequi ipsa."
                date={new Date().toLocaleString()} position={true}
            />

            <Messaje 
                imageURL="https://randomuser.me/api/portraits/thumb/men/51.jpg"
                message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus architecto veniam, eos quisquam tempore nemo voluptas, laborum, harum nostrum cum ullam corporis ea asperiores culpa? Laboriosam voluptates suscipit sequi ipsa."
                date={new Date().toLocaleString()}
            />

            <Messaje 
                imageURL="https://randomuser.me/api/portraits/thumb/men/51.jpg"
                message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus architecto veniam, eos quisquam tempore nemo voluptas, laborum, harum nostrum cum ullam corporis ea asperiores culpa? Laboriosam voluptates suscipit sequi ipsa."
                date={new Date().toLocaleString()} position={true}
            />         
        </main>

        <footer className="border-t p-4">
            <div className="flex gap-x-2">
                <div className="relative">
                    <Button onClick={() => setShowEmoji(!showEmoji)}>
                        <BsEmojiSmileFill className="text-lg" />
                    </Button>
                    {showEmoji && (
                        <div className="absolute bottom-12">
                            <EmojiPicker onEmojiClick={onEmojiClick}/>
                        </div>
                    )}
                </div>
                <Input 
                    placeholder="Escribir..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={handleSend}>
                    <BsFillSendFill />
                </Button>
            </div>
        </footer>

    </div>
  )
}

export default Messages