import { BASE_URL } from '@/assets/constants'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '@/utils.js/feedSlice'
import { UsersRound } from 'lucide-react'
import UserCard from './UserCard'

const Feed = () => {
    const dispatch = useDispatch()
    const feed = useSelector((state) => state.feed)

    async function fetchFeed() {
        try {
            // console.log("Fetching feed from:", BASE_URL + "/feed")
            const res = await axios.get(BASE_URL + "/feed", { withCredentials: true })
            // console.log(res.data)
            dispatch(addFeed(res.data))
        }
        catch (err) {
            console.log("Status:", err.response?.status);
            console.log("Error:", err.response?.data);
            console.log("Message:", err.message);
        }
    }

    useEffect(() => {
        if (feed.length > 0) return
        console.log("Fetching feed...")
        fetchFeed()
    }, [])
    return (
        <main className="min-h-screen bg-[#f4f6fb] px-4 py-8 text-slate-900 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <header className="mb-8 border-b border-slate-200/80 pb-7 sm:mb-10 sm:pb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700 shadow-sm">
                        <UsersRound aria-hidden="true" className="size-4" />
                        <span>Community</span>
                    </div>
                    <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                        Discover people
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                        Explore profiles from your community.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {feed.map((user) => (
                        <UserCard user={user} key={user._id} />
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Feed
