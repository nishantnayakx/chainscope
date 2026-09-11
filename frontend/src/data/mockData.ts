import type {
  AlertEvidenceResponse,
  AlertItem,
  AlertPropagationResponse,
  AnalysisJob,
  AnalysisStats,
  ClusterInfo,
  DatasetDetail,
  GraphResponse,
  PaginatedResponse,
  StreamTransaction,
  TransactionDetail,
  TransactionListItem,
  WalletListItem,
  WalletRiskBreakdown,
} from '../types';

export const mockDatasetDetail: DatasetDetail = {
  dataset_id: 'demo_01',
  source_format: 'CSV',
  status: 'done',
  created_at: '2026-09-06T00:00:00Z',
  completed_at: '2026-09-06T00:01:23Z',
  stats: {
    transactions: 10000,
    wallets: 4823,
    unique_ips: 2341,
    unique_asns: 187,
    unique_countries: 42,
    records_valid: 9987,
    records_errored: 13,
  },
};

export const mockTransactions: PaginatedResponse<TransactionListItem> = {
  count: 523,
  next: '/api/v1/transactions/?limit=50&offset=50',
  previous: null,
  results: [
    {
      txid: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      timestamp: '2026-01-15T12:34:56Z',
      block_height: 750000,
      total_input_amount: 1.2345,
      total_output_amount: 1.23,
      fee: 0.0045,
      input_count: 2,
      output_count: 2,
      is_coinbase: false,
      script_type: 'P2PKH',
      src_ip: '203.0.113.1',
    },
    {
      txid: '8f3b6c2a9e1d4f7b8c3a2e1d4f7b8c3a2e1d4f7b8c3a2e1d4f7b8c3a2e1d4f7b',
      timestamp: '2026-01-15T13:10:22Z',
      block_height: 750002,
      total_input_amount: 42.5,
      total_output_amount: 42.49,
      fee: 0.01,
      input_count: 1,
      output_count: 14,
      is_coinbase: false,
      script_type: 'P2WPKH',
      src_ip: '185.220.101.5',
    },
    {
      txid: 'tx_a8f9c2d104e75b39a2c1092837465019283746501928374650192837465019',
      timestamp: '2026-01-15T14:45:00Z',
      block_height: 750010,
      total_input_amount: 14.8,
      total_output_amount: 14.795,
      fee: 0.005,
      input_count: 8,
      output_count: 8,
      is_coinbase: false,
      script_type: 'P2SH',
      src_ip: '194.26.29.112',
    },
  ],
};

export const mockTransactionDetail: TransactionDetail = {
  ...mockTransactions.results[0],
  block_hash: '00000000000000000002a4b0c2e5d6f8a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9',
  transaction_index: 42,
  version: 1,
  locktime: 0,
  transaction_size: 226,
  transaction_weight: 904,
  src_port: 8333,
  dst_ip: '198.51.100.1',
  dst_port: 8333,
};

export const mockWallets: PaginatedResponse<WalletListItem> = {
  count: 4823,
  next: '/api/v1/wallets/?limit=50&offset=50',
  previous: null,
  results: [
    {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      first_seen: '2026-01-01T00:00:00Z',
      last_seen: '2026-01-20T18:30:00Z',
      tx_count: 42,
      total_received: 10.5,
      total_sent: 10.496,
      risk_score: 91.5,
      risk_level: 'CRITICAL',
    },
    {
      address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      first_seen: '2026-01-05T09:12:00Z',
      last_seen: '2026-01-19T14:22:10Z',
      tx_count: 18,
      total_received: 88.4,
      total_sent: 82.1,
      risk_score: 84.0,
      risk_level: 'HIGH',
    },
    {
      address: '18f8c290a9f3b8c7d6e5f4a3b2c1d0e9f8a7b6c5',
      first_seen: '2026-01-10T11:00:00Z',
      last_seen: '2026-01-18T16:05:00Z',
      tx_count: 65,
      total_received: 310.2,
      total_sent: 308.9,
      risk_score: 68.2,
      risk_level: 'MEDIUM',
    },
    {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfJH',
      first_seen: '2026-01-02T08:00:00Z',
      last_seen: '2026-01-20T19:00:00Z',
      tx_count: 120,
      total_received: 4.5,
      total_sent: 4.2,
      risk_score: 12.0,
      risk_level: 'LOW',
    },
  ],
};

export const mockWalletRiskBreakdown: WalletRiskBreakdown = {
  address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  risk_score: 91.5,
  risk_level: 'CRITICAL',
  confidence: 0.93,
  components: {
    anomaly: 0.89,
    peeling: 0.72,
    coinjoin: 0.1,
    cluster: 1.0,
    network: 0.45,
    propagated: 0.8,
  },
  weights: {
    anomaly: 0.3,
    peeling: 0.25,
    coinjoin: 0.15,
    cluster: 0.1,
    network: 0.1,
    propagated: 0.1,
  },
};

export const mockGraphResponse: GraphResponse = {
  nodes: [
    {
      id: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      type: 'wallet',
      label: '1A1zP1...vfNa',
      data: {
        risk_score: 91.5,
        risk_level: 'CRITICAL',
        tx_count: 42,
      },
    },
    {
      id: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      type: 'transaction',
      label: '4a5e1e...a33b',
      data: {
        timestamp: '2026-01-15T12:34:56Z',
        amount: 1.234,
        fee: 0.004,
      },
    },
    {
      id: '1BpEi6xQWk1cZf9vB8N7M6L5K4J3H2G1F',
      type: 'wallet',
      label: '1BpEi6...G1F',
      data: {
        risk_score: 80.0,
        risk_level: 'HIGH',
        tx_count: 14,
      },
    },
    {
      id: '185.220.101.5',
      type: 'ip',
      label: 'TOR Relay (185.220.101.5)',
      data: {
        risk_score: 89.0,
        risk_level: 'HIGH',
      },
    },
  ],
  edges: [
    {
      id: 'e_001',
      source: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      target: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      type: 'INPUT_TO',
      data: {
        amount: 0.5,
        timestamp: '2026-01-15T12:34:56Z',
      },
    },
    {
      id: 'e_002',
      source: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      target: '1BpEi6xQWk1cZf9vB8N7M6L5K4J3H2G1F',
      type: 'OUTPUT_TO',
      data: {
        amount: 0.496,
        timestamp: '2026-01-15T12:34:56Z',
      },
    },
    {
      id: 'e_003',
      source: '185.220.101.5',
      target: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      type: 'OBSERVED_IP',
    },
  ],
};

export const mockAlerts: PaginatedResponse<AlertItem> = {
  count: 47,
  next: '/api/v1/alerts/?limit=50&offset=50',
  previous: null,
  results: [
    {
      alert_id: '8f3b6c2a-9e1d-4f7b-8c3a-2e1d4f7b8c3a',
      entity_type: 'wallet',
      entity_id: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      risk_score: 91.5,
      risk_level: 'CRITICAL',
      confidence: 0.93,
      pattern_types: ['peeling_chain', 'anomaly'],
      created_at: '2026-09-06T00:00:00Z',
    },
    {
      alert_id: '7a2b5c1d-8e0f-3a6b-9c2d-1e0f3a6b9c2d',
      entity_type: 'ip',
      entity_id: '185.220.101.5',
      risk_score: 89.0,
      risk_level: 'HIGH',
      confidence: 0.88,
      pattern_types: ['anomaly', 'fan_out'],
      created_at: '2026-09-05T20:15:44Z',
    },
    {
      alert_id: '6f1e4d3c-2b1a-0f9e-8d7c-6b5a4f3e2d1c',
      entity_type: 'cluster',
      entity_id: 'CLS-MIXER-99',
      risk_score: 82.5,
      risk_level: 'HIGH',
      confidence: 0.85,
      pattern_types: ['coinjoin', 'fan_in'],
      created_at: '2026-09-05T19:02:10Z',
    },
  ],
};

export const mockAlertEvidence: AlertEvidenceResponse = {
  alert_id: '8f3b6c2a-9e1d-4f7b-8c3a-2e1d4f7b8c3a',
  evidence: [
    {
      evidence_type: 'anomaly_score',
      description: 'Anomaly score 0.89 (Isolation Forest) — top features: tx_frequency, country_count, fan_out',
      weight: 0.3,
      data: {
        score: 0.89,
        top_features: [
          { feature: 'tx_frequency', z_score: 4.2 },
          { feature: 'country_count', z_score: 3.8 },
          { feature: 'fan_out', z_score: 3.1 },
        ],
      },
    },
    {
      evidence_type: 'peeling_chain',
      description: 'Involved in 2 peeling chains, avg length 7 hops, avg peel fraction 8%',
      weight: 0.25,
      data: {
        chain_count: 2,
        avg_chain_length: 7,
        avg_peel_fraction: 0.08,
        txids: ['4a5e1e...', 'def678...'],
      },
    },
    {
      evidence_type: 'risk_propagation',
      description: '2-hop connection to high-risk seed wallet',
      weight: 0.1,
      data: {
        seed_wallet: '1SeedXXX...',
        hop_distance: 2,
        propagated_score: 0.8,
        path: ['1SeedXXX...', 'txid_abc', '1A1zP1...'],
      },
    },
  ],
};

export const mockAlertPropagation: AlertPropagationResponse = {
  alert_id: '8f3b6c2a-9e1d-4f7b-8c3a-2e1d4f7b8c3a',
  target_wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  propagation_path: {
    seed_wallet: '1SeedXXX99887766554433221100',
    seed_score: 1.0,
    hops: [
      { hop: 1, wallet: '1BpEi6xQWk1cZf9vB8N7M6L5K4J3H2G1F', txid: 'abc1234567890def', score: 0.8 },
      { hop: 2, wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', txid: 'def6789012345abc', score: 0.64 },
    ],
  },
};

export const mockAnalysisJob: AnalysisJob = {
  job_id: '550e8400-e29b-41d4-a716-446655440000',
  dataset_id: 'demo_01',
  status: 'running',
  current_stage: 'feature_engineering',
  stages_completed: ['normalization'],
  stages_remaining: ['graph', 'anomaly', 'peeling', 'risk', 'alerts'],
  started_at: '2026-09-06T00:00:00Z',
  completed_at: null,
};

export const mockAnalysisStats: AnalysisStats = {
  job_id: '550e8400-e29b-41d4-a716-446655440000',
  dataset_id: 'demo_01',
  stats: {
    transactions_processed: 10000,
    wallets_discovered: 4823,
    anomalies_detected: 487,
    peeling_chains_detected: 23,
    coinjoin_like_detected: 15,
    entity_clusters: 312,
    alerts_generated: 47,
    critical_alerts: 5,
    high_alerts: 12,
    medium_alerts: 30,
  },
};

export const mockClusters: ClusterInfo[] = [
  {
    clusterId: 'CLS-MIXER-99',
    name: 'Blender.io Linked Tumbler Cluster',
    walletCount: 48,
    totalVolumeBtc: 142.85,
    riskScore: 92,
    primaryRiskType: 'Mixer / Tumbler Obfuscation',
    associatedIps: ['185.220.101.5', '185.220.101.12', '194.26.29.112'],
    topAddresses: ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', '18f8c290...a9f', '1bc79a0...32e'],
  },
  {
    clusterId: 'CLS-RANSOM-02',
    name: 'LockBit 3.0 Extortion Pool',
    walletCount: 19,
    totalVolumeBtc: 88.4,
    riskScore: 96,
    primaryRiskType: 'Ransomware Extortion',
    associatedIps: ['91.240.118.17', '45.142.214.9'],
    topAddresses: ['3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX'],
  },
];

export const mockStreamTransactions: StreamTransaction[] = [
  {
    txid: 'tx_live_9918a',
    sender: '1A1zP1e...DivfNa',
    receiver: '3J98t1W...RhWNLy',
    amount: 4.85,
    timestamp: '2026-09-06T01:00:00Z',
    ip: '185.220.101.5',
    country: 'TOR Exit (DE)',
    isAnomalous: true,
    anomalyScore: 92,
  },
  {
    txid: 'tx_live_9919b',
    sender: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfJH',
    receiver: 'bc1q9v82c9w8e77ytq0u4n289',
    amount: 0.12,
    timestamp: '2026-09-06T01:00:05Z',
    ip: '103.21.244.11',
    country: 'India (IN)',
    isAnomalous: false,
    anomalyScore: 12,
  },
];
