import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Landing, PageNotFound, Register } from './Pages';
import { Profile, AddBathroom, Search } from './Pages/Protected_Routes';
import { ProtectedRoute } from "./Pages/Components";
import { AuthProvider } from "./utils/context";
// import { useAuth } from './utils/Context'; // Assuming you have some sort of Auth context

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    children: [

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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

    </>
  );
};

export default App;
