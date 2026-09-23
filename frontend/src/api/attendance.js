import api from './axios';

export const markBulkAttendance = (data) => api.post('/attendance/bulk', data);
export const getAttendance = (params) => api.get('/attendance', { params });