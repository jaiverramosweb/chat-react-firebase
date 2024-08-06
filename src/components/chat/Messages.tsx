import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import { useChatStore } from "@/store/chat-store";
import { useAuth, useFirestore } from "reactfire";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import CahtMessage from "@/components/chat/ChatMessage";

const Messages = () => {
  const [message, setMessage] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { friend, resetfriend } = useChatStore();
  const db = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, []);

  const handleSend = async () => {
    if (!message) return;
    console.log(message);

    try {
      const roomRef = doc(db, "rooms", friend!.roomId);
      await updateDoc(roomRef, {
        messages: arrayUnion({
          message: message,
          timestamp: new Date().toLocaleString(),
          uid: auth.currentUser!.uid,
        }),
      });

      setMessage("");
      setShowEmoji(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  if (!friend) {
    return (
      <div className="grid h-screen place-items-center">
        <h1 className="text-center text-3xl font-bold">Seleccione un amigo</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <header className="border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex">
            <img
              className="rounded-md size-16"
              src={friend.photoURL}
              alt={friend.displayName}
            />
            <div className="ml-4">
              <p className="text-2xl font-bold">{friend.displayName}</p>
              <p className="text-green-500 font-bold">Active</p>
            </div>
          </div>
          <div>
            <Button onClick={resetfriend}>Cerrar</Button>
          </div>
        </div>
      </header>

      <main ref={containerRef} className="overflow-y-auto custom-scrollbar">
        <CahtMessage friend={friend} />
      </main>

      <footer className="border-t p-4">
        <div className="flex gap-x-2">
          <div className="relative">
            <Button onClick={() => setShowEmoji(!showEmoji)}>
              <BsEmojiSmileFill className="text-lg" />
            </Button>
            {showEmoji && (
              <div className="absolute bottom-12">
                <EmojiPicker onEmojiClick={onEmojiClick} />
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
  );
};

export default Messages;
