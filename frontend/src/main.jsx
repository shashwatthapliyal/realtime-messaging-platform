
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import { Provider } from 'react-redux'
import store from './utils.js/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import  Home  from './components/Home'
import Feed from './components/Feed'
import Connections from './components/Connections'
import SettingsPage from './components/Settings'
import MyProfile from './components/MyProfile'
import Chat from './components/Chat'
import Requests from './components/Requests'



const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        index: true,
        element: <Feed />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "connections",
        element: <Connections />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
        {
        path: "settings",
        element: <SettingsPage />,
      },  {
        path: "profile",
        element: <MyProfile />,
      },
      {
        path: "chat/:id",
        element: <Chat />,
      },
    ],
  },
])


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={appRouter}>
    </RouterProvider>
  </Provider>


)
