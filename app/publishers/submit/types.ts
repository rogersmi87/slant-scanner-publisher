export type RedemptionPoint = {
  pctX: number;
  score: number;
  label: string;
  note: string;
  labelAbove?: boolean;
};

export type WorldviewAxis = {
  leftLabel: string;
  rightLabel: string;
  pct: number;
  justification: string;
};

export type ThemeWeight = 'primary' | 'secondary' | 'tertiary' | 'minor';

export type ThemeEntry = {
  theme: string;
  weight: ThemeWeight;
};

export type AudienceSegment = {
  segment: string;
  fit: 'Strong Fit' | 'Moderate Fit' | 'Limited Fit' | 'Likely Misaligned';
  notes: string;
};

export type RiskFlag = {
  flag: string;
  severity: 'High' | 'Medium' | 'Low';
  detail: string;
};

export type ManuscriptReport = {
  title: string;
  author: string;
  genre: string;
  estimatedWordCount: string;
  overallScore: number;
  executiveSummary: string;
  redemptionArc: {
    score: number;
    summary: string;
    points: RedemptionPoint[];
  };
  worldviewAxes: WorldviewAxis[];
  themeInventory: {
    conservative: ThemeEntry[];
    progressive: ThemeEntry[];
  };
  audienceFit: AudienceSegment[];
  channelRecommendations: {
    pitch: string[];
    deprioritize: string[];
  };
  riskFlags: RiskFlag[];
  methodology: string;
};
