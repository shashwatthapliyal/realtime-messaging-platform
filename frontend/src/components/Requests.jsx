import { BASE_URL } from '@/assets/constants'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import RequestCard from './RequestCard'

const Requests = () => {

    const [requests, setRequests] = useState([])
    useEffect(() => {
        async function fetchRequests() {
            const data = await axios.get(BASE_URL + "/user/request/recieved", { withCredentials: true })
            console.log(data.data)
            setRequests(data.data)
        }

        fetchRequests()
    }, [])

if(requests.length===0) return

    return (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-5 py-6 sm:grid-cols-2">
            {requests.map((user)=><RequestCard user={user.fromUserId} key={user._id}/>)}
        </div>
    )
}

export default Requests
