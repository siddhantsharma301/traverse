import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios';


export default function Contracts() {
    const router = useRouter()
    const { contract_address } = router.query
    return (
        <div>Contract_Address</div>
    )
}
