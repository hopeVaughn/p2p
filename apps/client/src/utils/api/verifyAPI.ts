import api from './axiosDefault';

const verifyBaseURL = 'verify/';


export type VerifyBathroom = {
  bathroomId: string;
};



// API calls

// Verify a bathroom
export const verifyBathroomAPI = async (data: VerifyBathroom) => {
  const response = await api.post(`${verifyBaseURL}`, data);
  return response.data;
};

export const countVerifyAPI = async (data: string) => {
  const response = await api.get(`${verifyBaseURL}`, { data });
  return response.data;
};