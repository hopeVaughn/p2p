import api from './axiosDefault';

const verifyBaseURL = 'verify/';



// API calls

// Verify a bathroom
export const verifyBathroomAPI = async (bathroomId: string, userId: string) => {
  const response = await api.post(`${verifyBaseURL}${bathroomId}`, { bathroomId, userId });
  return response.data;
};