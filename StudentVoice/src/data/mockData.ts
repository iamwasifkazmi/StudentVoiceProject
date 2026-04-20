/** Static demo content aligned with dev spec seed module codes. */
export type ModuleItem = {
  id: string;
  code: string;
  name: string;
  letter: string;
  iconBg: string;
  iconColor: string;
  statusLine?: string;
};

export const MOCK_MODULES: ModuleItem[] = [
  {
    id: '1',
    code: 'CO7100',
    name: 'Research Dissertation',
    letter: 'R',
    iconBg: '#EDE9FE',
    iconColor: '#5B21B6',
    statusLine: 'Submitted 2 days ago',
  },
  {
    id: '2',
    code: 'CO6050',
    name: 'Human-Computer Interaction',
    letter: 'H',
    iconBg: '#D1FAE5',
    iconColor: '#047857',
    statusLine: 'Action taken',
  },
  {
    id: '3',
    code: 'CO6030',
    name: 'Software Development',
    letter: 'S',
    iconBg: '#FEE2E2',
    iconColor: '#B91C1C',
  },
  {
    id: '4',
    code: 'CO6080',
    name: 'Cloud Computing',
    letter: 'C',
    iconBg: '#DBEAFE',
    iconColor: '#1D4ED8',
    statusLine: 'Submitted 1 week ago',
  },
  {
    id: '5',
    code: 'CO6070',
    name: 'Data Science',
    letter: 'D',
    iconBg: '#FFEDD5',
    iconColor: '#C2410C',
  },
  {
    id: '6',
    code: 'CO6090',
    name: 'Cyber Security',
    letter: 'B',
    iconBg: '#CCFBF1',
    iconColor: '#0F766E',
  },
];

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

export const MOCK_MY_FEEDBACK: FeedbackListItem[] = [
  {
    id: 'f1',
    dotColor: '#22C55E',
    title: 'CO7210 – Concepts of User Experience',
    excerpt:
      'The recent assignment was a bit unclear in the requirements, but the lectures are great.',
    status: 'Received',
    statusTone: 'green',
    timeAgo: '2 days ago',
    responseSnippet: 'We did: assignment was a bit unclear in the....',
  },
  {
    id: 'f2',
    dotColor: '#3B82F6',
    title: 'CO7315 – Bio-Inspired Computation',
    excerpt:
      'The Wi-Fi drops constantly near the quiet study zone. Makes it hard to work.',
    status: 'Under Review',
    statusTone: 'orange',
    timeAgo: '2 days ago',
  },
  {
    id: 'f3',
    dotColor: '#3B82F6',
    title: 'CO7316 – Robotics',
    excerpt:
      'The Wi-Fi drops constantly near the quiet study zone. Makes it hard to work.',
    status: 'Updated',
    statusTone: 'blue',
    timeAgo: '2 days ago',
    responseSnippet: 'We did: assignment was a bit unclear in the....',
  },
];

export type AlertItem = {
  id: string;
  icon: 'chat' | 'refresh';
  title: string;
  body: string;
  timeAgo: string;
};

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'a1',
    icon: 'chat',
    title: 'Staff Responded',
    body: 'Responded to your feedback on CS301.',
    timeAgo: '1 day ago',
  },
  {
    id: 'a2',
    icon: 'refresh',
    title: 'Status Update',
    body: 'Your feedback on CO7100 moved to Responded.',
    timeAgo: '2 days ago',
  },
];

export type ImpactEntry = {
  id: string;
  youSaid: string;
  weDid: string;
  students: number;
};

export const MOCK_IMPACT: ImpactEntry[] = [
  {
    id: 'i1',
    youSaid: 'Lecture recordings were uploaded too late for revision.',
    weDid: 'Recordings now uploaded within 24 hours.',
    students: 47,
  },
  {
    id: 'i2',
    youSaid: 'Assignment briefs were unclear about word count.',
    weDid:
      'All briefs now include a standardised requirements checklist.',
    students: 31,
  },
  {
    id: 'i3',
    youSaid: 'Not enough practical coding exercises.',
    weDid: 'Added 2 additional hands-on labs per module.',
    students: 53,
  },
];
