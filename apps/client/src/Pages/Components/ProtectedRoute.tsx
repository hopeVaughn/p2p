import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { accessTokenExpired, decodeAccessToken } from "../../utils/helpers";
import { Dashboard } from '.';
import { useRefreshToken } from '../../utils/hooks';
import { LoadingSpinner } from '../Components/';

const ProtectedRoute = ({ requiredRoles }: { requiredRoles?: string[]; }) => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  const { refreshToken, isLoading: isRefreshing } = useRefreshToken();
  const isAuthenticated = sessionStorage.getItem('accessToken') ? true : false;
  const activeRefreshToken = sessionStorage.getItem('refreshToken') || '';

  // Decoding the access token to get user roles
  useEffect(() => {
    const decodedToken = decodeAccessToken();
    if (decodedToken && decodedToken.roles) {
      setUserRoles(decodedToken.roles);
    }
  }, []);

  // Check authentication and roles for navigation
  useEffect(() => {
    if (!isAuthenticated || (requiredRoles && !requiredRoles.some(role => userRoles.includes(role)))) {
      navigate('/pagenotfound');
    }
  }, [isAuthenticated, requiredRoles, userRoles, navigate]);

  // Handle token refresh
  useEffect(() => {
    if (accessTokenExpired() && activeRefreshToken) {
      refreshToken({ activeRefreshToken });
    }
  }, [refreshToken, activeRefreshToken]);

  if (isRefreshing) {
    return <LoadingSpinner />;
  }

  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
};

export default ProtectedRoute;
