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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RegisterBody, RegisterBodyType } from '../../schemaValidations/auth.schema'

import { useRouter } from "next/navigation"
import { Result } from "postcss"
import { handleErrorApi } from "@/lib/utils"
import { useState } from "react"

const formSchema = z.object({
    username: z.string().min(2).max(50),
})

export default function RegisterForm() {

    const { toast } = useToast()
    const router = useRouter()
    const [isloading,setIsLoading] =  useState(false)

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            email: '',
            name: '',
            password: '',
            confirmPassword: ''
        },
    })

    async function onSubmit(values: RegisterBodyType) {
        if(isloading)  return
        setIsLoading(true)
        try {
          const response = await authApiRequest.register(values);
          await authApiRequest.auth({
            sessionToken: response.payload.data.token,
            expiresAt: response.payload.data.expiresAt
          })
          toast({
            description: response.payload.message
          });
          router.push('/me');
        } catch (error: any) {
          handleErrorApi({
            error,
            setError: form.setError
          });
        }
    finally{
        setIsLoading (false)
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
                            name="name"
                            render={({ field, formState: { errors } }) => (
                                <FormItem>
                                    <FormLabel>Tên</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tên" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="">
                                    </div>
                                </FormItem>
                            )}
                        />
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

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ConfirmPassword</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ConfirmPassword" {...field} />
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
