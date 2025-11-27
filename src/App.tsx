import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout'
import { EmployeePage } from './pages/EmployeeList/EmployeeList'

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
      ],
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
