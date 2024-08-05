import { z } from "zod"
import { loginFormSchema as formSchema  } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { AuthError, signInWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "reactfire"


interface Props {
    handleClick: () => void
}

const Login = ({ handleClick }: Props) => {

    const auth = useAuth()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: ""
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password)
        } catch (error) {

            const firebaseError = error as AuthError

            if(firebaseError.code === "auth/invalid-login-credentials") {
                form.setError("email",{
                    type: "manual",
                    message: "Correo o contraseña incorrectos"
                })
                form.setError("password",{
                    type: "manual",
                    message: "Correo o contraseña incorrectos"
                })
                return
            }

            console.log(firebaseError) 
        }
    }

  return (
    <div>
        <Card className="shadow-black shadow-sm">
            <CardHeader>
                <CardTitle>Inicio de sesión</CardTitle>
                <CardDescription>¡Bienvenido! Por favor, inicia sesión para comenzar.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        <div className="flex justify-between">
                            <Button onClick={handleClick} variant="outline" type="button">Registrar</Button>
                            <Button type="submit">Iniciar</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}

export default Login