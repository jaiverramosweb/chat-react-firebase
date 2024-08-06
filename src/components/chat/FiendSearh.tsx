import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { searchFormSchema as formSchema } from "@/lib/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuth, useFirestore } from "reactfire";
import { RoomDB, UserRooms } from "../../schemas/firestore-schema";

const FiendSearh = () => {
  const db = useFirestore();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (auth.currentUser?.email === values.search) {
        form.setError("search", {
          type: "manual",
          message: "No se puede enviar un mensaje a uno mismo",
        });
        return;
      }

      const q = query(
        collection(db, "users"),
        where("email", "==", values.search)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        form.setError("search", {
          type: "manual",
          message: "No se encontró ningún usuario con ese correo electrónico",
        });
        return;
      }

      const friendDB = querySnapshot.docs[0].data();

      // Verifivar si ya son amigos
      if (friendDB.firends.includes(auth.currentUser?.uid)) {
        form.setError("search", {
          type: "manual",
          message: "Ya somos amigos",
        });
        return;
      }

      // Crear la sala
      const newRoomDB: RoomDB = {
        messages: [],
        users: [auth.currentUser?.uid, friendDB.uid],
      };

      const roomRef = await addDoc(collection(db, "rooms"), newRoomDB);

      // Agregar la sala al usuario
      const currentUserRoom: UserRooms = {
        roomId: roomRef.id,
        lastMessage: "",
        timestamp: "",
        fiendId: friendDB.uid,
      };

      const fiendRoom: UserRooms = {
        roomId: roomRef.id,
        lastMessage: "",
        timestamp: "",
        fiendId: auth.currentUser!.uid,
      };

      const currentUserIdRef = doc(db, "users", auth.currentUser!.uid);
      const fiendRef = doc(db, "users", friendDB.uid);

      await updateDoc(currentUserIdRef, {
        rooms: arrayUnion(currentUserRoom),
        firends: arrayUnion(friendDB.uid),
      });

      await updateDoc(fiendRef, {
        rooms: arrayUnion(fiendRoom),
        firends: arrayUnion(auth.currentUser!.uid),
      });

      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Buscar por correo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Buscar
        </Button>
      </form>
    </Form>
  );
};

export default FiendSearh;
