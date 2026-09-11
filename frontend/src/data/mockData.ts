import type { Alert, DashboardStats, Investigation } from '../types';

export const mockStats: DashboardStats = {
  totalTransactions: 4842,
  totalWallets: 3117,
  totalIps: 892,
  suspiciousTransactions: 44,
  suspiciousWallets: 27,
  suspiciousClusters: 4,
  highRiskAlerts: 12,
  countryDistribution: [
    { country: 'IN', count: 1204 },
    { country: 'US', count: 980 },
    { country: 'SG', count: 640 },
    { country: 'DE', count: 512 },
    { country: 'NL', count: 388 },
  ],
};

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    entity: '1abeb36b3cec34283bbddc254e1c87ed0',
    entityType: 'wallet',
    riskScore: 91,
    riskLevel: 'HIGH',
    detectionReason: 'Unusual transaction burst + high graph centrality',
    timestamp: '2026-01-04T09:22:11Z',
  },
  {
    id: 'ALT-002',
    entity: '7772ac1f027a4447b0b11dde434913f9dd78f76',
    entityType: 'transaction',
    riskScore: 84,
    riskLevel: 'HIGH',
    detectionReason: 'Mixer-like fan-in/fan-out pattern (15 inputs, 15 outputs)',
    timestamp: '2026-01-04T11:05:44Z',
  },
  {
    id: 'ALT-003',
    entity: '169.126.135.160',
    entityType: 'ip',
    riskScore: 78,
    riskLevel: 'HIGH',
    detectionReason: 'One IP associated with 20 distinct wallets',
    timestamp: '2026-01-04T14:30:02Z',
  },
  {
    id: 'ALT-004',
    entity: '13c7ebfe33f514043a1ed236486b58646',
    entityType: 'wallet',
    riskScore: 66,
    riskLevel: 'MEDIUM',
    detectionReason: 'Layering pattern: rapid single-hop chain, near-total value passthrough',
    timestamp: '2026-01-05T02:14:37Z',
  },
  {
    id: 'ALT-005',
    entity: 'cluster-0007',
    entityType: 'cluster',
    riskScore: 58,
    riskLevel: 'MEDIUM',
    detectionReason: 'Behavioral similarity across 6 wallets, coordinated timing',
    timestamp: '2026-01-05T08:41:19Z',
  },
  {
    id: 'ALT-006',
    entity: '1d14aeb1192d4476eafc772bfbdff5649',
    entityType: 'wallet',
    riskScore: 34,
    riskLevel: 'LOW',
    detectionReason: 'Minor deviation from cluster median transaction size',
    timestamp: '2026-01-05T16:02:55Z',
  },
];

export const mockInvestigations: Record<string, Investigation> = {
  'ALT-001': {
    alert: mockAlerts[0],
    evidence: {
      topFeatures: [
        { name: 'transaction_burst_1h', contribution: 0.41 },
        { name: 'graph_betweenness_centrality', contribution: 0.28 },
        { name: 'fan_in_ratio', contribution: 0.19 },
        { name: 'ip_wallet_novelty', contribution: 0.12 },
      ],
      relatedTransactions: [
        '7772ac1f027a4447b0b11dde434913f9dd78f76',
        'a91cf3e0271b4547b0b11dde434913a1dd78f22',
        'c02df9a1178a4123a0a11cde434913f9ff98a01',
      ],
      relatedIps: ['169.126.135.160', '180.152.66.13'],
      relatedWallets: [
        '13c7ebfe33f514043a1ed236486b58646',
        '1d14aeb1192d4476eafc772bfbdff5649',
      ],
      clusterId: 'cluster-0003',
      confidence: 0.87,
    },
    wallet: {
      address: '1abeb36b3cec34283bbddc254e1c87ed0',
      firstSeen: '2026-01-01T01:36:37Z',
      lastSeen: '2026-01-04T09:22:11Z',
      txCount: 13,
      totalIn: 8.42,
      totalOut: 8.31,
      uniqueCounterparties: 11,
    },
    graph: {
      nodes: [
        { id: '1abeb36b3cec34283bbddc254e1c87ed0', type: 'wallet', label: 'Flagged Wallet', riskScore: 91 },
        { id: '13c7ebfe33f514043a1ed236486b58646', type: 'wallet', label: 'Wallet B' },
        { id: '1d14aeb1192d4476eafc772bfbdff5649', type: 'wallet', label: 'Wallet C' },
        { id: '7772ac1f027a4447b0b11dde434913f9dd78f76', type: 'transaction', label: 'TX 1' },
        { id: 'a91cf3e0271b4547b0b11dde434913a1dd78f22', type: 'transaction', label: 'TX 2' },
        { id: '169.126.135.160', type: 'ip', label: 'IP 169.126.135.160' },
        { id: '180.152.66.13', type: 'ip', label: 'IP 180.152.66.13' },
      ],
      edges: [
        { source: '1abeb36b3cec34283bbddc254e1c87ed0', target: '7772ac1f027a4447b0b11dde434913f9dd78f76', relation: 'input' },
        { source: '7772ac1f027a4447b0b11dde434913f9dd78f76', target: '13c7ebfe33f514043a1ed236486b58646', relation: 'output' },
        { source: '7772ac1f027a4447b0b11dde434913f9dd78f76', target: '1d14aeb1192d4476eafc772bfbdff5649', relation: 'output' },
        { source: '169.126.135.160', target: '7772ac1f027a4447b0b11dde434913f9dd78f76', relation: 'observed_src' },
        { source: '1abeb36b3cec34283bbddc254e1c87ed0', target: 'a91cf3e0271b4547b0b11dde434913a1dd78f22', relation: 'input' },
        { source: '180.152.66.13', target: 'a91cf3e0271b4547b0b11dde434913a1dd78f22', relation: 'observed_dst' },
      ],
    },
    timeline: [
      { timestamp: '2026-01-01T01:36:37Z', description: 'Wallet first observed' },
      { timestamp: '2026-01-04T09:12:03Z', description: '8 convergent inbound transactions within 40 minutes' },
      { timestamp: '2026-01-04T09:22:11Z', description: 'Rapid outbound chain begins — flagged HIGH' },
    ],
  },
};

export function getInvestigation(alertId: string): Investigation | undefined {
  return mockInvestigations[alertId] ?? mockInvestigations['ALT-001'];
}
