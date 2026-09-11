import type { Alert, DashboardStats, Investigation } from '../types';
import { mockAlerts, mockStats, getInvestigation } from '../data/mockData';

// Switch source without touching any component: set VITE_USE_MOCK=false in a
// .env.local file once the backend is up, or leave it unset to stay on mock
// data. Every page calls only the three functions below, never fetch()
// directly, so this is the ONLY place that needs to change on handoff day.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api';
const TIMEOUT_MS = 6000;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// A raw fetch() with no timeout is the #1 cause of a page that "just keeps
// loading forever" when a backend is down, on the wrong port, or blocked by
// CORS with no visible error. This wraps every call so it fails LOUDLY
// within TIMEOUT_MS instead of hanging silently.
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Backend responded ${res.status} ${res.statusText} for ${url}`);
    }
    return res;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(
        `Timed out waiting ${TIMEOUT_MS}ms for ${url}. ` +
        `Check: is uvicorn running? Is CORS enabled on FastAPI for this origin? Is the port correct?`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchStats(): Promise<DashboardStats> {
  if (USE_MOCK) return delay(mockStats);
  const res = await fetchWithTimeout(`${API_BASE}/stats`);
  return res.json();
}

export async function fetchAlerts(): Promise<Alert[]> {
  if (USE_MOCK) return delay(mockAlerts);
  const res = await fetchWithTimeout(`${API_BASE}/alerts`);
  return res.json();
}

export async function fetchInvestigation(alertId: string): Promise<Investigation> {
  if (USE_MOCK) return delay(getInvestigation(alertId)!);
  const res = await fetchWithTimeout(`${API_BASE}/investigation/${alertId}`);
  return res.json();
}
