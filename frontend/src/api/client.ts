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

// Connection state tracking
export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';
let connectionStatus: ConnectionStatus = 'disconnected';
let connectionListeners: ((status: ConnectionStatus) => void)[] = [];

export function onConnectionChange(listener: (status: ConnectionStatus) => void) {
  connectionListeners.push(listener);
  return () => {
    connectionListeners = connectionListeners.filter((l) => l !== listener);
  };
}

function setConnectionStatus(status: ConnectionStatus) {
  connectionStatus = status;
  connectionListeners.forEach((l) => l(status));
}

export function getConnectionStatus(): ConnectionStatus {
  return connectionStatus;
}

export function setUseMock(val: boolean) {
  USE_MOCK = val;
  if (!val) {
    checkBackendHealth();
  } else {
    setConnectionStatus('disconnected');
  }
}

// Health check with timeout
export async function checkBackendHealth(): Promise<boolean> {
  setConnectionStatus('checking');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE}/../schema/`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      setConnectionStatus('connected');
      return true;
    }
    setConnectionStatus('disconnected');
    return false;
  } catch {
    setConnectionStatus('disconnected');
    return false;
  }
}

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Resilient fetch wrapper with timeout and error handling
async function resilientFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    setConnectionStatus('connected');
    return res.json();
  } catch (err: any) {
    clearTimeout(timeout);

    if (err.name === 'AbortError') {
      setConnectionStatus('disconnected');
      throw new Error('Request timed out — backend may not be running');
    }

    if (err.message?.includes('fetch') || err.message?.includes('NetworkError') || err.message?.includes('Failed')) {
      setConnectionStatus('disconnected');
      throw new Error('Cannot connect to backend at ' + API_BASE);
    }

    throw err;
  }
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

  return resilientFetch(`${API_BASE}/datasets/import/`, {
    method: 'POST',
    body: formData,
  });
}

export async function fetchDatasetDetail(datasetId = 'demo_01'): Promise<DatasetDetail> {
  if (USE_MOCK) return delay(mockDatasetDetail);
  return resilientFetch(`${API_BASE}/datasets/${datasetId}/`);
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
  return resilientFetch(`${API_BASE}/transactions/?${query}`);
}

export async function fetchTransactionDetail(txid: string): Promise<TransactionDetail> {
  if (USE_MOCK) return delay({ ...mockTransactionDetail, txid });
  return resilientFetch(`${API_BASE}/transactions/${txid}/`);
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
  return resilientFetch(`${API_BASE}/wallets/?${query}`);
}

export async function fetchWalletRisk(address: string): Promise<WalletRiskBreakdown> {
  if (USE_MOCK) return delay({ ...mockWalletRiskBreakdown, address });
  return resilientFetch(`${API_BASE}/wallets/${address}/risk/`);
}

// 4. Graph API
export async function fetchGraphNeighborhood(address: string, depth = 2): Promise<GraphResponse> {
  if (USE_MOCK) return delay(mockGraphResponse);
  return resilientFetch(`${API_BASE}/graph/neighborhood/?address=${encodeURIComponent(address)}&depth=${depth}`);
}

export async function fetchShortestPath(fromAddr: string, toAddr: string): Promise<ShortestPathResponse> {
  if (USE_MOCK) {
    return delay({
      path: [fromAddr, 'txid_abc1234567890def', toAddr],
      length: 2,
      graph: mockGraphResponse,
    });
  }
  return resilientFetch(`${API_BASE}/graph/shortest-path/?from=${encodeURIComponent(fromAddr)}&to=${encodeURIComponent(toAddr)}`);
}

// 5. Alerts & Evidence API
export async function fetchAlerts(params?: {
  dataset_id?: string;
  risk_level?: string;
  pattern_type?: string;
}): Promise<PaginatedResponse<AlertItem>> {
  if (USE_MOCK) return delay(mockAlerts);
  const query = new URLSearchParams(params as any).toString();
  return resilientFetch(`${API_BASE}/alerts/?${query}`);
}

export async function fetchAlertEvidence(alertId: string): Promise<AlertEvidenceResponse> {
  if (USE_MOCK) return delay({ ...mockAlertEvidence, alert_id: alertId });
  return resilientFetch(`${API_BASE}/alerts/${alertId}/evidence/`);
}

export async function fetchAlertPropagation(alertId: string): Promise<AlertPropagationResponse> {
  if (USE_MOCK) return delay({ ...mockAlertPropagation, alert_id: alertId });
  return resilientFetch(`${API_BASE}/alerts/${alertId}/propagation/`);
}

// 6. Analysis Pipeline API
export async function triggerAnalysis(datasetId = 'demo_01'): Promise<AnalysisJob> {
  if (USE_MOCK) return delay(mockAnalysisJob);
  return resilientFetch(`${API_BASE}/analysis/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset_id: datasetId }),
  });
}

export async function fetchAnalysisJob(jobId: string): Promise<AnalysisJob> {
  if (USE_MOCK) return delay({ ...mockAnalysisJob, job_id: jobId });
  return resilientFetch(`${API_BASE}/analysis/${jobId}/`);
}

export async function fetchAnalysisStats(jobId: string): Promise<AnalysisStats> {
  if (USE_MOCK) return delay({ ...mockAnalysisStats, job_id: jobId });
  return resilientFetch(`${API_BASE}/analysis/${jobId}/stats/`);
}

export async function fetchClusters(): Promise<ClusterInfo[]> {
  if (USE_MOCK) return delay(mockClusters);
  return resilientFetch(`${API_BASE}/clusters/`);
}

export async function fetchStreamSample(): Promise<StreamTransaction[]> {
  if (USE_MOCK) return delay(mockStreamTransactions);
  return resilientFetch(`${API_BASE}/stream/latest/`);
}
