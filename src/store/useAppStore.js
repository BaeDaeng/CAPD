import { create } from 'zustand';
import { clearStoredSession, getStoredSession, saveStoredSession } from '../api/apiClient';

const storedSession = getStoredSession();

const makeUser = (role, data) => ({
  role,
  userId: data.userId,
  patientId: data.patientId,
  doctorId: data.doctorId,
  name: data.name,
  expiresAt: data.expiresAt,
});

const makeSession = (role, data) => ({
  role,
  accessToken: data.accessToken,
  refreshToken: data.refreshToken || null,
  expiresAt: data.expiresAt,
  user: makeUser(role, data),
  issuedAt: Date.now(),
});

const useAppStore = create((set) => ({
  user: storedSession?.user || null,
  session: storedSession,
  selectedPatientId: null,

  currentDoctorId: storedSession?.user?.doctorId || null,
  currentDoctorName: storedSession?.user?.role === 'doctor' ? storedSession.user.name : null,
  currentPatientId: storedSession?.user?.patientId || null,

  isAuthenticated: Boolean(storedSession?.accessToken),

  setUser: (user) => set({ user }),

  setSession: (role, data) => {
    const session = makeSession(role, data);
    saveStoredSession(session);

    set({
      session,
      user: session.user,
      isAuthenticated: true,
      currentDoctorId: session.user.doctorId || null,
      currentDoctorName: role === 'doctor' ? session.user.name : null,
      currentPatientId: session.user.patientId || null,
    });
  },

  logout: () => {
    clearStoredSession();
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      selectedPatientId: null,
      currentDoctorId: null,
      currentDoctorName: null,
      currentPatientId: null,
    });
  },

  setSelectedPatientId: (id) => set({ selectedPatientId: id }),

}));

export default useAppStore;
