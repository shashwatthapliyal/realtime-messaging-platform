import './App.css'
import { Outlet, useNavigate } from 'react-router-dom'
import Nav from './components/Nav'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from './assets/constants'
import { addUser } from './utils.js/userSlice'
function App() {
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)
  // console.log(user)


  useEffect(() => {
    async function fetchUser() {
      try {

        if (Object.keys(user).length != 0) return
        const data = await axios.get(BASE_URL + "/profile", { withCredentials: true })
        dispatch(addUser(data.data))
        // console.log("data   ",data)
      }
      catch (err) {
        if (err.status == 401) navigate("login")
      }
    }
    fetchUser()
  }, [])

  return (
    <div className="app-shell">
      <Nav />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
