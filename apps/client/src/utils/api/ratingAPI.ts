import api from './axiosDefault';

const ratingBaseURL = 'rating/';

export const createRatingAPI = async (bathroomId: string, ratedById: string, stars: number) => {
  const response = await api.post(`${ratingBaseURL}`, { bathroomId, ratedById, stars });
  return response.data;
};