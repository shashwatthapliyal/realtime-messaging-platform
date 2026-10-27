import React from 'react'
import { UserRound } from 'lucide-react'

const UserCard = ({ user }) => {
    console.log(user)
  const firstName = typeof user?.firstName === 'string' ? user.firstName.trim() : ''
  const lastName = typeof user?.lastName === 'string' ? user.lastName.trim() : ''
  const name = [firstName, lastName].filter(Boolean).join(' ')
  const about = typeof user?.about === 'string' ? user.about.trim() : ''
  const photoUrl = typeof user?.photoUrl === 'string' ? user.photoUrl.trim() : ''

  return (
    <article className="group isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/75 shadow-[0_14px_40px_rgba(48,44,99,0.11)] ring-1 ring-violet-100/70 backdrop-blur-2xl transition-all duration-250 ease-out hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_22px_48px_rgba(65,56,130,0.18)] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-white">
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <div className="grid size-20 place-items-center rounded-[24px] border border-white/80 bg-white/65 text-indigo-300 shadow-sm backdrop-blur-xl">
            <UserRound className="size-10" strokeWidth={1.5} />
          </div>
        </div>

        {photoUrl && (
          <img
            src={photoUrl}
            alt={name ? `${name} profile photo` : 'Profile photo'}
            className="absolute inset-0 size-full object-cover transition-transform duration-250 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1 border-t border-white/80 bg-white/60 px-5 py-5 sm:px-6 sm:py-6">
        {name && (
          <h2 className="break-words text-xl font-semibold capitalize leading-tight tracking-tight text-[#28234f] sm:text-2xl">
            {name}
          </h2>
        )}
        {about && (
          <p className="mt-3 line-clamp-4 break-words text-sm leading-6 text-[#626982] sm:text-[15px]">
            {about}
          </p>
        )}
      </div>
    </article>
  )
}

export default UserCard
