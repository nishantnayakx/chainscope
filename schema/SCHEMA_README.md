# PS 26146 — Dataset Schema

There are **two schemas** here, and the team needs to know the difference:

1. **Raw input schema** — what a row in the organizer's CSV/JSON/XML dataset should look like. This is *inferred from the PS text*, not confirmed — the real dataset may differ slightly in field names or nesting. Treat this as the target to validate against once the real file arrives.
2. **Normalized DB schema** — what the ingestion pipeline converts raw rows *into*, before graph/ML work touches it. This is what Backend, Graph, and ML leads should actually build against — it doesn't change even if the raw format has minor surprises, as long as the ingestion layer absorbs them.

**Until the real dataset drops:** use `generate_sample_dataset.py` to produce a realistic synthetic file matching the raw schema. It also injects 4 known "criminal pattern" scenarios so ML/graph work has something real to detect — don't wait on organizers to start building.

---

## 1. Raw Input Schema (per transaction record)

| Field | Type | Required | Notes |
|---|---|---|---|
| `timestamp` | ISO 8601 string or unix epoch int | Yes | Normalize to UTC datetime on ingest |
| `src_ip` | string (IPv4/IPv6) | Yes | Network-layer observation |
| `dst_ip` | string (IPv4/IPv6) | Yes | |
| `src_port` | int (0–65535) | Yes | |
| `dst_port` | int (0–65535) | Yes | |
| `txid` | string | Yes | Treat as opaque unique string — don't assume 64-char hex, verify against real data |
| `input_addresses` | array[string] | Yes | Wallets funding the transaction |
| `output_addresses` | array[string] | Yes | Wallets receiving funds |
| `input_amounts` | array[number] | Yes | Same length/order as `input_addresses` |
| `output_amounts` | array[number] | Yes | Same length/order as `output_addresses` |
| `fee` | number | Yes | |
| `script_type` | string | No | e.g. P2PKH, P2SH, P2WPKH — enum unconfirmed until real data seen |
| `geo_country` | string | No | May not be present raw — likely derived via GeoIP enrichment step, not supplied |
| `asn` | string | No | Same as above |

**Validate these assumptions the moment the real file arrives:**
- Are `input_addresses`/`output_addresses` actual JSON arrays, or comma-separated strings inside a CSV cell?
- Is `timestamp` unix epoch (seconds or ms?) or a formatted string?
- Do `geo_country`/`asn` come pre-populated, or is GeoIP enrichment entirely on you?
- Any duplicate `txid` rows (multi-line per transaction) or one row = one transaction?

## 2. Normalized DB Schema

See `db_schema.sql`. Four core tables:
- `transactions` — one row per TXID
- `wallets` — one row per unique address, aggregated stats
- `ip_observations` — one row per IP-to-transaction observation (src or dst)
- `tx_wallet_links` — join table: which wallets were inputs/outputs of which transaction, with amount

This is the schema ML feature engineering and graph construction should read from — not the raw file directly.

## 3. Sample Dataset Generator

Run:
```
python3 generate_sample_dataset.py --rows 5000 --out sample_dataset.json
```
Produces a realistic synthetic dataset matching the raw schema above, with 4 injected scenarios (ransomware convergence, layering chain, mixer-like fan-in/out, one-IP-many-wallets) labeled in a separate `ground_truth.json` file for evaluation purposes only — never feed ground truth into the model itself, it's for scoring your detector afterward.
