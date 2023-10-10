import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,  // Number of retry attempts
      retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),  // Time delay between retries
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    },
  },
});
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
