import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  AppSettings: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  SeeImpact: undefined;
};

export type MyFeedbackStackParamList = {
  MyFeedbackMain: undefined;
  FeedbackDetail: { feedbackId: string };
};

export type SubmitStackParamList = {
  SelectModule: undefined;
  RateComment: undefined;
  ReviewSubmit: undefined;
  Confirmation: { feedbackId: string };
};

export type TeacherFeedbackStackParamList = {
  TeacherInboxMain: undefined;
  TeacherFeedbackDetail: { feedbackId: string };
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  MyFeedback: NavigatorScreenParams<MyFeedbackStackParamList> | undefined;
  Submit: NavigatorScreenParams<SubmitStackParamList> | undefined;
  Alerts: undefined;
  Settings: undefined;
};

export type TeacherTabParamList = {
  TeacherInbox: NavigatorScreenParams<TeacherFeedbackStackParamList> | undefined;
  Settings: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<MainTabParamList, 'Home'>
  >;

export type SubmitStackScreenProps<T extends keyof SubmitStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SubmitStackParamList, T>,
    BottomTabScreenProps<MainTabParamList, 'Submit'>
  >;
