import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '@/assets/constants'

function RequestCard({ user, onResponded }) {
  const { firstName, lastName, gender } = user.fromUserId
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  const [responding, setResponding] = useState(false)

  async function sendRequest(status) {
    setResponding(true)
    try {
      await axios.post(
        `${BASE_URL}/request/respond/${user._id}/${status}`,
        {},
        { withCredentials: true }
      )
      onResponded(user._id, status)
    } catch (err) {
      console.error(err.response?.data || err.message)
    } finally {
      setResponding(false)
    }
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#dce8e4] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8f1ef] text-sm font-semibold text-[#176b63]">
          {initials || '?'}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-[#29413e]">
            {[firstName, lastName].filter(Boolean).join(' ') || 'Member'}
          </h2>
          {gender && (
            <p className="mt-1 text-sm capitalize text-[#8a9a97]">{gender}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => sendRequest('accepted')}
          disabled={responding}
          type="button"
          className="rounded-xl bg-[#176b63] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12584f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63] disabled:opacity-50"
        >
          Accept
        </button>
        <button
          onClick={() => sendRequest('rejected')}
          disabled={responding}
          type="button"
          className="rounded-xl border border-[#dce8e4] bg-white px-4 py-2.5 text-sm font-semibold text-[#657874] transition hover:border-[#efd2d0] hover:bg-[#fff8f7] hover:text-[#a44f4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63] disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </article>
  )
}

export default RequestCard
