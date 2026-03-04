/**
 * AI-related types for Budget AI
 *
 * Types for AI insights, recommendations, and analysis.
 */

import type { Transaction, TransactionCategory } from './models';

// ============================================================================
// AI Insight Types
// ============================================================================

export type InsightType =
  | 'spending-pattern'
  | 'budget-alert'
  | 'saving-opportunity'
  | 'unusual-activity'
  | 'goal-progress'
  | 'category-analysis'
  | 'merchant-loyalty'
  | 'subscription-optimization'
  | 'emergency-fund'
  | 'seasonal-pattern'
  | 'day-of-week-pattern';

export type InsightSeverity = 'info' | 'warning' | 'success' | 'critical';

export interface AIInsight {
  id?: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  recommendation?: string;
  confidence?: number; // 0-1
  actionable?: boolean;
  action?: InsightAction;
  metadata?: Record<string, unknown>;
  relatedTransactions?: string[]; // Transaction IDs
  createdAt?: string;
  expiresAt?: string;
}

export interface InsightAction {
  label: string;
  type: 'create_budget' | 'adjust_budget' | 'review_transactions' | 'set_goal' | 'view_details';
  params?: Record<string, unknown>;
}

// ============================================================================
// AI Analysis Types
// ============================================================================

export interface SpendingPattern {
  category: TransactionCategory;
  averageAmount: number;
  frequency: number; // transactions per period
  trend: 'increasing' | 'decreasing' | 'stable';
  variance: number; // standard deviation
  percentageOfTotal: number;
}

export interface CategoryAnalysis {
  category: TransactionCategory;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  largestTransaction: Transaction;
  smallestTransaction: Transaction;
  trend: TrendAnalysis;
  comparison: ComparisonAnalysis;
}

export interface TrendAnalysis {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  period: 'week' | 'month' | 'quarter' | 'year';
  isSignificant: boolean;
}

export interface ComparisonAnalysis {
  comparedTo: 'previous_period' | 'average' | 'budget';
  difference: number;
  percentageDifference: number;
  isHigher: boolean;
}

// ============================================================================
// Prediction Types
// ============================================================================

export interface SpendingPrediction {
  category: TransactionCategory;
  predictedAmount: number;
  confidence: number; // 0-1
  period: 'week' | 'month' | 'quarter';
  basedOn: PredictionBasis;
  range: {
    min: number;
    max: number;
  };
}

export interface PredictionBasis {
  method: 'historical_average' | 'trend_analysis' | 'seasonal_pattern' | 'ml_model';
  dataPoints: number;
  timeRange: {
    start: string;
    end: string;
  };
}

// ============================================================================
// Anomaly Detection Types
// ============================================================================

export interface AnomalyDetection {
  transactionId: string;
  transaction: Transaction;
  anomalyType: AnomalyType;
  score: number; // 0-1, higher = more anomalous
  reason: string;
  suggestions: string[];
}

export type AnomalyType =
  | 'unusually_high_amount'
  | 'unusual_merchant'
  | 'unusual_time'
  | 'unusual_frequency'
  | 'duplicate_suspected'
  | 'category_mismatch';

// ============================================================================
// Recommendation Types
// ============================================================================

export interface AIRecommendation {
  id: string;
  type: RecommendationType;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  expectedBenefit?: string;
  estimatedSavings?: number;
  effort: 'low' | 'medium' | 'high';
  category?: TransactionCategory;
  action: RecommendationAction;
  metadata?: Record<string, unknown>;
}

export type RecommendationType =
  | 'reduce_spending'
  | 'increase_savings'
  | 'optimize_subscriptions'
  | 'negotiate_bills'
  | 'switch_providers'
  | 'consolidate_debt'
  | 'build_emergency_fund'
  | 'investment_opportunity';

export interface RecommendationAction {
  type: 'create' | 'update' | 'review' | 'external';
  resource?: 'budget' | 'goal' | 'transaction' | 'subscription';
  params?: Record<string, unknown>;
  externalUrl?: string;
}

// ============================================================================
// Merchant Analysis Types
// ============================================================================

export interface MerchantAnalysis {
  merchant: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  frequency: number; // transactions per month
  firstSeen: string;
  lastSeen: string;
  isRecurring: boolean;
  category: TransactionCategory;
  insights: MerchantInsight[];
}

export interface MerchantInsight {
  type: 'loyalty_opportunity' | 'subscription_detected' | 'price_increase' | 'unusual_charge';
  message: string;
  confidence: number;
}

// ============================================================================
// Subscription Analysis Types
// ============================================================================

export interface SubscriptionDetection {
  merchant: string;
  estimatedAmount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextExpectedDate: string;
  confidence: number;
  transactions: Transaction[];
  isActive: boolean;
  recommendation?: string;
}

// ============================================================================
// Goal Analysis Types
// ============================================================================

export interface GoalAnalysis {
  goalId: string;
  isOnTrack: boolean;
  projectedCompletionDate: string;
  requiredMonthlyContribution: number;
  currentPace: 'ahead' | 'on_track' | 'behind';
  gapAmount?: number;
  recommendations: string[];
}

// ============================================================================
// Emergency Fund Analysis Types
// ============================================================================

export interface EmergencyFundAnalysis {
  currentAmount: number;
  recommendedAmount: number;
  monthsOfExpenses: number;
  targetMonths: number;
  isAdequate: boolean;
  monthlyExpenses: number;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// Seasonal Pattern Types
// ============================================================================

export interface SeasonalPattern {
  category: TransactionCategory;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  averageSpending: number;
  variance: number;
  peakMonth: string;
  prediction: number;
  confidence: number;
}

// ============================================================================
// Day of Week Pattern Types
// ============================================================================

export interface DayOfWeekPattern {
  category: TransactionCategory;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  averageSpending: number;
  transactionCount: number;
  percentageOfTotal: number;
  recommendation?: string;
}

// ============================================================================
// AI Configuration Types
// ============================================================================

export interface AIConfig {
  insights: {
    enabled: boolean;
    refreshInterval: number; // minutes
    maxInsights: number;
    minConfidence: number; // 0-1
  };
  predictions: {
    enabled: boolean;
    lookbackPeriod: number; // days
    predictionHorizon: number; // days
  };
  anomalyDetection: {
    enabled: boolean;
    sensitivity: 'low' | 'medium' | 'high';
    threshold: number; // 0-1
  };
  recommendations: {
    enabled: boolean;
    maxRecommendations: number;
    minPriority: 'low' | 'medium' | 'high';
  };
}

// ============================================================================
// AI Request/Response Types
// ============================================================================

export interface GenerateInsightsRequest {
  userId: string;
  transactionLimit?: number;
  categories?: TransactionCategory[];
  dateRange?: {
    start: string;
    end: string;
  };
  insightTypes?: InsightType[];
}

export interface GenerateInsightsResponse {
  insights: AIInsight[];
  metadata: {
    generatedAt: string;
    transactionsAnalyzed: number;
    processingTime: number; // milliseconds
  };
}

export interface PredictSpendingRequest {
  userId: string;
  category: TransactionCategory;
  period: 'week' | 'month' | 'quarter';
  lookbackDays?: number;
}

export interface PredictSpendingResponse {
  prediction: SpendingPrediction;
  historicalData: {
    category: TransactionCategory;
    amounts: number[];
    dates: string[];
  };
}

export interface DetectAnomaliesRequest {
  userId: string;
  transactionIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sensitivity?: 'low' | 'medium' | 'high';
}

export interface DetectAnomaliesResponse {
  anomalies: AnomalyDetection[];
  summary: {
    totalAnalyzed: number;
    anomaliesFound: number;
    highRiskCount: number;
  };
}

// ============================================================================
// Type Guards
// ============================================================================

export function isAIInsight(obj: unknown): obj is AIInsight {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    'severity' in obj &&
    'title' in obj &&
    'description' in obj
  );
}

export function isAnomalyDetection(obj: unknown): obj is AnomalyDetection {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'transactionId' in obj &&
    'anomalyType' in obj &&
    'score' in obj
  );
}

export function isAIRecommendation(obj: unknown): obj is AIRecommendation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'type' in obj &&
    'priority' in obj &&
    'action' in obj
  );
}
