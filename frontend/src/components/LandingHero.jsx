import { ArrowRight, CheckCheck, MessageCircle, Paperclip, Search, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

function LandingHero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
      <div className="relative z-10 max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cfe4df] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#176b63] shadow-sm">
          <MessageCircle aria-hidden="true" className="size-4" />
          <span>A calmer place to connect</span>
        </div>

        <h1 className="max-w-[11ch] text-[2.8rem] font-semibold leading-[1.04] tracking-[-0.055em] text-[#172a2a] sm:text-6xl lg:text-[4.5rem]">
          Conversations, all in one place.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-[#637774] sm:text-lg sm:leading-8">
          Find people, manage your connections, and continue conversations in a clear, comfortable workspace.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/app/login"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#176b63] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(23,107,99,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12584f] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#176b63] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Sign in to continue
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#637774]">
          <span className="inline-flex items-center gap-2"><CheckCheck className="size-4 text-[#176b63]" />People and conversations together</span>
        </div>
      </div>

      <div id="messaging-preview" className="relative mx-auto w-full max-w-2xl">
        <div aria-hidden="true" className="absolute -inset-8 rounded-[40px] bg-[#dceeea] blur-3xl" />
        <div className="relative overflow-hidden rounded-2xl border border-[#d6e5e1] bg-white shadow-[0_24px_70px_rgba(31,71,67,0.14)]">
          <div className="flex items-center justify-between border-b border-[#e5efec] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-[#e8f1ef] text-[#176b63]"><MessageCircle className="size-4" /></span>
              <div><p className="text-xs font-semibold text-[#172a2a]">Messages</p><p className="text-[11px] text-[#8a9a97]">Your conversations</p></div>
            </div>
            <Search className="size-4 text-[#91a4a0]" />
          </div>
          <div className="grid min-h-[330px] grid-cols-[0.8fr_1.2fr] sm:min-h-[390px]">
            <div className="border-r border-[#e5efec] bg-[#fbfdfc] p-3 sm:p-4">
              <div className="mb-4 h-8 rounded-lg bg-[#edf3f1]" />
              {['Maya Chen', 'Alex Morgan', 'Priya Shah'].map((name, index) => (
                <div key={name} className={`mb-1 flex items-center gap-2 rounded-lg p-2 ${index === 0 ? 'bg-[#e8f1ef]' : ''}`}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#b8d8d1] text-[10px] font-semibold text-[#176b63]">{name.split(' ').map((part) => part[0]).join('')}</span>
                  <div className="hidden min-w-0 sm:block"><p className="truncate text-xs font-semibold text-[#29413e]">{name}</p><p className="truncate text-[10px] text-[#91a09d]">Recent message</p></div>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 border-b border-[#e5efec] px-3 py-3 sm:px-5">
                <span className="grid size-8 place-items-center rounded-full bg-[#b8d8d1] text-[10px] font-semibold text-[#176b63]">MC</span>
                <div><p className="text-xs font-semibold text-[#29413e]">Maya Chen</p><p className="text-[10px] text-[#6da096]">Conversation preview</p></div>
              </div>
              <div className="flex-1 space-y-3 bg-[#f7fbfa] p-3 sm:p-5">
                <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs text-[#526763] shadow-sm">Are we still on for the project review?</div>
                <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-[#176b63] px-3 py-2 text-xs text-white shadow-sm">Absolutely. I’ll share the notes shortly.</div>
                <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs text-[#526763] shadow-sm">Perfect, see you then <span aria-hidden="true">✓</span></div>
              </div>
              <div className="flex items-center gap-2 border-t border-[#e5efec] p-3 sm:p-4">
                <Paperclip className="size-4 text-[#8ca19d]" />
                <span className="flex-1 rounded-lg bg-[#f1f6f4] px-3 py-2 text-[11px] text-[#a0afac]">Write a message...</span>
                <span className="grid size-8 place-items-center rounded-lg bg-[#176b63] text-white"><Send className="size-3.5" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
