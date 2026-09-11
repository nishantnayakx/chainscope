# ⛓️ ChainScope — Bitcoin Transaction Intelligence Platform
### **Smart India Hackathon (SIH 2026) · Problem Statement 26146 (NTRO)**
> **Category:** Cryptocurrency & Cyber Forensics  
> **Target Entity:** National Technical Research Organisation (NTRO)  
> **REST API Standard:** OpenAPI v1.0.0 Specification

---

## 📌 Project Overview

**ChainScope** is an end-to-end forensic intelligence and network topology analysis platform designed to ingest raw dumps of Bitcoin transactions, UTXO outputs, and IP network logs to automatically detect and visualize illicit activity (ransomware payouts, peel-chain layering, CoinJoin/mixer obfuscation, TOR exit IP relays, and risk contagion propagation).

---

## 🌟 Key Features

1. **📊 Forensic Command Center**: Real-time stats, country GeoIP ingress breakdowns, and ranked alert queues.
2. **📂 Dataset Ingestion & Pipeline (`/api/v1/datasets/`, `/api/v1/analysis/`)**: Upload CSV/JSON dumps, run data validation, and trigger offline ML analysis jobs.
3. **⚡ UTXO & Transaction Index (`/api/v1/transactions/`)**: Deep inspection of block heights, versions, locktimes, inputs, outputs, script types, and IP addresses.
4. **👛 Wallet Profiles & Risk Scoring (`/api/v1/wallets/`)**: Multi-component risk score breakdown (`anomaly`, `peeling`, `coinjoin`, `cluster`, `network`, `propagated`).
5. **🕸️ Interactive Cytoscape Subgraph Explorer (`/api/v1/graph/`)**: Physics-based COSE layouts, node inspection drawers, K-hop subgraphs, and shortest path fund flow analysis.
6. **🚨 Explainable AI (XAI) & Contagion Workbench (`/api/v1/alerts/`)**: Feature z-score drivers, risk propagation path visualizers (Seed Wallet → Hops → Target Wallet), and dossier PDF report exports.

---

## 📁 Repository Structure

```
chainscope/
├── schema/                         # Schema definitions & dataset tools
│   ├── raw_record_schema.json     # Input validation schema
│   ├── db_schema.sql              # Normalized PostgreSQL DB schema
│   ├── SCHEMA_README.md           # Database architecture documentation
│   └── generate_sample_dataset.py # Synthetic dataset generator with 4 injected scenarios
├── output/                         # Presentation assets
│   └── sih-idea-ppt-guide.html    # Official 6-slide SIH Idea PPT template content guide
├── frontend/                       # Vite + React + TypeScript + Cytoscape.js application
│   ├── src/
│   │   ├── api/client.ts          # OpenAPI v1.0.0 REST Client + Offline Mock Switch
│   │   ├── components/            # UI Module components (Dashboard, Datasets, Graph, Alerts)
│   │   ├── types/index.ts         # TypeScript API contract schemas
│   │   └── data/mockData.ts       # Realistic forensic mock dataset
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### 1. **Synthetic Data Generator**
Generate synthetic datasets with injected ransomware, peel-chain, and mixer scenarios:
```bash
cd schema
python generate_sample_dataset.py --rows 5000 --out sample_dataset.json
```

### 2. **Frontend Setup & Development Server**
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. **Production Build**
```bash
cd frontend
npm run build
```

---

## 📜 API Specification Summary

The frontend implements the full `/api/v1/` REST endpoint specifications:
- `POST /api/v1/datasets/import/`
- `GET /api/v1/transactions/?limit=50&offset=0`
- `GET /api/v1/wallets/{address}/risk/`
- `GET /api/v1/graph/neighborhood/?address={addr}&depth=2`
- `GET /api/v1/alerts/{alert_id}/evidence/`
- `GET /api/v1/alerts/{alert_id}/propagation/`
- `POST /api/v1/analysis/`

---

## 🏆 Author
Created by **[Nishant Nayak](https://github.com/nishantnayakx)** for **Smart India Hackathon 2026**.
