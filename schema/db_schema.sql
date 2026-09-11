-- PS 26146 — Normalized Database Schema
-- This is what raw records get transformed INTO after ingestion.
-- ML/Graph/Backend leads build against this, not the raw file.

CREATE TABLE transactions (
    txid                TEXT PRIMARY KEY,
    timestamp           TIMESTAMP NOT NULL,
    fee                 NUMERIC NOT NULL,
    script_type         TEXT,
    total_input_amount  NUMERIC,
    total_output_amount NUMERIC,
    input_count         INTEGER,
    output_count        INTEGER,
    created_at          TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_tx_timestamp ON transactions(timestamp);

CREATE TABLE wallets (
    address       TEXT PRIMARY KEY,
    first_seen    TIMESTAMP,
    last_seen     TIMESTAMP,
    tx_count      INTEGER DEFAULT 0,
    total_in      NUMERIC DEFAULT 0,
    total_out     NUMERIC DEFAULT 0,
    unique_counterparties INTEGER DEFAULT 0
);
CREATE INDEX idx_wallet_last_seen ON wallets(last_seen);

CREATE TABLE ip_observations (
    id           SERIAL PRIMARY KEY,
    ip           TEXT NOT NULL,
    txid         TEXT REFERENCES transactions(txid),
    port         INTEGER,
    direction    TEXT CHECK (direction IN ('src','dst')),
    country      TEXT,
    asn          TEXT,
    observed_at  TIMESTAMP
);
CREATE INDEX idx_ip_address ON ip_observations(ip);
CREATE INDEX idx_ip_txid ON ip_observations(txid);

CREATE TABLE tx_wallet_links (
    txid            TEXT REFERENCES transactions(txid),
    wallet_address  TEXT REFERENCES wallets(address),
    role            TEXT CHECK (role IN ('input','output')),
    amount          NUMERIC NOT NULL,
    PRIMARY KEY (txid, wallet_address, role)
);
CREATE INDEX idx_link_wallet ON tx_wallet_links(wallet_address);

-- Rows that failed validation during ingestion — never silently drop bad data
CREATE TABLE rejected_rows (
    id           SERIAL PRIMARY KEY,
    raw_content  TEXT,
    reason       TEXT,
    rejected_at  TIMESTAMP DEFAULT NOW()
);
