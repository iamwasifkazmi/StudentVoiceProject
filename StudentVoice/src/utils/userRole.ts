/**
 * Resolves account role for UI. **Explicit `role` from the API always wins** so the app
 * matches `requireTeacher` on the server. Staff-style IDs only imply teacher when `role`
 * is missing or unknown — otherwise a student with an accidental STAFF-… ID would see the
 * teacher shell and get 403 on `/teacher/feedback` (empty inbox).
 */
export function resolveAccountRole(user: {
  role?: string | null;
  studentId?: string;
}): 'student' | 'teacher' {
  const r = typeof user.role === 'string' ? user.role.toLowerCase() : '';
  if (r === 'teacher') {
    return 'teacher';
  }
  if (r === 'student') {
    return 'student';
  }
  const sid = user.studentId ?? '';
  if (/^(STAFF-|TEAC-)/i.test(sid)) {
    return 'teacher';
  }
  return 'student';
}
