import api from './axiosDefault';

const bathroomBaseURL = 'bathroom/';

export enum BathroomGender {
  GENDERED = 'GENDERED',
  GENDER_NEUTRAL = 'GENDER_NEUTRAL',
  BOTH = 'BOTH'
}

export enum StallType {
  SINGLE_STALL = 'SINGLE_STALL',
  CONNECTED = 'CONNECTED',
}

export type Bathroom = {
  createdBy: string | null;
  gender: BathroomGender;
  stallType: StallType;
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
};


// Find all bathrooms near the user
export const findAllBathroomsAPI = async (lat: number, lng: number, radius: number) => {
  const response = await api.post(`${bathroomBaseURL}nearby`, { lat, lng, radius });
  console.log(response.data);
  return response.data;
};

// Find a bathroom by id
export const findBathroomByIdAPI = async (id: string) => {
  const response = await api.get(`${bathroomBaseURL}${id}`);
  console.log("response.data", response.data);
  return response.data;
};

// Confirm a user is the creator of a bathroom
export const confirmBathroomCreatorAPI = async (bathroomId: string) => {
  const response = await api.get(`${bathroomBaseURL}confirm`, {
    params: {
      bathroomId: bathroomId
    }
  });
  return response.data;
};
