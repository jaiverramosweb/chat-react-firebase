import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth, useFirestore } from "reactfire";
import Messaje from "@/components/chat/Messaje";
import { Friend } from "@/store/chat-store";
import { Message } from "../../schemas/firestore-schema";
import { format } from "timeago.js";

interface Props {
  friend: Friend;
}

const ChatMessage = ({ friend }: Props) => {
  const db = useFirestore();
  const auth = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [leer, setLeer] = useState(false);

  useEffect(() => {
    const roomRef = doc(db, "rooms", friend.roomId);
    const unSuscribe = onSnapshot(roomRef, (document) => {
      setMessages(document.data()?.messages);
      setLeer(true);
    });

    return () => unSuscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {leer &&
        messages.map((ms, i) => (
          <Messaje
            key={i}
            imageURL={
              ms.uid === auth.currentUser!.uid
                ? auth.currentUser!.photoURL
                : friend.photoURL
            }
            message={ms.message}
            date={format(ms.timestamp, "es")}
            position={ms.uid === auth.currentUser!.uid}
          />
        ))}
    </>
  );
};

export default ChatMessage;
