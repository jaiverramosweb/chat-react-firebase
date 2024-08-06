import { z } from "zod";
import { registerFormSchema as formSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AuthError,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useAuth, useFirestore, useStorage } from "reactfire";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useLoadingStore } from "@/store/loading-store";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { doc, setDoc } from "firebase/firestore";
import { CgSpinner } from "react-icons/cg";
import type { UserDB } from "../../schemas/firestore-schema";

interface Props {
  handleClick: () => void;
}

const Register = ({ handleClick }: Props) => {
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { setLoading, loading } = useLoadingStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      photoURL: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const { user } = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // guardar en etorage
      const storageRef = ref(storage, `users/${user.uid}.jpg`);
      await uploadBytes(storageRef, values.photoURL);

      // Recuperar foto del de firebase
      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(user, {
        displayName: values.displayName,
        photoURL: photoURL,
      });

      // Guardar la colección de usuarios
      const userDB: UserDB = {
        displayName: values.displayName,
        email: values.email,
        photoURL: photoURL,
        uid: user.uid,
        firends: [],
        rooms: [],
      };

      const userDBRef = doc(db, "users", user.uid);
      await setDoc(userDBRef, userDB);

      setLoading(false);
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/email-already-in-use") {
        form.setError("email", {
          type: "manual",
          message: "El correo electrónico ya está registrado",
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Card className="shadow-black shadow-sm">
        <CardHeader>
          <CardTitle>Registrarse</CardTitle>
          <CardDescription>
            Rellene todos los campos del formulario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="Jose Jose" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="user@domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme la contraseña</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photoURL"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        placeholder="Foto"
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button onClick={handleClick} variant="outline" type="button">
                  Iniciar sesión
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <CgSpinner size="sm" /> : <span>Registrar</span>}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
