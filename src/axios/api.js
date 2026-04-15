import axiosClient from './axios-client';

export const getStudentsCount = async () => {
  return axiosClient.get('/studentsCount');
};

export const getFacultyCount = async () => {
  return axiosClient.get('/scholarshipCallCount');
};

export const getUniversityCount = async () => {
  return axiosClient.get('/universityCount');
};
