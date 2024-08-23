'use client'

import accountApiRequest from '@/apirequest/account'
import { clientSessionToken } from '@/lib/http'
import { useEffect } from 'react'

export default function Profile() {
    useEffect(() => {
        const fetchData = async () => {
            const response = await accountApiRequest.meClient()

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
            console.log(response)
        }
        fetchData()
    }, [clientSessionToken])
    return (
        <div>
            Profile
        </div>
    )
}
