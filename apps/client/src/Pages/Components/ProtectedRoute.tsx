import Error from "../Error";
import { ProtectedRouteProps } from "../../utils/types";
import { useAuth } from "../../utils/context";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Error />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;