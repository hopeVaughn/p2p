import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Error from "../Error";
import { useAuth } from "../../utils/hooks";
import { accessTokenExpired, refreshTokenExpired, decodeAccessToken } from "../../utils/helpers";

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
        if (refreshTokenExpired()) {
          setLoading(false);
        } else {
          await refreshToken();
          setLoading(false);
        }
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
    return <Error />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
