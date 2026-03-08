export interface Language {
  name: string;
  color: string;
}

export interface Repository {
  name: string;
  description: string | null;
  primaryLanguage: Language | null;
  stargazerCount: number;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface Stats {
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
  totalPRs: number;
  totalIssues: number;
}

export interface UserData {
  calendar: ContributionCalendar;
  repos: Repository[];
  stats: Stats;
  isMock: boolean;
}
