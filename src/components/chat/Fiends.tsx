import { useEffect, useState } from "react";
import { FiendItem } from "./FiendItem";
import FiendSearh from "./FiendSearh";
import { useAuth, useFirestore } from "reactfire";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { UserRooms } from "@/schemas/fireStore-schema";

interface Friend {
  uid: string;
  displayName: string;
  photoURL: string;
  lastMessage: string;
  roomId: string;
}

const Fiends = () => {
  const [fiends, setFiends] = useState<Friend[]>([]);
  const db = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    const userRef = doc(db, "users", auth.currentUser!.uid);

    const unsub = onSnapshot(userRef, (document) => {
      const friendPromises = document.data()?.rooms.map((room: UserRooms) => {
        const fiendRef = doc(db, "users", room.fiendId);
        return getDoc(fiendRef);
      });

      Promise.all(friendPromises).then((friends) => {
        const data = friends.map((friend) => {
          const room = document
            .data()
            ?.rooms.find(
              (room: UserRooms) => room.fiendId === friend.data()?.uid
            );

          return {
            uid: friend.data()?.uid,
            displayName: friend.data()?.displayName,
            photoURL: friend.data()?.photoURL,
            lastMessage: friend.data()?.lastMessage,
            roomId: room?.roomId,
          };
        });

        setFiends(data);
      });
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen border-r">
      <section className="border-b p-4">
        <h2 className="textxl font-bold text-gray-800">Chat</h2>
        <div className="mt-3">
          <FiendSearh />
        </div>
      </section>

      <section className="overflow-y-auto custom-scrollbar">
        {fiends.map((fiend, i) => (
          <FiendItem key={i} friend={fiend} />
        ))}
      </section>
    </div>
  );
};

export default Fiends;
