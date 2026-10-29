import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { UsersRound } from 'lucide-react'
import { BASE_URL } from '@/assets/constants'
import { setConnections } from '@/utils.js/connectionsSlice'
import ConnectionCard from './ConnectionCard'

function Connections() {
  const dispatch = useDispatch()
  const { items: connections, loaded } = useSelector((state) => state.connections)
  const [loading, setLoading] = useState(!loaded)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loaded) {
      setLoading(false)
      return
    }

    let isMounted = true

    async function fetchConnections() {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        })
        dispatch(setConnections(response.data.data || []))
      } catch {
        if (isMounted) {
          setError('We could not load your connections right now.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchConnections()
    return () => {
      isMounted = false
    }
  }, [dispatch, loaded])

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f5f8f7] px-5 py-8 text-[#172a2a] sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#cfe4df] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#176b63] shadow-sm">
            <UsersRound aria-hidden="true" className="size-4" /> Connections
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your conversations</h1>
          <p className="mt-2 text-sm text-[#71827f] sm:text-base">Open a connection to continue messaging.</p>
        </header>
        {loading && <p className="rounded-2xl border border-[#dce8e4] bg-white p-8 text-center text-sm text-[#71827f]">Loading connections...</p>}
        {error && <p role="alert" className="rounded-2xl border border-[#efd2d0] bg-[#fff8f7] p-8 text-center text-sm text-[#a44f4d]">{error}</p>}
        {!loading && !error && connections.length === 0 && <p className="rounded-2xl border border-dashed border-[#cfe4df] bg-white p-12 text-center text-sm text-[#71827f]">You do not have any connections yet.</p>}
        {!loading && !error && connections.length > 0 && <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{connections.map((connection) => <ConnectionCard key={connection._id} user={connection} />)}</div>}
      </div>
    </main>
  )
}

export default Connections
