import { useState } from 'react'
import axios from 'axios'
import { UserRound } from 'lucide-react'
import { BASE_URL } from '@/assets/constants'

import { removeUserFromFeed } from '@/utils.js/feedSlice'
import { useDispatch } from 'react-redux'


function UserCard({ user }) {
  const { firstName, lastName, about } = user
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
const dispatch=useDispatch()
  async function sendConnectionRequest() {
    setSending(true)
    setError('')

    try {
      await axios.post(`${BASE_URL}/request/send/interested/${user._id}`, {}, { withCredentials: true })
      setSent(true)
      dispatch(removeUserFromFeed(user._id))
    } catch (requestError) {
      const message = requestError.response?.data
      setError(typeof message === 'string' ? message : 'Could not send the request. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <article className="w-full overflow-hidden rounded-2xl border border-[#dce8e4] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none">
      <div className="flex items-center gap-3 border-b border-[#e8f0ed] bg-[#fbfdfc] px-5 py-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8f1ef] text-base font-semibold text-[#176b63]">{initials || <UserRound className="size-5" />}</div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-[#29413e]">{firstName} {lastName}</h2>
          <p className="mt-0.5 text-sm text-[#8a9a97]">Connect with this member</p>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#9aa9a5]">About</p>
        <p className="min-h-12 text-sm leading-6 text-[#71827f]">{about || 'This person has not added a bio yet.'}</p>
        {error && <p role="alert" className="mt-3 text-xs leading-5 text-[#a44f4d]">{error}</p>}
        <button
          type="button"
          onClick={sendConnectionRequest}
          disabled={sending || sent}
          className="mt-4 w-full rounded-xl bg-[#176b63] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#12584f] focus:outline-none focus:ring-2 focus:ring-[#5da69d] focus:ring-offset-2 disabled:cursor-default disabled:bg-[#e8f1ef] disabled:text-[#176b63]"
        >
          {sending ? 'Sending request…' : sent ? 'Request sent' : 'Connect'}
        </button>
      </div>
    </article>
  )
}

export default UserCard
