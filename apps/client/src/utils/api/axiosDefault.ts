import axios from 'axios';
// import { refreshTokenAPI } from '.';

const api = axios.create({
  baseURL: "http://localhost:3000/api/"
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Axios Interceptors for Refreshing Tokens
// api.interceptors.response.use(
//   (response) => {
//     // If the response is successful, just return it.
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if the error is a 401 and that it's not a request trying to get a new token
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Mark the request as retried

//       // Try to refresh the token using your useRefreshToken hook
//       try {
//         const data = await refreshTokenAPI();
//         const newToken = data.accessToken;
//         sessionStorage.setItem('accessToken', newToken); // Save new token

//         // Update the token in the headers for the original request
//         api.defaults.headers['Authorization'] = `Bearer ${newToken}`;

//         // Retry the original request with the new token
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Handle token refresh error, e.g., navigate to login page or show a message to the user.
//         console.error("Token refresh failed:", refreshError);
//         sessionStorage.removeItem('accessToken');

//         // Emit a custom event to notify about token refresh failure.
//         const event = new Event('token-refresh-failed');
//         window.dispatchEvent(event);

//         // Remember to return or throw an error to stop the interceptor chain.
//         return Promise.reject(refreshError);
//       }
//     }

//     // If the error is due to other reasons, just throw it.
//     return Promise.reject(error);
//   }
// );


export default api;

// below is how we will handle the token refresh failure in the components

/*
useEffect(() => {
  const handleTokenRefreshFailed = () => {
    const navigate = useNavigate();
    navigate('/login');
  };

  window.addEventListener('token-refresh-failed', handleTokenRefreshFailed);

  return () => {
    window.removeEventListener('token-refresh-failed', handleTokenRefreshFailed);
  };
}, []);
*/
