export type ModuleItem = {
  id: string;
  code: string;
  name: string;
  letter: string;
  iconBg: string;
  iconColor: string;
  statusLine?: string;
};

export type FeedbackListItem = {
  id: string;
  dotColor: string;
  title: string;
  excerpt: string;
  status: string;
  statusTone: 'green' | 'orange' | 'blue';
  timeAgo: string;
  responseSnippet?: string;
};

export type AlertItem = {
  id: string;
  icon: 'chat' | 'refresh';
  title: string;
  body: string;
  timeAgo: string;
  isRead?: boolean;
  /** Links notification to feedback detail when present (API `referenceId`). */
  referenceId?: string | null;
};

export type ImpactEntry = {
  id: string;
  youSaid: string;
  weDid: string;
  students: number;
  moduleCode?: string;
};
