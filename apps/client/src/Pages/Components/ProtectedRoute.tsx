import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { PageNotFound } from "..";
import { useAuth } from "../../utils/hooks";
import { accessTokenExpired, decodeAccessToken } from "../../utils/helpers";
import { Dashboard } from '.';
const ProtectedRoute = ({ requiredRoles }: { requiredRoles?: string[]; }) => {
  const { isAuthenticated, refreshToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const decodedToken = decodeAccessToken();
    if (decodedToken && decodedToken.roles) {
      setUserRoles(decodedToken.roles);
    }
  }, []);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (accessTokenExpired()) {
        setLoading(true);
        await refreshToken();
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkAndRefreshToken();
  }, [refreshToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || (requiredRoles && !requiredRoles.some(role => userRoles.includes(role)))) {
    return <PageNotFound />;
  }

  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
};

export default ProtectedRoute;
