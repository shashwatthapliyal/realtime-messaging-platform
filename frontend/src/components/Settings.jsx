import { ArrowRight, Settings2, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Settings() {
  const user = useSelector((state) => state.user)
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase()

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f5f8f7] px-5 py-8 text-[#172a2a] sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <span className="mb-3 grid size-11 place-items-center rounded-xl border border-[#cfe4df] bg-white text-[#176b63] shadow-sm">
            <Settings2 aria-hidden="true" className="size-5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#176b63]">Account</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#71827f]">
            Manage your profile details and understand your current session.
          </p>
        </header>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#dce8e4] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="font-semibold text-[#29413e]">Account profile</h2>
              <p className="mt-1 text-sm text-[#71827f]">Your identity details used across Connectly.</p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#e8f0ed] pt-5 sm:flex-row sm:items-center">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8f1ef] text-sm font-semibold text-[#176b63]">
                {initials || <UserRound aria-hidden="true" className="size-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold capitalize text-[#29413e]">
                  {name || (user._id ? 'Your profile' : 'Loading account details…')}
                </p>
                <p className="mt-1 truncate text-sm text-[#71827f]">
                  {user.email || (user._id ? 'Email not available' : 'Your account is being restored.')}
                </p>
              </div>
              
              <Link
                to="/app/profile"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#dce8e4] px-4 py-2 text-sm font-semibold text-[#176b63] transition hover:bg-[#f5f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63]"
              >
                Edit profile <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-[#dce8e4] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f1f6f4] text-[#176b63]">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold text-[#29413e]">Session</h2>
                <p className="mt-1 text-sm leading-6 text-[#71827f]">
                  Connectly keeps your sign-in in an HTTP-only session cookie. To end your session, open the Account menu in the top navigation and choose Log out.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Settings
