import { AuthState, AuthAction } from '../types';
import { SIGN_IN, SIGN_UP, REFRESH, LOGOUT } from '../actions';


export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
      };
    case SIGN_UP:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: '',
        isAuthenticated: action.payload.isAuthenticated,
      };
    case REFRESH:
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};
export default authReducer;
