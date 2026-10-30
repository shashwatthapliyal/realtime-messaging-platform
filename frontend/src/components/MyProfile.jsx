import { createElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  CalendarDays,
  Mail,
  Pencil,
  Save,
  UserRound,
  X,
} from 'lucide-react'
import { BASE_URL } from '@/assets/constants'
import { addUser } from '@/utils.js/userSlice'

const genderOptions = ['male', 'female', 'others']

function getDraft(user) {
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    gender: user.gender || '',
  }
}

function DetailItem({ icon, label, children }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f1f6f4] text-[#176b63]">
        {createElement(icon, { 'aria-hidden': true, className: 'size-4' })}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a9a97]">{label}</dt>
        <dd className="mt-1 break-words text-sm font-medium text-[#29413e]">{children}</dd>
      </div>
    </div>
  )
}

function MyProfile() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [draft, setDraft] = useState(() => getDraft(user))
  const [loading, setLoading] = useState(!user.createdAt)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (user.createdAt) return

    let isActive = true

    axios.get(`${BASE_URL}/profile`, { withCredentials: true })
      .then(({ data }) => {
        if (!isActive) return
        setDraft(getDraft(data))
        dispatch(addUser(data))
      })
      .catch(() => {
        if (isActive) setLoadError('We could not load your profile. Check your session and try again.')
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [dispatch, retryCount, user.createdAt])

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase()
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })
    : null
  const profileLoading = loading && !user.createdAt

  function startEditing() {
    setDraft(getDraft(user))
    setFormError('')
    setSaveSuccess('')
    setEditing(true)
  }

  function cancelEditing() {
    setDraft(getDraft(user))
    setFormError('')
    setEditing(false)
  }

  async function saveProfile(event) {
    event.preventDefault()
    setFormError('')
    setSaveSuccess('')

    const firstName = draft.firstName.trim()
    if (!firstName) {
      setFormError('First name is required.')
      return
    }

    const updates = {
      firstName,
      lastName: draft.lastName.trim(),
    }
    if (draft.gender) updates.gender = draft.gender

    setSaving(true)
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/user/${user._id}`,
        updates,
        { withCredentials: true }
      )
      dispatch(addUser({ ...user, ...data }))
      setEditing(false)
      setSaveSuccess('Your profile has been updated.')
    } catch (error) {
      const message = error.response?.data
      setFormError(typeof message === 'string' ? message : 'Could not save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f5f8f7] px-5 py-8 text-[#172a2a] sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#176b63]">Your account</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Profile</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#71827f]">
              Keep your Connectly profile details up to date.
            </p>
          </div>
          {!loading && !loadError && !editing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#176b63] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12584f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63]"
            >
              <Pencil aria-hidden="true" className="size-4" /> Edit profile
            </button>
          )}
        </header>

        {profileLoading && (
          <div role="status" className="rounded-2xl border border-[#dce8e4] bg-white p-10 text-center text-sm text-[#71827f]">
            Loading your profile…
          </div>
        )}

        {loadError && (
          <div role="alert" className="rounded-2xl border border-[#efd2d0] bg-white p-8 text-center">
            <p className="text-sm text-[#a44f4d]">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setLoadError('')
                setLoading(true)
                setRetryCount((count) => count + 1)
              }}
              className="mt-4 rounded-xl border border-[#dce8e4] px-4 py-2 text-sm font-semibold text-[#29413e] transition hover:bg-[#f5f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63]"
            >
              Try again
            </button>
          </div>
        )}

        {!profileLoading && !loadError && (
          <>
            {saveSuccess && (
              <p role="status" className="mb-4 rounded-xl border border-[#cfe4df] bg-[#e8f1ef] px-4 py-3 text-sm text-[#176b63]">
                {saveSuccess}
              </p>
            )}

            <section className="overflow-hidden rounded-2xl border border-[#dce8e4] bg-white shadow-sm">
              <div aria-hidden="true" className="h-28 bg-[#e8f1ef] sm:h-36" />
              <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
                <div className="-mt-10 grid size-20 shrink-0 place-items-center rounded-2xl border-4 border-white bg-[#176b63] text-2xl font-semibold text-white shadow-sm sm:-mt-12 sm:size-24">
                  {initials || <UserRound aria-hidden="true" className="size-9" />}
                </div>
                <div className="min-w-0 pb-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71827f]">Connectly member</p>
                  <h2 className="mt-1 truncate text-2xl font-semibold capitalize tracking-tight text-[#172a2a]">
                    {name || 'Your profile'}
                  </h2>
                  {user.email && <p className="mt-1 truncate text-sm text-[#71827f]">{user.email}</p>}
                </div>
              </div>
            </section>

            <div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              <section className="rounded-2xl border border-[#dce8e4] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold text-[#29413e]">About</h2>
                <p className="mt-3 text-sm leading-6 text-[#71827f]">
                  {user.about?.trim() || 'No bio has been added to this profile.'}
                </p>
              </section>

              {editing ? (
                <form onSubmit={saveProfile} className="rounded-2xl border border-[#dce8e4] bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5">
                    <h2 className="text-base font-semibold text-[#29413e]">Edit profile details</h2>
                    <p className="mt-1 text-sm text-[#71827f]">Update your name and gender.</p>
                  </div>

                  {formError && (
                    <p role="alert" className="mb-4 rounded-xl border border-[#efd2d0] bg-[#fff8f7] px-3.5 py-3 text-sm text-[#a44f4d]">
                      {formError}
                    </p>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-[#29413e]">
                      First name
                      <input
                        autoComplete="given-name"
                        required
                        value={draft.firstName}
                        onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))}
                        className="mt-2 h-11 w-full rounded-xl border border-[#dce8e4] bg-white px-3.5 text-sm outline-none transition focus:border-[#5da69d] focus:ring-2 focus:ring-[#5da69d]/20"
                      />
                    </label>
                    <label className="block text-sm font-medium text-[#29413e]">
                      Last name
                      <input
                        autoComplete="family-name"
                        value={draft.lastName}
                        onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))}
                        className="mt-2 h-11 w-full rounded-xl border border-[#dce8e4] bg-white px-3.5 text-sm outline-none transition focus:border-[#5da69d] focus:ring-2 focus:ring-[#5da69d]/20"
                      />
                    </label>
                    <label className="block text-sm font-medium text-[#29413e] sm:col-span-2">
                      Gender
                      <select
                        value={draft.gender}
                        onChange={(event) => setDraft((current) => ({ ...current, gender: event.target.value }))}
                        className="mt-2 h-11 w-full rounded-xl border border-[#dce8e4] bg-white px-3.5 text-sm capitalize outline-none transition focus:border-[#5da69d] focus:ring-2 focus:ring-[#5da69d]/20"
                      >
                        {!user.gender && <option value="">Not specified</option>}
                        {genderOptions.map((gender) => (
                          <option key={gender} value={gender}>{gender}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#e8f0ed] pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#dce8e4] px-4 py-2 text-sm font-semibold text-[#526763] transition hover:bg-[#f5f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63] disabled:opacity-50"
                    >
                      <X aria-hidden="true" className="size-4" /> Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#176b63] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#12584f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63] disabled:cursor-wait disabled:opacity-60"
                    >
                      <Save aria-hidden="true" className="size-4" />
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <section className="rounded-2xl border border-[#dce8e4] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-base font-semibold text-[#29413e]">Personal information</h2>
                  <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                    {user.email && <DetailItem icon={Mail} label="Email">{user.email}</DetailItem>}
                    {user.age !== undefined && user.age !== null && (
                      <DetailItem icon={UserRound} label="Age">{user.age}</DetailItem>
                    )}
                    {user.gender && (
                      <DetailItem icon={UserRound} label="Gender">
                        <span className="capitalize">{user.gender}</span>
                      </DetailItem>
                    )}
                    {joinedDate && <DetailItem icon={CalendarDays} label="Member since">{joinedDate}</DetailItem>}
                  </dl>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default MyProfile
