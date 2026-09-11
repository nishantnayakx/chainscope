import type {
  AlertEvidenceResponse,
  AlertItem,
  AlertPropagationResponse,
  AnalysisJob,
  AnalysisStats,
  ClusterInfo,
  DatasetDetail,
  DatasetImportResponse,
  GraphResponse,
  PaginatedResponse,
  ShortestPathResponse,
  StreamTransaction,
  TransactionDetail,
  TransactionListItem,
  WalletListItem,
  WalletRiskBreakdown,
} from '../types';

import {
  mockAlertEvidence,
  mockAlertPropagation,
  mockAlerts,
  mockAnalysisJob,
  mockAnalysisStats,
  mockClusters,
  mockDatasetDetail,
  mockGraphResponse,
  mockStreamTransactions,
  mockTransactionDetail,
  mockTransactions,
  mockWalletRiskBreakdown,
  mockWallets,
} from '../data/mockData';

// Toggle between Live FastAPI Base URL and Client-side Mock Mode
export const API_BASE = 'http://localhost:8000/api/v1';
export let USE_MOCK = true;

export function setUseMock(val: boolean) {
  USE_MOCK = val;
}

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// 1. Datasets API
export async function importDataset(file: File, datasetId?: string): Promise<DatasetImportResponse> {
  if (USE_MOCK) {
    return delay({
      dataset_id: datasetId || 'demo_01',
      job_id: '8f3b6c2a-9e1d-4f7b-8c3a-2e1d4f7b8c3a',
      status: 'ingesting',
      message: 'Ingestion job queued',
    });
  }
  const formData = new FormData();
  formData.append('file', file);
  if (datasetId) formData.append('dataset_id', datasetId);

  const res = await fetch(`${API_BASE}/datasets/import/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function fetchDatasetDetail(datasetId = 'demo_01'): Promise<DatasetDetail> {
  if (USE_MOCK) return delay(mockDatasetDetail);
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/`);
  return res.json();
}

// 2. Transactions API
export async function fetchTransactions(params?: {
  dataset_id?: string;
  address?: string;
  src_ip?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<TransactionListItem>> {
  if (USE_MOCK) return delay(mockTransactions);
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/transactions/?${query}`);
  return res.json();
}

export async function fetchTransactionDetail(txid: string): Promise<TransactionDetail> {
  if (USE_MOCK) return delay({ ...mockTransactionDetail, txid });
  const res = await fetch(`${API_BASE}/transactions/${txid}/`);
  return res.json();
}

// 3. Wallets API
export async function fetchWallets(params?: {
  q?: string;
  dataset_id?: string;
  min_risk?: number;
  risk_level?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<WalletListItem>> {
  if (USE_MOCK) return delay(mockWallets);
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/wallets/?${query}`);
  return res.json();
}

export async function fetchWalletRisk(address: string): Promise<WalletRiskBreakdown> {
  if (USE_MOCK) return delay({ ...mockWalletRiskBreakdown, address });
  const res = await fetch(`${API_BASE}/wallets/${address}/risk/`);
  return res.json();
}

// 4. Graph API
export async function fetchGraphNeighborhood(address: string, depth = 2): Promise<GraphResponse> {
  if (USE_MOCK) return delay(mockGraphResponse);
  const res = await fetch(`${API_BASE}/graph/neighborhood/?address=${encodeURIComponent(address)}&depth=${depth}`);
  return res.json();
}

export async function fetchShortestPath(fromAddr: string, toAddr: string): Promise<ShortestPathResponse> {
  if (USE_MOCK) {
    return delay({
      path: [fromAddr, 'txid_abc1234567890def', toAddr],
      length: 2,
      graph: mockGraphResponse,
    });
  }
  const res = await fetch(`${API_BASE}/graph/shortest-path/?from=${encodeURIComponent(fromAddr)}&to=${encodeURIComponent(toAddr)}`);
  return res.json();
}

// 5. Alerts & Evidence API
export async function fetchAlerts(params?: {
  dataset_id?: string;
  risk_level?: string;
  pattern_type?: string;
}): Promise<PaginatedResponse<AlertItem>> {
  if (USE_MOCK) return delay(mockAlerts);
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/alerts/?${query}`);
  return res.json();
}

export async function fetchAlertEvidence(alertId: string): Promise<AlertEvidenceResponse> {
  if (USE_MOCK) return delay({ ...mockAlertEvidence, alert_id: alertId });
  const res = await fetch(`${API_BASE}/alerts/${alertId}/evidence/`);
  return res.json();
}

export async function fetchAlertPropagation(alertId: string): Promise<AlertPropagationResponse> {
  if (USE_MOCK) return delay({ ...mockAlertPropagation, alert_id: alertId });
  const res = await fetch(`${API_BASE}/alerts/${alertId}/propagation/`);
  return res.json();
}

// 6. Analysis Pipeline API
export async function triggerAnalysis(datasetId = 'demo_01'): Promise<AnalysisJob> {
  if (USE_MOCK) return delay(mockAnalysisJob);
  const res = await fetch(`${API_BASE}/analysis/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset_id: datasetId }),
  });
  return res.json();
}

export async function fetchAnalysisJob(jobId: string): Promise<AnalysisJob> {
  if (USE_MOCK) return delay({ ...mockAnalysisJob, job_id: jobId });
  const res = await fetch(`${API_BASE}/analysis/${jobId}/`);
  return res.json();
}

export async function fetchAnalysisStats(jobId: string): Promise<AnalysisStats> {
  if (USE_MOCK) return delay({ ...mockAnalysisStats, job_id: jobId });
  const res = await fetch(`${API_BASE}/analysis/${jobId}/stats/`);
  return res.json();
}

export async function fetchClusters(): Promise<ClusterInfo[]> {
  if (USE_MOCK) return delay(mockClusters);
  const res = await fetch(`${API_BASE}/clusters/`);
  return res.json();
}

export async function fetchStreamSample(): Promise<StreamTransaction[]> {
  if (USE_MOCK) return delay(mockStreamTransactions);
  const res = await fetch(`${API_BASE}/stream/latest/`);
  return res.json();
}
