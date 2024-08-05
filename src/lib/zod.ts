import { z } from "zod"

export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, "La contraseña debe de tener al menos 4 caracteres")
})

export const registerFormSchema = z.object({
    photoURL: z.instanceof(File, { message:"La foto es requerida" }).refine((data) => data.size < 2 * 1024 * 1024, {
        message: "La foto no puede ser mayor a 2MB"
    }),
    displayName: z.string().min(1, "Es requerido."),
    email: z.string().email("El correo electrónico es requerido."),
    password: z.string().min(6, "La contraseña debe de tener al menos 6 caracteres."),
    confirmPassword: z.string().min(6, "La contraseña debe de tener al menos 6 caracteres.")
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas deben coincidir."
})


export const searchFormSchema = z.object({
    search: z.string().email("El correo electrónico del usuario es requerido."),
})