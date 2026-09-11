# NETRA — Frontend

**N**etwork **E**ntity **T**racking & **R**isk **A**nalysis — investigation dashboard for PS 26146 (NTRO, SIH 2026).

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. Runs entirely on mock data out of the box — no backend required to develop or demo the UI.

## Switching from mock data to the live backend

Everything the UI needs comes through three functions in `src/api/client.ts`:
`fetchStats()`, `fetchAlerts()`, `fetchInvestigation(alertId)`. No other file touches `fetch()` directly.

1. Copy `.env.local.example` to `.env.local`
2. Set `VITE_USE_MOCK=false`
3. Confirm `VITE_API_BASE` points at your teammate's FastAPI server (default `http://localhost:8000/api`)
4. Restart `npm run dev`

### If the page hangs on "Loading…" forever with the live backend

This used to be silent — it now fails within 6 seconds with a visible error banner instead. If you see the timeout error, check in this order:

1. Is `uvicorn` actually running? (`curl http://localhost:8000/api/stats` from a terminal)
2. **CORS** — FastAPI blocks browser requests from `localhost:5173` unless explicitly allowed. Backend needs:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. Is the port in `.env.local` correct? (default assumes `8000`)
4. Does the response shape match `src/types/index.ts`? A shape mismatch won't hang — it'll render broken/blank instead — but worth checking first if data looks wrong rather than absent.

## API contract (for the backend teammate)

Backend must serve these three endpoints returning JSON shaped exactly per `src/types/index.ts`:

| Endpoint | Returns |
|---|---|
| `GET /api/stats` | `DashboardStats` |
| `GET /api/alerts` | `Alert[]` |
| `GET /api/investigation/{alertId}` | `Investigation` |

Do not change field names without updating `src/types/index.ts` — the whole UI is typed against that file.

## Structure

```
src/
  api/client.ts          — the only file that talks to the backend
  types/index.ts          — API contract, mirrors backend DB schema
  data/mockData.ts         — realistic mock data for offline dev/demo
  components/              — Sidebar, RiskBadge, GraphView, WorkflowStepper, StatCard
  pages/                   — DashboardHome, AlertsPage, InvestigationPage
```

## Design notes

- Graph rendered with Cytoscape.js — no external tiles or CDN dependency, works fully offline (satisfies the PS's offline requirement).
- Risk levels shown as a stamped ring rather than a colored pill — deliberate choice to read as a "case marking," not a generic status chip.
- The stage stepper on Alerts/Investigation pages reflects the actual investigator workflow (Search → Trace → Connect → Analyse → Detect → Explain → Prioritize) from the pitch deck — not decorative.
