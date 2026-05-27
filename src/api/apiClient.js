import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './endpoints';

const AUTH_STORAGE_KEY = 'capd_auth_session';

export const getStoredSession = () => {
  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    return null;
  }
};

export const saveStoredSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const session = getStoredSession();
  const token = session?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrap = (response) => {
  const body = response.data;

  if (body && typeof body === 'object' && 'success' in body) {
    if (!body.success) {
      throw new Error(body.message || '요청 처리에 실패했습니다.');
    }

    return body.data;
  }

  return body;
};

export const apiRequest = async (config) => {
  try {
    const response = await apiClient(config);
    return unwrap(response);
  } catch (error) {
    const message = error.response?.data?.message || error.message || '서버 요청 중 오류가 발생했습니다.';
    const apiError = new Error(message);
    apiError.status = error.response?.status;
    apiError.data = error.response?.data;
    throw apiError;
  }
};

export const authApi = {
  loginPatient: (payload) => apiRequest({
    method: 'post',
    url: ENDPOINTS.auth.patientTokens,
    data: payload,
  }),
  loginDoctor: (payload) => apiRequest({
    method: 'post',
    url: ENDPOINTS.auth.doctorTokens,
    data: payload,
  }),
  logoutPatient: () => apiRequest({
    method: 'delete',
    url: ENDPOINTS.auth.patientTokens,
  }),
  logoutDoctor: () => apiRequest({
    method: 'delete',
    url: ENDPOINTS.auth.doctorTokens,
  }),
};

export const patientApi = {
  signUp: (payload) => apiRequest({ method: 'post', url: ENDPOINTS.patients.root, data: payload }),
  getMe: () => apiRequest({ method: 'get', url: ENDPOINTS.patients.me }),
  deleteMe: () => apiRequest({ method: 'delete', url: ENDPOINTS.patients.me }),
};

export const doctorApi = {
  signUp: (payload) => apiRequest({ method: 'post', url: ENDPOINTS.doctors.root, data: payload }),
  getMe: () => apiRequest({ method: 'get', url: ENDPOINTS.doctors.me }),
  deleteMe: () => apiRequest({ method: 'delete', url: ENDPOINTS.doctors.me }),
  getPatients: () => apiRequest({ method: 'get', url: ENDPOINTS.doctors.patients }),
  registerPatient: (payload) => apiRequest({ method: 'post', url: ENDPOINTS.doctors.patients, data: payload }),
  getPatientProfile: (patientId) => apiRequest({ method: 'get', url: ENDPOINTS.doctors.patientById(patientId) }),
  searchPatientsByName: (name) => apiRequest({ method: 'get', url: ENDPOINTS.doctors.patientsByName, params: { name } }),
};

export const capdApi = {
  getMine: () => apiRequest({ method: 'get', url: ENDPOINTS.capds.root }),
  getMineByDate: (date) => apiRequest({ method: 'get', url: ENDPOINTS.capds.byDate, params: { date } }),
  getTemp: (date) => apiRequest({ method: 'get', url: ENDPOINTS.capds.temp, params: { date } }),
  saveTemp: (payload) => apiRequest({ method: 'post', url: ENDPOINTS.capds.temp, data: payload }),
  submit: (payload) => apiRequest({ method: 'post', url: ENDPOINTS.capds.submit, data: payload }),
  getById: (capdId) => apiRequest({ method: 'get', url: ENDPOINTS.capds.byId(capdId) }),
  updateCommon: (capdId, payload) => apiRequest({ method: 'put', url: ENDPOINTS.capds.byId(capdId), data: payload }),
  deleteCommon: (capdId) => apiRequest({ method: 'delete', url: ENDPOINTS.capds.byId(capdId) }),
  getSession: ({ date, sessionNumber }) => apiRequest({
    method: 'get',
    url: ENDPOINTS.capds.sessions,
    params: { date, sessionNumber },
  }),
  updateSession: (sessionId, payload) => apiRequest({ method: 'put', url: ENDPOINTS.capds.sessionById(sessionId), data: payload }),
  deleteSession: (sessionId) => apiRequest({ method: 'delete', url: ENDPOINTS.capds.sessionById(sessionId) }),
  getDoctorRecords: (patientId) => apiRequest({ method: 'get', url: ENDPOINTS.capds.doctorAll(patientId) }),
  getDoctorRecordById: (patientId, capdId) => apiRequest({ method: 'get', url: ENDPOINTS.capds.doctorById(patientId, capdId) }),
  getDoctorRecordByDate: (patientId, date) => apiRequest({
    method: 'get',
    url: ENDPOINTS.capds.doctorByDate(patientId),
    params: { date },
  }),
};

export const reservationApi = {
  create: (payload) => apiRequest({ method: 'post', url: ENDPOINTS.reservations.root, data: payload }),
  getMine: () => apiRequest({ method: 'get', url: ENDPOINTS.reservations.patient }),
  getDoctorByDate: (date) => apiRequest({ method: 'get', url: ENDPOINTS.reservations.doctorByDate, params: { date } }),
  delete: (reservationId) => apiRequest({ method: 'delete', url: ENDPOINTS.reservations.byId(reservationId) }),
};

export const surveyApi = {
  getDoctorQuestions: (reservationId) => apiRequest({ method: 'get', url: ENDPOINTS.surveys.doctorQuestions(reservationId) }),
  createQuestion: (reservationId) => apiRequest({ method: 'post', url: ENDPOINTS.surveys.doctorQuestions(reservationId) }),
  getDoctorAnswers: (reservationId) => apiRequest({ method: 'get', url: ENDPOINTS.surveys.answers(reservationId) }),
  submitAnswers: (reservationId, payload) => apiRequest({ method: 'post', url: ENDPOINTS.surveys.answers(reservationId), data: payload }),
  explainQuestion: (questionId) => apiRequest({ method: 'post', url: ENDPOINTS.surveys.explain(questionId) }),
  approveQuestion: (questionId) => apiRequest({ method: 'patch', url: ENDPOINTS.surveys.approve(questionId) }),
  rejectQuestion: (questionId) => apiRequest({ method: 'patch', url: ENDPOINTS.surveys.reject(questionId) }),
  resetQuestion: (questionId) => apiRequest({ method: 'patch', url: ENDPOINTS.surveys.reset(questionId) }),
  getPatientQuestions: (reservationId) => apiRequest({ method: 'get', url: ENDPOINTS.surveys.patientQuestions(reservationId) }),
};

export const chatApi = {
  getPatientHistory: () => apiRequest({ method: 'get', url: ENDPOINTS.chat.patient }),
  sendPatientMessage: (payload) => apiRequest({ method: 'post', url: ENDPOINTS.chat.patient, data: payload }),
  getDoctorHistory: () => apiRequest({ method: 'get', url: ENDPOINTS.chat.doctor }),
  sendDoctorMessage: (patientId, payload) => apiRequest({ method: 'post', url: ENDPOINTS.chat.doctorPatient(patientId), data: payload }),
};

export const reportApi = {
  getReports: (patientId) => apiRequest({ method: 'get', url: ENDPOINTS.reports.patient(patientId) }),
  generate: (patientId, payload) => apiRequest({ method: 'post', url: ENDPOINTS.reports.patient(patientId), data: payload }),
  createPdf: (reportId) => apiRequest({ method: 'post', url: ENDPOINTS.reports.pdf(reportId) }),
  getPdfUrl: (reportId) => apiRequest({ method: 'get', url: ENDPOINTS.reports.pdf(reportId) }),
};

export const anomalyApi = {
  getResults: (patientId) => apiRequest({ method: 'get', url: ENDPOINTS.anomaly.patient(patientId) }),
  analyze: (patientId, date) => apiRequest({ method: 'post', url: ENDPOINTS.anomaly.analyze(patientId), params: { date } }),
};

export { AUTH_STORAGE_KEY };
