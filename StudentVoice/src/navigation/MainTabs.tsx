import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentMainTabs } from './StudentMainTabs';
import { TeacherMainTabs } from './TeacherMainTabs';

export function MainTabNavigator() {
  const { user } = useAuth();
  if (user?.role === 'teacher') {
    return <TeacherMainTabs />;
  }
  return <StudentMainTabs />;
}
