'use client'

import { clientSessionToken } from "@/lib/http";
import React, { useLayoutEffect } from "react";

// const AppContext = createContext({
//     sessionToken: '',
//     setSessionToken: (sessionToken: string) => { }
// })

// export const useAppContext = () => {
//     const context = useContext(AppContext);
//     if (!context) {
//         throw new Error('useAppContext must be provided')
//     }
//     return context
// }


export default function AppProvider({
    children,
    initialSessionToken = ''
}: {
    children: React.ReactNode
    initialSessionToken?: string
}) {
    useLayoutEffect(() => {
        clientSessionToken.value = initialSessionToken;
    }, [initialSessionToken]);

    return (
        <>
            {children}
        </>
    );
}

