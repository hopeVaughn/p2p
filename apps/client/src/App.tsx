import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Landing, PageNotFound, Register } from './Pages';
import { Profile, AddBathroom, Search } from './Pages/Protected_Routes';
import { ProtectedRoute } from "./Pages/Components";
// import { useAuth } from './utils/Context'; // Assuming you have some sort of Auth context

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    children: [
      // Additional nested routes can be added here if required for the Landing page
    ]
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/addbathroom",
    element: <ProtectedRoute><AddBathroom /></ProtectedRoute>
  },
  {
    path: "/search",
    element: <ProtectedRoute><Search /></ProtectedRoute>
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]);

const App = () => {
  return (
    <>
      {/* Any global components like Navbar can be added here */}
      <RouterProvider router={router} />
      {/* Any other global components or footers can be added here */}
    </>
  );
};

export default App;
