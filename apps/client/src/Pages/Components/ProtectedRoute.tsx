import Error from "../Error";
import { ProtectedRouteProps } from "../../utils/types";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth(); // Replace with your actual auth logic

  if (!isAuthenticated) {
    return <Error />;  // Redirect to Error page if not authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;