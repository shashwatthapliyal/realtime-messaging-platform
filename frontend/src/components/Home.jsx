import Nav from './Nav'
import LandingHero from './LandingHero'

function Home() {
  return (
    <div className="min-h-screen bg-[#f5f8f7] text-[#172a2a]">
      <Nav />
      <main>
        <LandingHero />
      </main>
      <footer className="border-t border-[#dce8e4] px-5 py-5 text-center text-xs text-[#7b8d89]">
        Connectly · Conversations in one place.
      </footer>
    </div>
  )
}

export default Home
