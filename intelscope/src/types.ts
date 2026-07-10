export interface PlatformDetail {
  exists: boolean;
  url: string;
  headline: string;
  metrics: string;
}

export interface Platforms {
  github: PlatformDetail;
  reddit: PlatformDetail;
  stackoverflow: PlatformDetail;
  youtube: PlatformDetail;
  medium: PlatformDetail;
  gitlab: PlatformDetail;
  linkedin: PlatformDetail;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface ChartDataPoint {
  platform: string;
  activity: number;
}

export interface LanguageUsagePoint {
  name: string;
  value: number;
}

export interface TimelinePoint {
  label: string;
  value: number;
}

export interface Visualizations {
  platformComparison: ChartDataPoint[];
  languageUsage: LanguageUsagePoint[];
  contributionTimeline: TimelinePoint[];
}

export interface RiskFactor {
  factor: string;
  risk: string; // "low" | "medium" | "high"
  details: string;
}

export interface RiskAssessment {
  riskScore: number;
  level: string; // "Low" | "Medium" | "High"
  factors: RiskFactor[];
  recommendations: string[];
}

export interface PersonalInfo {
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  publicRepos: number;
  followers: number;
  following: number;
  accountCreated: string;
  verified: boolean;
}

export interface OSINTProfile {
  id: string;
  username: string;
  timestamp: string;
  personalInfo: PersonalInfo;
  platforms: Platforms;
  skills: Skill[];
  visualizations: Visualizations;
  riskAssessment: RiskAssessment;
}

export interface WebsiteAnalysis {
  url: string;
  timestamp: string;
  pageTitle: string;
  metaDescription: string;
  sslStatus: string;
  technologies: string[];
  contactEmail: string;
  linkedSocials: string[];
  securityInsights: string[];
}

export interface SystemSettings {
  theme: "dark" | "light";
  exportFormat: string;
  cacheDuration: string;
  apiMockFallback: boolean;
}
