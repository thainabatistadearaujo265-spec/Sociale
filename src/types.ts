export type UserPlan = 'free' | 'premium';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  niche?: string;
  plan: UserPlan;
  dailyUsageCount: number;
  lastUsageDate: string; // YYYY-MM-DD
  createdAt: any;
}

export type ContentType = 'post' | 'video' | 'idea' | 'bio' | 'hashtag' | 'calendar';

export interface SavedContent {
  id?: string;
  uid: string;
  type: ContentType;
  theme: string;
  content: any;
  createdAt: any;
}

export interface GeneratedPost {
  caption: string;
  hashtags: string[];
  emojis: string;
  visualIdea: string;
}

export interface GeneratedVideo {
  hook: string;
  script: string;
  cta: string;
  duration: '15s' | '30s' | '60s';
}

export interface GeneratedIdeas {
  posts: string[];
  videos: string[];
  stories: string[];
}

export interface GeneratedBio {
  bio: string;
}

export interface GeneratedHashtags {
  hashtags: string[];
}

export interface CalendarDay {
  day: number;
  type: string;
  topic: string;
}

export interface GeneratedCalendar {
  days: CalendarDay[];
}
