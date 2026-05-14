/**
 * Resolves account role for UI and prefs. Staff-style IDs (STAFF-, TEAC-) imply
 * teacher when the API/cache omits `role` or it is out of sync with the id.
 */
export function resolveAccountRole(user: {
  role?: string | null;
  studentId?: string;
}): 'student' | 'teacher' {
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'teacher') {
    return 'teacher';
  }
  const sid = user.studentId ?? '';
  if (/^(STAFF-|TEAC-)/i.test(sid)) {
    return 'teacher';
  }
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'student') {
    return 'student';
  }
  return 'student';
}
