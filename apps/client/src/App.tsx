import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./Pages/Components";
import { AuthProvider } from "./utils/context";
import { Home, PageNotFound, SignupRegister } from './Pages';
import { Profile } from "./Pages/Protected_Routes";

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
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        path: "profile",
        element: <Profile />
      },
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
