
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
import { addUser, updateUser } from '@/utils.js/userSlice'

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
    <div className="flex min-w-0 items-center gap-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#edf5f2] text-[#176b63]">
        {createElement(icon, {
          'aria-hidden': true,
          className: 'size-[18px]',
        })}
      </div>

      <div className="min-w-0">
        <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#91a29d]">
          {label}
        </dt>
        <dd className="mt-1 break-words text-sm font-semibold text-[#29413e]">
          {children}
        </dd>
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
        if (isActive) {
          setLoadError(
            'We could not load your profile. Check your session and try again.'
          )
        }
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [dispatch, retryCount, user.createdAt])

  const name = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ')

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

      setFormError(
        typeof message === 'string'
          ? message
          : 'Could not save your changes. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function editProfilePic(evt) {
    evt.preventDefault()

    const file = evt.target.files[0]
    const formData = new FormData()

    formData.append('profilePicture', file)

    console.log(file)


    const res = await axios.patch(
      BASE_URL + '/profile/profilePicture',
      formData,
      { withCredentials: true }
    )

    const profileUrl = res.data.imageUrl

    dispatch(updateUser({ profilePicture: profileUrl }))
  }

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f5f8f7] px-4 py-8 text-[#172a2a] sm:px-7 sm:py-10 lg:px-10">

      <div className="mx-auto w-full max-w-5xl">

        {/* PAGE HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#176b63]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#176b63]">
                Your account
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#172a2a] sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#83938e]">
              Manage your personal information and account details.
            </p>
          </div>

          {!loading && !loadError && !editing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#176b63] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#12584f] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63]"
            >
              <Pencil className="size-4" />
              Edit profile
            </button>
          )}

        </header>

        {/* LOADING */}
        {profileLoading && (
          <div
            role="status"
            className="rounded-3xl border border-[#e0eae6] bg-white px-6 py-20 text-center"
          >
            <div className="mx-auto mb-4 size-9 animate-spin rounded-full border-[3px] border-[#dcebe5] border-t-[#176b63]" />
            <p className="text-sm font-medium text-[#71827f]">
              Loading your profile...
            </p>
          </div>
        )}

        {/* ERROR */}
        {loadError && (
          <div
            role="alert"
            className="rounded-3xl border border-[#efd2d0] bg-white p-10 text-center shadow-sm"
          >
            <p className="text-sm text-[#a44f4d]">{loadError}</p>

            <button
              type="button"
              onClick={() => {
                setLoadError('')
                setLoading(true)
                setRetryCount((count) => count + 1)
              }}
              className="mt-5 rounded-xl border border-[#dce8e4] px-5 py-2.5 text-sm font-semibold text-[#29413e] transition hover:bg-[#f5f8f7]"
            >
              Try again
            </button>
          </div>
        )}

        {!profileLoading && !loadError && (
          <>
            {/* SUCCESS MESSAGE */}
            {saveSuccess && (
              <div
                role="status"
                className="mb-5 flex items-center gap-3 rounded-2xl border border-[#cfe4df] bg-[#eaf4f0] px-5 py-4 text-sm font-medium text-[#176b63]"
              >
                <span className="grid size-8 place-items-center rounded-full bg-white">
                  <Save className="size-4" />
                </span>
                {saveSuccess}
              </div>
            )}

            {/* PROFILE HERO */}
            <section className="overflow-hidden rounded-[28px] border border-[#e1eae6] bg-white shadow-[0_8px_30px_rgba(35,74,62,0.04)]">

              {/* COVER */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#d7ebe3] via-[#e9f3ef] to-[#d5e9e1] sm:h-40">

                <div className="absolute -right-12 -top-28 size-72 rounded-full border-[35px] border-white/20" />

                <div className="absolute -bottom-36 left-[30%] size-72 rounded-full border-[40px] border-white/20" />

                <div className="absolute right-6 top-5 sm:right-9 sm:top-7">
                  <span className="rounded-full border border-white/70 bg-white/40 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-[#176b63] backdrop-blur-md">
                    CONNECTLY
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#176b63]/20 via-[#176b63]/5 to-transparent" />
              </div>

              {/* AVATAR + USER */}
              <div className="relative px-5 pb-7 sm:px-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

                  {/* PROFILE PICTURE */}
                  <div className="relative -mt-14 size-28 shrink-0 sm:-mt-16 sm:size-32">

                    <div className="size-full overflow-hidden rounded-full border-[5px] border-white bg-[#e8f1ef] shadow-[0_5px_20px_rgba(23,107,99,0.16)]">

                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="grid size-full place-items-center bg-gradient-to-br from-[#176b63] to-[#104b46] text-3xl font-bold tracking-wide text-white">
                          {initials || (
                            <UserRound className="size-12" />
                          )}
                        </div>
                      )}

                    </div>

                    <label
                      htmlFor="profilePicture"
                      aria-label="Change profile picture"
                      className="absolute bottom-1 right-1 grid size-9 cursor-pointer place-items-center rounded-full border-[3px] border-white bg-[#176b63] text-white shadow-md transition duration-200 hover:scale-110 hover:bg-[#12584f]"
                    >
                      <Pencil className="size-4" />
                    </label>

                    <input
                      id="profilePicture"
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      className="sr-only"
                      onChange={editProfilePic}
                    />

                  </div>

                  {/* NAME AND EMAIL */}
                  <div className="min-w-0 flex-1 pb-1 pt-1">

                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#176b63]">
                      CONNECTLY MEMBER
                    </p>

                    <h2 className="truncate text-2xl font-bold tracking-tight text-[#172a2a] sm:text-3xl">
                      {name || 'Your profile'}
                    </h2>

                    {user.email && (
                      <p className="mt-1.5 flex items-center gap-2 truncate text-sm text-[#84938f]">
                        <Mail className="size-3.5 shrink-0" />
                        {user.email}
                      </p>
                    )}

                  </div>

                  {/* MEMBER SINCE */}
                  {joinedDate && (
                    <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#e5eee9] bg-[#f7faf8] px-4 py-3 sm:flex">
                      <CalendarDays className="size-4 text-[#176b63]" />
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#9aa9a4]">
                          Member since
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#29413e]">
                          {joinedDate}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </section>

            {/* PROFILE CONTENT */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

              {/* ABOUT CARD */}
              <section className="rounded-[24px] border border-[#e1eae6] bg-white p-6 shadow-[0_8px_30px_rgba(35,74,62,0.035)] sm:p-7">

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#176b63]">
                      INTRODUCTION
                    </p>
                    <h2 className="mt-1.5 text-lg font-bold tracking-tight text-[#203936]">
                      About me
                    </h2>
                  </div>

                  <div className="grid size-10 place-items-center rounded-xl bg-[#edf5f2] text-[#176b63]">
                    <UserRound className="size-5" />
                  </div>
                </div>

                <div className="h-px bg-[#edf2ef]" />

                <p className="mt-5 text-sm leading-7 text-[#758781]">
                  {user.about?.trim() || 'No bio has been added to this profile.'}
                </p>

              </section>

              {/* PERSONAL INFORMATION / EDIT FORM */}
              {editing ? (

                <form
                  onSubmit={saveProfile}
                  className="rounded-[24px] border border-[#e1eae6] bg-white p-6 shadow-[0_8px_30px_rgba(35,74,62,0.035)] sm:p-7"
                >

                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#176b63]">
                      ACCOUNT SETTINGS
                    </p>
                    <h2 className="mt-1.5 text-lg font-bold tracking-tight text-[#203936]">
                      Edit personal information
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-[#91a09a]">
                      Make changes to your profile details.
                    </p>
                  </div>

                  <div className="mb-5 h-px bg-[#edf2ef]" />

                  {formError && (
                    <p
                      role="alert"
                      className="mb-5 rounded-xl border border-[#efd2d0] bg-[#fff8f7] px-4 py-3 text-sm text-[#a44f4d]"
                    >
                      {formError}
                    </p>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">

                    <label className="block text-xs font-bold text-[#526763]">
                      First name

                      <input
                        autoComplete="given-name"
                        required
                        value={draft.firstName}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            firstName: event.target.value,
                          }))
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-[#e0eae5] bg-[#fafcfb] px-4 text-sm font-medium text-[#29413e] outline-none transition placeholder:text-[#aab8b2] hover:border-[#bfd6cc] focus:border-[#5da69d] focus:bg-white focus:ring-4 focus:ring-[#5da69d]/10"
                      />
                    </label>

                    <label className="block text-xs font-bold text-[#526763]">
                      Last name

                      <input
                        autoComplete="family-name"
                        value={draft.lastName}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            lastName: event.target.value,
                          }))
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-[#e0eae5] bg-[#fafcfb] px-4 text-sm font-medium text-[#29413e] outline-none transition placeholder:text-[#aab8b2] hover:border-[#bfd6cc] focus:border-[#5da69d] focus:bg-white focus:ring-4 focus:ring-[#5da69d]/10"
                      />
                    </label>

                    <label className="block text-xs font-bold text-[#526763] sm:col-span-2">
                      Gender

                      <select
                        value={draft.gender}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            gender: event.target.value,
                          }))
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-[#e0eae5] bg-[#fafcfb] px-4 text-sm font-medium capitalize text-[#29413e] outline-none transition hover:border-[#bfd6cc] focus:border-[#5da69d] focus:bg-white focus:ring-4 focus:ring-[#5da69d]/10"
                      >
                        {!user.gender && (
                          <option value="">Not specified</option>
                        )}

                        {genderOptions.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    </label>

                  </div>

                  {/* FORM ACTIONS */}
                  <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#edf2ef] pt-6 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e0eae5] px-5 py-3 text-sm font-semibold text-[#647771] transition hover:bg-[#f5f8f7] disabled:opacity-50"
                    >
                      <X className="size-4" />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#176b63] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12584f] hover:shadow-md disabled:cursor-wait disabled:opacity-60"
                    >
                      <Save className="size-4" />
                      {saving ? 'Saving...' : 'Save changes'}
                    </button>

                  </div>

                </form>

              ) : (

                <section className="rounded-[24px] border border-[#e1eae6] bg-white p-6 shadow-[0_8px_30px_rgba(35,74,62,0.035)] sm:p-7">

                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#176b63]">
                      YOUR DETAILS
                    </p>
                    <h2 className="mt-1.5 text-lg font-bold tracking-tight text-[#203936]">
                      Personal information
                    </h2>
                  </div>

                  <div className="mb-6 h-px bg-[#edf2ef]" />

                  <dl className="grid gap-7 sm:grid-cols-2">

                    {user.email && (
                      <DetailItem icon={Mail} label="Email address">
                        {user.email}
                      </DetailItem>
                    )}

                    {user.age !== undefined && user.age !== null && (
                      <DetailItem icon={UserRound} label="Age">
                        {user.age} years
                      </DetailItem>
                    )}

                    {user.gender && (
                      <DetailItem icon={UserRound} label="Gender">
                        <span className="capitalize">{user.gender}</span>
                      </DetailItem>
                    )}

                    {joinedDate && (
                      <DetailItem icon={CalendarDays} label="Member since">
                        {joinedDate}
                      </DetailItem>
                    )}

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
