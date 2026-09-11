#!/usr/bin/env python3
"""
PS 26146 — Synthetic Dataset Generator

Produces a dataset matching the raw schema in raw_record_schema.json,
plus 4 injected "criminal pattern" scenarios, so ML/graph work can start
before the organizers release the real dataset.

Usage:
    python3 generate_sample_dataset.py --rows 5000 --out sample_dataset.json
"""

import argparse
import json
import random
import uuid
from datetime import datetime, timedelta

random.seed(42)


def random_ip():
    return ".".join(str(random.randint(1, 254)) for _ in range(4))


def random_address():
    return "1" + uuid.uuid4().hex[:33]


def random_txid():
    return uuid.uuid4().hex + uuid.uuid4().hex[:32]


def base_timestamp(start, i):
    return (start + timedelta(seconds=i * random.randint(5, 120))).isoformat()


def normal_transaction(ts):
    n_in = random.randint(1, 2)
    n_out = random.randint(1, 2)
    return {
        "timestamp": ts,
        "src_ip": random_ip(),
        "dst_ip": random_ip(),
        "src_port": random.randint(1024, 65535),
        "dst_port": 8333,
        "txid": random_txid(),
        "input_addresses": [random_address() for _ in range(n_in)],
        "output_addresses": [random_address() for _ in range(n_out)],
        "input_amounts": [round(random.uniform(0.001, 2.0), 8) for _ in range(n_in)],
        "output_amounts": [round(random.uniform(0.001, 2.0), 8) for _ in range(n_out)],
        "fee": round(random.uniform(0.00001, 0.0005), 8),
        "script_type": random.choice(["P2PKH", "P2SH", "P2WPKH"]),
        "geo_country": random.choice(["IN", "US", "DE", "SG", "NL"]),
        "asn": f"AS{random.randint(1000, 60000)}"
    }


def scenario_ransomware_convergence(start, ground_truth):
    """Many wallets funnel into one, then it empties rapidly through a chain."""
    records = []
    target = random_address()
    ts0 = start + timedelta(hours=random.randint(0, 200))
    for i in range(8):
        rec = normal_transaction(base_timestamp(ts0, i))
        rec["output_addresses"] = [target]
        rec["output_amounts"] = [round(random.uniform(0.5, 3.0), 8)]
        records.append(rec)
        ground_truth.append({"txid": rec["txid"], "scenario": "ransomware_convergence", "entity": target})
    chain_from = target
    for i in range(5):
        rec = normal_transaction(base_timestamp(ts0, 10 + i))
        rec["input_addresses"] = [chain_from]
        nxt = random_address()
        rec["output_addresses"] = [nxt]
        records.append(rec)
        ground_truth.append({"txid": rec["txid"], "scenario": "ransomware_convergence", "entity": chain_from})
        chain_from = nxt
    return records


def scenario_layering(start, ground_truth):
    """Funds move through a long chain of single-hop wallets quickly."""
    records = []
    ts0 = start + timedelta(hours=random.randint(0, 200))
    addr = random_address()
    for i in range(10):
        rec = normal_transaction(base_timestamp(ts0, i * 2))
        rec["input_addresses"] = [addr]
        rec["input_amounts"] = [round(random.uniform(1.0, 1.0), 8)]
        nxt = random_address()
        rec["output_addresses"] = [nxt]
        rec["output_amounts"] = [round(rec["input_amounts"][0] * 0.98, 8)]
        records.append(rec)
        ground_truth.append({"txid": rec["txid"], "scenario": "layering", "entity": addr})
        addr = nxt
    return records


def scenario_mixer_like(start, ground_truth):
    """Many inputs, many outputs, same transaction — mixer signature."""
    ts0 = start + timedelta(hours=random.randint(0, 200))
    rec = normal_transaction(base_timestamp(ts0, 0))
    n_in, n_out = 15, 15
    rec["input_addresses"] = [random_address() for _ in range(n_in)]
    rec["output_addresses"] = [random_address() for _ in range(n_out)]
    rec["input_amounts"] = [round(random.uniform(0.01, 0.5), 8) for _ in range(n_in)]
    rec["output_amounts"] = [round(random.uniform(0.01, 0.5), 8) for _ in range(n_out)]
    ground_truth.append({"txid": rec["txid"], "scenario": "mixer_like", "entity": rec["txid"]})
    return [rec]


def scenario_ip_wallet_anomaly(start, ground_truth):
    """One IP broadcasts for an unusually large number of distinct wallets."""
    records = []
    ts0 = start + timedelta(hours=random.randint(0, 200))
    shared_ip = random_ip()
    for i in range(20):
        rec = normal_transaction(base_timestamp(ts0, i * 3))
        rec["src_ip"] = shared_ip
        records.append(rec)
        ground_truth.append({"txid": rec["txid"], "scenario": "ip_wallet_anomaly", "entity": shared_ip})
    return records


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=5000)
    parser.add_argument("--out", type=str, default="sample_dataset.json")
    args = parser.parse_args()

    start = datetime(2026, 1, 1)
    records = []
    ground_truth = []

    n_normal = max(args.rows - 60, 0)
    for i in range(n_normal):
        records.append(normal_transaction(base_timestamp(start, i)))

    records += scenario_ransomware_convergence(start, ground_truth)
    records += scenario_layering(start, ground_truth)
    records += scenario_mixer_like(start, ground_truth)
    records += scenario_ip_wallet_anomaly(start, ground_truth)

    random.shuffle(records)

    with open(args.out, "w") as f:
        json.dump(records, f, indent=2)

    gt_path = args.out.replace(".json", "_ground_truth.json")
    with open(gt_path, "w") as f:
        json.dump(ground_truth, f, indent=2)

    print(f"Wrote {len(records)} records to {args.out}")
    print(f"Wrote {len(ground_truth)} ground-truth entries to {gt_path}")
    print("NOTE: ground_truth is for evaluating your detector afterward — never feed it into the model.")


if __name__ == "__main__":
    main()
