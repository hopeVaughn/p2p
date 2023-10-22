import api from './axiosDefault';

const ratingBaseURL = 'report/';

type Report = {
  bathroomId: string;
  reportedById: string | null;
  reason: string | undefined;
};

export const reportAPI = async (data: Report) => {
  const response = await api.post(`${ratingBaseURL}`, data);
  return response.data;
};