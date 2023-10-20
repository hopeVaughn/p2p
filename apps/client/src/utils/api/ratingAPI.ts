import api from './axiosDefault';

const ratingBaseURL = 'rating/';

type Rating = {
  bathroomId: string;
  ratedById: string;
  stars: number;
};

export const createOrUpdateRatingAPI = async (data: Rating) => {
  const response = await api.post(`${ratingBaseURL}`, data);
  return response.data;
};