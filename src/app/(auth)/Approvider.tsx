'use client'

import { clientSessionToken, isClient } from "@/lib/http";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AccountResType } from "../schemaValidations/account.schema";


type User = AccountResType['data']

const AppContext = createContext<{
    user: User | null
    setUser: (user: User | null) => void
    isAuthenticated: boolean
}>({
    user: null,
    setUser: () => { },
    isAuthenticated: false
})

export const useAppContext = () => {
    const context = useContext(AppContext)
    return context
}

export default function AppProvider({
    children,
    initialSessionToken = '',
    user: userProp
}: {
    children: React.ReactNode
    initialSessionToken?: string,
    user: User | null
}) {
    useState(() => {
        clientSessionToken.value = initialSessionToken
    })

    const [user, setUserState] = useState<User | null>(() => {
        if (isClient()) {
            const _user = localStorage.getItem('user')
            return _user ? JSON.parse(_user) : null
        }
        return null
    })
    const isAuthenticated = Boolean(user)
    const setUser = useCallback(
        (user: User | null) => {
            setUserState(user)
            localStorage.setItem('user', JSON.stringify(user))
        },
        [setUserState]
    )

    useEffect(() => {
        const _user = localStorage.getItem('user')
        setUserState(_user ? JSON.parse(_user) : null)
    }, [setUserState])

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

