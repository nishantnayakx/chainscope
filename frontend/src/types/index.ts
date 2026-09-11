// Bitcoin Transaction Intelligence Platform — API v1.0.0 Contract Types

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type PatternType = 'peeling_chain' | 'coinjoin' | 'anomaly' | 'fan_out' | 'fan_in';
export type EntityType = 'wallet' | 'transaction' | 'ip' | 'cluster';

// Paginated envelope
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Error envelope
export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// 1. Datasets
export interface DatasetImportResponse {
  dataset_id: string;
  job_id: string;
  status: 'ingesting' | 'queued' | 'done' | 'failed';
  message: string;
}

export interface DatasetStats {
  transactions: number;
  wallets: number;
  unique_ips: number;
  unique_asns: number;
  unique_countries: number;
  records_valid: number;
  records_errored: number;
}

export interface DatasetDetail {
  dataset_id: string;
  source_format: string;
  status: 'ingesting' | 'done' | 'failed';
  created_at: string;
  completed_at: string | null;
  stats: DatasetStats;
}

// 2. Transactions
export interface TransactionListItem {
  txid: string;
  timestamp: string;
  block_height: number;
  total_input_amount: number;
  total_output_amount: number;
  fee: number;
  input_count: number;
  output_count: number;
  is_coinbase: boolean;
  script_type: string;
  src_ip: string;
}

export interface TransactionDetail extends TransactionListItem {
  block_hash: string;
  transaction_index: number;
  version: number;
  locktime: number;
  transaction_size: number;
  transaction_weight: number;
  src_port?: number;
  dst_ip?: string;
  dst_port?: number;
}

// 3. Wallets
export interface WalletListItem {
  address: string;
  first_seen: string;
  last_seen: string;
  tx_count: number;
  total_received: number;
  total_sent: number;
  risk_score: number;
  risk_level: RiskLevel;
}

export interface WalletRiskBreakdown {
  address: string;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: number;
  components: {
    anomaly: number;
    peeling: number;
    coinjoin: number;
    cluster: number;
    network: number;
    propagated: number;
  };
  weights: {
    anomaly: number;
    peeling: number;
    coinjoin: number;
    cluster: number;
    network: number;
    propagated: number;
  };
}

// 4. Graph
export interface GraphNodeData {
  risk_score?: number;
  risk_level?: RiskLevel;
  tx_count?: number;
  timestamp?: string;
  amount?: number;
  fee?: number;
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  data?: GraphNodeData;
}

export interface GraphEdgeData {
  amount?: number;
  timestamp?: string;
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  type: string; // e.g. "INPUT_TO", "OUTPUT_TO"
  data?: GraphEdgeData;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ShortestPathResponse {
  path: string[];
  length: number;
  graph: GraphResponse;
}

// 5. Alerts & Evidence
export interface AlertItem {
  alert_id: string;
  entity_type: EntityType;
  entity_id: string;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: number;
  pattern_types: PatternType[];
  created_at: string;
}

export interface EvidenceFeature {
  feature: string;
  z_score: number;
}

export interface EvidenceItem {
  evidence_type: string;
  description: string;
  weight: number;
  data: {
    score?: number;
    top_features?: EvidenceFeature[];
    chain_count?: number;
    avg_chain_length?: number;
    avg_peel_fraction?: number;
    txids?: string[];
    seed_wallet?: string;
    hop_distance?: number;
    propagated_score?: number;
    path?: string[];
  };
}

export interface AlertEvidenceResponse {
  alert_id: string;
  evidence: EvidenceItem[];
}

export interface PropagationHop {
  hop: number;
  wallet: string;
  txid: string;
  score: number;
}

export interface AlertPropagationResponse {
  alert_id: string;
  target_wallet: string;
  propagation_path: {
    seed_wallet: string;
    seed_score: number;
    hops: PropagationHop[];
  };
}

// 6. Analysis Pipeline
export interface AnalysisJob {
  job_id: string;
  dataset_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_stage?: string;
  stages_completed?: string[];
  stages_remaining?: string[];
  started_at: string;
  completed_at?: string | null;
}

export interface AnalysisStats {
  job_id: string;
  dataset_id: string;
  stats: {
    transactions_processed: number;
    wallets_discovered: number;
    anomalies_detected: number;
    peeling_chains_detected: number;
    coinjoin_like_detected: number;
    entity_clusters: number;
    alerts_generated: number;
    critical_alerts: number;
    high_alerts: number;
    medium_alerts: number;
  };
}

// Extensions for Cluster & Stream Visualizers
export interface ClusterInfo {
  clusterId: string;
  name: string;
  walletCount: number;
  totalVolumeBtc: number;
  riskScore: number;
  primaryRiskType: string;
  associatedIps: string[];
  topAddresses: string[];
}

export interface StreamTransaction {
  txid: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: string;
  ip: string;
  country: string;
  isAnomalous: boolean;
  anomalyScore: number;
}
