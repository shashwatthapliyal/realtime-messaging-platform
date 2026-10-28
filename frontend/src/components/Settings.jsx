import { createElement } from 'react'
import { Bell, Lock, Settings as SettingsIcon } from 'lucide-react'

const settings = [
  { title: 'Notifications', description: 'Choose how you want to hear about new messages.', icon: Bell },
  { title: 'Privacy and security', description: 'Review the account protections used by Connectly.', icon: Lock },
]

function Settings() {
  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f5f8f7] px-5 py-10 sm:px-8">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f1ef] text-[#176b63]"><SettingsIcon className="size-5" /></span><div><h1 className="text-2xl font-semibold text-[#172a2a]">Settings</h1><p className="mt-1 text-sm text-[#71827f]">Manage your messaging workspace.</p></div></div>
        <div className="overflow-hidden rounded-2xl border border-[#dce8e4] bg-white shadow-sm">
          {settings.map(({ title, description, icon }, index) => <div key={title} className={`flex items-center gap-4 p-5 sm:p-6 ${index ? 'border-t border-[#e8f0ed]' : ''}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f1f6f4] text-[#176b63]">{createElement(icon, { className: 'size-5' })}</span><div><h2 className="font-semibold text-[#29413e]">{title}</h2><p className="mt-1 text-sm text-[#71827f]">{description}</p></div></div>)}
        </div>
      </section>
    </main>
  )
}

export default Settings
