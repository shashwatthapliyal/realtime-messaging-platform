import { MessageCircle, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

function ConnectionCard({ user }) {
  const { firstName, lastName } = user
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-[#dce8e4] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8f1ef] text-sm font-semibold text-[#176b63]">{initials || <UserRound className="size-5" />}</div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-[#29413e]">{firstName} {lastName}</h2>
        <p className="mt-1 text-sm text-[#8a9a97]">Available to chat</p>
      </div>
      <Link to={`/app/chat/${user._id}`} state={{ user }} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#176b63] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12584f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63]">
        <MessageCircle className="size-4" /> <span className="hidden sm:inline">Message</span>
      </Link>
    </article>
  )
}

export default ConnectionCard
