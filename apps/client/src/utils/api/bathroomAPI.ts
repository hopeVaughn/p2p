import api from './axiosDefault';

const bathroomBaseURL = 'bathroom/';

export type Bathroom = {
  createdBy: string;
  gender: string;
  wheelchairAccessible: boolean;
  stars: number;
  keyRequirement: boolean;
  hoursOfOperation: string;
  lat: number;
  lng: number;
  address: string;
};

// API calls

// Add a new bathroom
export const createBathroomAPI = async (data: Bathroom) => {
  const response = await api.post(`${bathroomBaseURL}add_bathroom`, data);
  return response.data;
};


// Delete Bathroom
// the bathroom id is from the params, the userId is from the token
export const deleteBathroomAPI = async (id: string) => {
  const response = await api.delete(`${bathroomBaseURL}${id}`);
  return response.data;
}

