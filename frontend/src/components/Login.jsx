import { useState } from 'react'
import { Eye, EyeOff, MessageSquare } from 'lucide-react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '@/assets/constants'
import { addUser } from '@/utils.js/userSlice'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
const user=useSelector((store)=>store.user);

  async function handleSignIn(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true },
      )
      if(Object.keys(user).length===0) dispatch(addUser(response.data.user))
      // console.log(response.data.user)
      navigate('/app/feed')
    } catch (requestError) {
      const message = requestError.response?.data
      setError(typeof message === 'string' ? message : 'Unable to sign in. Check your email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-[#f5f8f7] px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#dce8e4] bg-white p-6 shadow-[0_18px_50px_rgba(31,71,67,0.08)] sm:p-8">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-[#e8f1ef] text-[#176b63]">
            <MessageSquare aria-hidden="true" className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-[#172a2a]">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-[#71827f]">Sign in to see your people and conversations.</p>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-[#efd2d0] bg-[#fff8f7] px-3.5 py-3 text-sm text-[#a44f4d]">{error}</p>}

        <form className="space-y-5" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#29413e]">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="h-11 w-full rounded-xl border border-[#dce8e4] bg-white px-3.5 text-sm text-[#172a2a] outline-none transition placeholder:text-[#9aa9a5] focus:border-[#5da69d] focus:ring-2 focus:ring-[#5da69d]/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#29413e]">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-11 w-full rounded-xl border border-[#dce8e4] bg-white px-3.5 pr-11 text-sm text-[#172a2a] outline-none transition placeholder:text-[#9aa9a5] focus:border-[#5da69d] focus:ring-2 focus:ring-[#5da69d]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-[#71827f] hover:text-[#176b63] focus-visible:outline-2 focus-visible:outline-[#176b63]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#176b63] px-4 text-sm font-semibold text-white transition hover:bg-[#12584f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b63] disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-[#8a9a97]">
          Sign in with the account credentials provided for your workspace.
        </p>
      </section>
    </main>
  )
}

export default Login
