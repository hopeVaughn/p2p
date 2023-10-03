import React, { useEffect, useState } from "react";
import Error from "../Error";
import { ProtectedRouteProps } from "../../utils/types";
import { useAuth } from "../../utils/hooks";
import { accessTokenExpired, refreshTokenExpired } from "../../utils/helpers";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, refreshToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect will check and refresh the token if necessary when the component mounts
    const checkAndRefreshToken = async () => {
      if (accessTokenExpired()) {
        if (refreshTokenExpired()) {
          // If refresh token is also expired, you can redirect to login or show an error
          // For this example, we will just set loading to false to proceed
          setLoading(false);
        } else {
          // If only access token is expired, try to refresh it
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
    return <div>Loading...</div>; // Show a loading spinner or similar while checking tokens
  }

  if (!isAuthenticated) {
    return <Error />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
