import api from './axios';

export const getMyAttendance = () => api.get('/attendance/my');
export const getMyFees = () => api.get('/fees/my');
export const getMyResults = () => api.get('/results/my');