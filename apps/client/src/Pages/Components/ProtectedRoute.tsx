import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { accessTokenExpired, decodeAccessToken } from "../../utils/helpers";
import { Dashboard } from '.';
import { useRefreshToken } from '../../utils/hooks';
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from '../Components/';

const ProtectedRoute = ({ requiredRoles }: { requiredRoles?: string[]; }) => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  const { refreshToken, isLoading: isRefreshing } = useRefreshToken();
  const activeRefreshToken = sessionStorage.getItem('refreshToken') || '';

  // Check authentication and roles
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('accessToken') ? true : false;
    const decodedToken = decodeAccessToken();

    if (!isAuthenticated || (requiredRoles && !requiredRoles.some(role => userRoles.includes(role)))) {
      navigate('/pagenotfound'); // Redirect to login if not authenticated or roles don't match
    } else if (decodedToken && decodedToken.roles) {
      setUserRoles(decodedToken.roles);
    }
  }, [navigate, requiredRoles, userRoles]);

  // Handle token refresh
  useEffect(() => {
    if (accessTokenExpired()) {
      refreshToken({ activeRefreshToken });
    }
  }, [refreshToken, activeRefreshToken]);

  // Display loading spinner during token refresh
  if (isRefreshing) {
    return <LoadingSpinner />;
  }

  // Render the protected component
  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
};

export default ProtectedRoute;
