export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AppTabs: undefined;
  SubjectDetails: { subjectId: string };
  TaskDetails: { taskId: string };
};

export type AppTabsParamList = {
  Home: undefined;
  Subjects: undefined;
  Attendance: undefined;
  Settings: undefined;
};