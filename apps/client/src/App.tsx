import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Landing, PageNotFound, Register } from './Pages';
import { Profile, AddBathroom, Search } from './Pages/Protected_Routes';
import { ProtectedRoute } from "./Pages/Components";
import { AuthProvider } from "./utils/context";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<ProtectedRouteWrapper />}>
            <Route path="profile" element={<Profile />} />
            <Route path="addbathroom" element={<AddBathroom />} />
            <Route path="search" element={<Search />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const ProtectedRouteWrapper: React.FC = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

export default App;
