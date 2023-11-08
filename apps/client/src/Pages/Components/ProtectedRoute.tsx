import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { accessTokenExpired, decodeAccessToken } from "../../utils/helpers";
import { Dashboard } from '.';
import { useRefreshToken } from '../../utils/hooks';
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from '../Components/';
const ProtectedRoute = ({ requiredRoles }: { requiredRoles?: string[]; }) => {
  const accessToken = sessionStorage.getItem('accessToken') || '';
  const { refreshToken, isLoading: isRefreshing } = useRefreshToken();
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const isAuthenticated = Boolean(sessionStorage.getItem('accessToken'));
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = decodeAccessToken();
    if (decodedToken && decodedToken.roles) {
      setUserRoles(decodedToken.roles);
    }
  }, []);

  useEffect(() => {
    if (accessTokenExpired() && !isAuthenticated) {
      refreshToken({ accessToken });
    }
  }, [refreshToken, isAuthenticated, accessToken]);

  if (isRefreshing) {
    return (
      <LoadingSpinner />
    );
  }

  if (!isAuthenticated || (requiredRoles && !requiredRoles.some(role => userRoles.includes(role)))) {
    navigate('/pagenotfound');
  }

  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
};

export default ProtectedRoute;
