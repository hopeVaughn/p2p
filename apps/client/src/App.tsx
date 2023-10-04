import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./Pages/Components";
import { AuthProvider } from "./utils/context";
import { Home, PageNotFound, SignupRegister } from './Pages';
import { Profile, AddBathroom, Search } from "./Pages/Protected_Routes";
const routes = [
  {
    path: "/",
    index: true,
    element: <Home />
  },
  {
    path: "/login",
    element: <SignupRegister />
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
