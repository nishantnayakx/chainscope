// These types mirror db_schema.sql exactly.
// When Backend lead's real API is ready, only src/api/client.ts needs to change —
// every component below already expects this shape.

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type EntityType = 'wallet' | 'transaction' | 'ip' | 'cluster';

export interface Alert {
  id: string;
  entity: string;
  entityType: EntityType;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  detectionReason: string;
  timestamp: string; // ISO 8601
}

export interface AlertEvidence {
  topFeatures: { name: string; contribution: number }[];
  relatedTransactions: string[]; // txids
  relatedIps: string[];
  relatedWallets: string[];
  clusterId?: string;
  confidence: number; // 0-1
}

export interface WalletDetail {
  address: string;
  firstSeen: string;
  lastSeen: string;
  txCount: number;
  totalIn: number;
  totalOut: number;
  uniqueCounterparties: number;
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  riskScore?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string; // e.g. "input", "output", "observed_src"
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DashboardStats {
  totalTransactions: number;
  totalWallets: number;
  totalIps: number;
  suspiciousTransactions: number;
  suspiciousWallets: number;
  suspiciousClusters: number;
  highRiskAlerts: number;
  countryDistribution: { country: string; count: number }[];
}

export interface Investigation {
  alert: Alert;
  evidence: AlertEvidence;
  wallet?: WalletDetail;
  graph: GraphData;
  timeline: { timestamp: string; description: string }[];
}
