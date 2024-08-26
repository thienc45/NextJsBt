"use client"

import authApiRequest from "@/apirequest/auth"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { clientSessionToken } from "@/lib/http"
import { handleErrorApi } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoginBody, LoginBodyType } from '../../schemaValidations/auth.schema'

const formSchema = z.object({
    username: z.string().min(2).max(50),
})

export default function LoginForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',

        },
    })


    async function onSubmit(values: LoginBodyType) {
        if (isloading) return
        setIsLoading(true)
        try {
            const res =
                await authApiRequest.login(values)
                // localStorage.setItem('sessionToken', res.payload.data.token );
            // await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
            //     body: JSON.stringify(values),
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     method: 'POST',
            // }).then(async (res) => {
            //     const payload = await res.json()
            //     const data = {
            //         status: res.status,
            //         payload
            //     }
            //     if (!res.ok) {
            //         throw data
            //     }
            //     return data
            // })

            // toast({
            //     description: response.payload.message
            // })
            console.log("---seeee" + res.payload.data.token)
            // await authApiRequest.auth({sessionToken:response.payload.data.token})
            const resultFromNextServer =
                await authApiRequest.auth({ sessionToken: res.payload.data.token,expiresAt: res.payload.data.expiresAt})
            // clientSessionToken.value = res.payload.data.token
            // await fetch('/api/auth', {
            //     body: JSON.stringify(res.payload.data.token),
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     method: 'POST',
            // })
            //     .then(async (res) => {
            //         const payload = await res.json()
            //         const data = {
            //             status: res.status,
            //             payload
            //         }
            //         if (!res.ok) {
            //             throw data
            //         }
            //         return data
            //     })

            clientSessionToken.value = res.payload.data.token 
            router.push('/me')
            // setSessionToken(resultFromNextServer.payload.data.token)
            // console.log(resultFromNextServer)
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: form.setError
            })
        } finally {
            router.refresh()
            setIsLoading(false)
        }
    }






    return (
        <div className="w-full flex justify-center">
            <main className="w-full max-w-[600px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-2 max-w-[600px] flex-shrink-0 w-full' >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="!mt-8 w-full" type="submit">Submit</Button>
                    </form>
                </Form>
            </main>
        </div>
    );
}
