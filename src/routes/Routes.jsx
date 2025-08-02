import Login from '../pages/Login'
import Register from '../pages/Register'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Canvas from '../pages/Canvas'
import Modal from '../components/Modal'



const router = createBrowserRouter([
    
     
            { path: '/', element: <Dashboard />  },
            {path: '/login', element:<Login /> },
            {path: '/register', element: <Register />},
            {path: '/canvas/:canvasId' , element: <Canvas />},
            {path: 'testing' , element: <Modal />}

        
    

]);




const Routes = () => {
    return (
   
    <RouterProvider router ={router} />
  )
}

export default Routes