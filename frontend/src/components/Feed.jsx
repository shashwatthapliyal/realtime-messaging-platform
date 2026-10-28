import { useEffect, useState } from 'react'
import axios from 'axios'
import { UsersRound } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '@/assets/constants'
import { addFeed,removeUserFromFeed } from '@/utils.js/feedSlice'
import UserCard from './UserCard'

function Feed() {
  const dispatch = useDispatch()
  const feed = useSelector((state) => state.feed)
  const [loading, setLoading] = useState(feed.length === 0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (feed.length > 0) return

    async function fetchFeed() {
      try {
        const response = await axios.get(`${BASE_URL}/feed`, { withCredentials: true })
        dispatch(addFeed(response.data))
      } catch {
        setError('Could not load people. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [dispatch, feed.length])

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f5f8f7] px-5 py-8 text-[#172a2a] sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#cfe4df] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#176b63]">
            <UsersRound aria-hidden="true" className="size-4" /> People
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Discover people</h1>
          <p className="mt-2 text-sm text-[#71827f] sm:text-base">
            Send a connection request to people you would like to talk with.
          </p>
        </header>

        {loading && (
          <p className="rounded-2xl border border-[#dce8e4] bg-white p-8 text-center text-sm text-[#71827f]">
            Loading people…
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-2xl border border-[#efd2d0] bg-[#fff8f7] p-6 text-center text-sm text-[#a44f4d]">
            {error}
          </p>
        )}
        {!loading && !error && feed.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#cfe4df] bg-white p-10 text-center text-sm text-[#71827f]">
            No people to show right now.
          </p>
        )}
        {!loading && !error && feed.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {feed.map((user) => <UserCard user={user} key={user._id} />)}
          </div>
        )}
      </div>
    </main>
  )
}

export default Feed
