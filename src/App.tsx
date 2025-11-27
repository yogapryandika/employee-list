import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout'
import EmployeePage from './pages/EmployeeList/EmployeeList'
import Wizards from './pages/Wizards/Wizards'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "employees",
          element: <EmployeePage />,
        },
        {
          path: "wizards",
          element: <Wizards />,
        }
      ],
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
