import { UserRound } from 'lucide-react'
import { useSelector } from 'react-redux'

function MyProfile() {
  const user = useSelector((state) => state.user)
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Your profile'

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f5f8f7] px-5 py-10 sm:px-8">
      <section className="mx-auto max-w-2xl rounded-2xl border border-[#dce8e4] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4 border-b border-[#e8f0ed] pb-6">
          <div className="grid size-16 place-items-center rounded-full bg-[#e8f1ef] text-[#176b63]"><UserRound className="size-7" /></div>
          <div><p className="text-xs font-semibold uppercase tracking-wider text-[#176b63]">Your profile</p><h1 className="mt-1 text-2xl font-semibold text-[#172a2a]">{name}</h1></div>
        </div>
        <dl className="grid gap-5 pt-6 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-[#9aa9a5]">Email</dt><dd className="mt-1 text-sm text-[#526763]">{user.email || 'Not available'}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-[#9aa9a5]">Status</dt><dd className="mt-1 text-sm text-[#176b63]">Ready to connect</dd></div>
        </dl>
      </section>
    </main>
  )
}

export default MyProfile
