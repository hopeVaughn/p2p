import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./Pages/Components";
import { AuthProvider } from "./utils/context";
import { Landing, PageNotFound, Register } from './Pages';
import { Profile, AddBathroom, Search } from "./Pages/Protected_Routes";
const routes = [
  {
    path: "/",
    index: true,
    element: <Landing />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/user",
    element: <ProtectedRoute />,
    children: [
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "addbathroom",
        element: <AddBathroom />
      },
      {
        path: "search",
        element: <Search />
      }
    ]
  },
  {
    path: "*",
    element: <PageNotFound />
  }
];

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
