
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import { Provider } from 'react-redux'
import store from './utils.js/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Body from './components/Body'
import  Home  from './components/Home'
import Feed from './components/Feed'



const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/app",
     children: [
      {
        path: "/app",
        element: <App />
      },
      {
        path: "feed",
        element: <Feed />
      }, 
        {
        path: "login",
        element: <Login />
      }, 
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={appRouter}>
    </RouterProvider>
  </Provider>


)
