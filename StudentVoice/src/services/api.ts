import { http } from './http';

type Ok<T> = { success: true; data: T };
type Err = { success: false; error: string };

async function unwrap<T>(p: Promise<{ data: Ok<T> | Err }>): Promise<T> {
  const { data } = await p;
  if (!data.success) {
    throw new Error((data as Err).error);
  }
  return (data as Ok<T>).data;
}

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  notificationPrefs: Record<string, unknown>;
  createdAt: string;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export const api = {
  login: (email: string, password: string) =>
    unwrap<LoginResult>(http.post('/auth/login', { email, password })),

  register: (body: {
    fullName: string;
    email: string;
    studentId: string;
    password: string;
  }) => unwrap<LoginResult>(http.post('/auth/register', body)),

  forgotPassword: (email: string) =>
    unwrap<{ message: string }>(http.post('/auth/forgot-password', { email })),

  getProfile: () => unwrap<AuthUser>(http.get('/user/profile')),

  updateProfile: (body: { fullName?: string; notificationPrefs?: Record<string, unknown> }) =>
    unwrap<{
      id: string;
      fullName: string;
      email: string;
      studentId: string;
      notificationPrefs: Record<string, unknown>;
      updatedAt: string;
    }>(http.put('/user/profile', body)),

  getModules: () =>
    unwrap<
      {
        id: string;
        code: string;
        name: string;
        lecturer: string;
        colour: string;
        department: string | null;
      }[]
    >(http.get('/modules')),

  getDashboard: () =>
    unwrap<{
      feedbackCount: number;
      actedOnCount: number;
      moduleCount: number;
      lastUpdated: string;
      recentActivity: {
        id: string;
        moduleCode: string;
        moduleName: string;
        moduleColour: string;
        status: 'submitted' | 'received' | 'acted_on';
        snippet: string;
        updatedAt: string;
      }[];
    }>(http.get('/stats/dashboard')),

  listFeedback: (params?: Record<string, string>) =>
    unwrap<{
      items: {
        id: string;
        moduleId: string;
        moduleCode: string;
        moduleName: string;
        lecturerName: string;
        moduleColour: string;
        rating: number;
        comment: string | null;
        status: 'submitted' | 'received' | 'acted_on';
        createdAt: string;
        updatedAt: string;
        weDidPreview: string | null;
      }[];
      pagination: { page: number; limit: number; total: number };
    }>(http.get('/feedback', { params })),

  getFeedback: (id: string) =>
    unwrap<{
      id: string;
      moduleId: string;
      moduleCode: string;
      moduleName: string;
      lecturerName: string;
      moduleColour: string;
      rating: number;
      comment: string | null;
      status: 'submitted' | 'received' | 'acted_on';
      createdAt: string;
      updatedAt: string;
      closingTheLoop: {
        id: string;
        youSaid: string;
        weDid: string;
        studentCount: number;
        createdAt: string;
      }[];
      studentCountBadge: number;
    }>(http.get(`/feedback/${id}`)),

  submitFeedback: (body: {
    moduleId: string;
    moduleCode: string;
    rating: number;
    comment?: string | null;
  }) =>
    unwrap<{
      id: string;
      moduleId: string;
      moduleCode: string;
      moduleName: string;
      lecturerName: string;
      moduleColour: string;
      rating: number;
      comment: string | null;
      status: 'submitted' | 'received' | 'acted_on';
      createdAt: string;
      updatedAt: string;
    }>(http.post('/feedback', body)),

  deleteFeedback: (id: string) =>
    unwrap<{ id: string; deleted: boolean }>(http.delete(`/feedback/${id}`)),

  listImpact: (params?: { search?: string; moduleId?: string }) =>
    unwrap<
      {
        id: string;
        moduleId: string;
        module: { code: string; name: string; lecturer: string; colour: string };
        youSaid: string;
        weDid: string;
        studentCount: number;
        createdAt: string;
      }[]
    >(http.get('/impact', { params })),

  listNotifications: (params?: Record<string, string>) =>
    unwrap<{
      items: {
        id: string;
        title: string;
        description: string;
        type: 'feedback_received' | 'action_taken' | 'reminder';
        isRead: boolean;
        referenceId: string | null;
        createdAt: string;
      }[];
      pagination: { page: number; limit: number; total: number };
    }>(http.get('/notifications', { params })),

  markNotificationRead: (id: string) =>
    unwrap<{ id: string; isRead: boolean }>(http.put(`/notifications/${id}/read`)),
};
