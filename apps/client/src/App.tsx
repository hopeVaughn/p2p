import { createBrowserRouter, RouterProvider, Route, Routes } from "react-router-dom";
import { Landing, PageNotFound, Register } from './Pages';
import { Profile, AddBathroom, Search } from './Pages/Protected_Routes';
import { ProtectedRoute } from "./Pages/Components";
import { AuthProvider } from "./utils/context";
// import { useAuth } from './utils/Context'; // Assuming you have some sort of Auth context

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/user",
    element: <ProtectedRoute>
      <Routes>
        <Route path="profile" element={<Profile />} />
        <Route path="addbathroom" element={<AddBathroom />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </ProtectedRoute>
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]);


const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
