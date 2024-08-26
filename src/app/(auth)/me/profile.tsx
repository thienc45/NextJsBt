'use client'

import accountApiRequest from '@/apirequest/account'
import { clientSessionToken } from '@/lib/http'
import { useEffect, useState } from 'react'

export default function Profile() {
    // console.log(clientSessionToken)
    useEffect(() => {
        const fetchData = async () => {
            const response = await accountApiRequest.me(clientSessionToken.value)
            // await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // 'Authorization': `Bearer ${sessionToken}`
            //         'Cookie':`sessionToken= ${sessionToken}`
            //     },
            //     method: 'GET',
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
            
        }
    // console.log(response)
        fetchData()
    }, [])
    return (
        <div>   
            Profile
    
        </div>
    )
}
