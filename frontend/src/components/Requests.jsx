import { BASE_URL } from '@/assets/constants'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { invalidateConnections } from '@/utils.js/connectionsSlice'
import RequestCard from './RequestCard'

const Requests = () => {
  const dispatch = useDispatch()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get(`${BASE_URL}/user/request/recieved`, {
          withCredentials: true,
        })
        setRequests(response.data)
      } catch (err) {
        console.error(err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  function handleResponded(requestId, status) {
    setRequests((currentRequests) =>
      currentRequests.filter((request) => request._id !== requestId)
    )
    if (status === 'accepted') dispatch(invalidateConnections())
  }

  if (loading) return <p className="p-6 text-center">Loading requests…</p>
  if (requests.length === 0) {
    return <p className="p-6 text-center">No pending requests.</p>
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-5 py-6 sm:grid-cols-2">
      {requests.map((request) => (
        <RequestCard
          user={request}
          key={request._id}
          onResponded={handleResponded}
        />
      ))}
    </div>
  )
}

export default Requests
