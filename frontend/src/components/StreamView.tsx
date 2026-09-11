import { useEffect, useState } from 'react';
import type { StreamTransaction } from '../types';
import { fetchStreamSample } from '../api/client';
import { Radio, Play, Pause, RefreshCw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function StreamView() {
  const [stream, setStream] = useState<StreamTransaction[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    fetchStreamSample().then((data) => setStream(data));
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const isAnomaly = Math.random() > 0.6;
      const newTx: StreamTransaction = {
        txid: `tx_live_${Math.random().toString(36).substring(2, 9)}`,
        sender: `1${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        receiver: `3${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        amount: +(Math.random() * (isAnomaly ? 25 : 2)).toFixed(3),
        timestamp: new Date().toISOString(),
        ip: isAnomaly ? `185.220.101.${Math.floor(Math.random() * 200)}` : `103.${Math.floor(Math.random() * 200)}.12.${Math.floor(Math.random() * 200)}`,
        country: isAnomaly ? 'TOR Exit (DE)' : 'India (IN)',
        isAnomalous: isAnomaly,
        anomalyScore: isAnomaly ? Math.floor(75 + Math.random() * 22) : Math.floor(5 + Math.random() * 20),
      };

      setStream((prev) => [newTx, ...prev.slice(0, 19)]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="h-6 w-6 text-emerald-400 animate-pulse" />
            Live Ingestion Stream Simulator
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            Simulated WebSocket feed testing real-time anomaly detection pipeline
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isStreaming
                ? 'bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
            }`}
          >
            {isStreaming ? <><Pause className="h-4 w-4" /> Pause Stream</> : <><Play className="h-4 w-4" /> Resume Stream</>}
          </button>
          <button
            onClick={() => setStream([])}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-xs font-mono border border-slate-700"
          >
            Clear Feed
          </button>
        </div>
      </div>

      {/* Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <Zap className="h-4 w-4 text-cyan-400" /> Live Ingestion Feed ({stream.length} Buffer Items)
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Socket Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Sender → Receiver</th>
                <th className="px-6 py-3">Value (BTC)</th>
                <th className="px-6 py-3">Ingress IP / Geo</th>
                <th className="px-6 py-3">Anomaly Score</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stream.map((tx) => (
                <tr
                  key={tx.txid}
                  className={`transition-colors ${
                    tx.isAnomalous ? 'bg-rose-950/30 hover:bg-rose-950/50' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-6 py-3 text-slate-400">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                  <td className="px-6 py-3 font-bold text-cyan-400">{tx.txid}</td>
                  <td className="px-6 py-3 text-slate-300">
                    <span className="text-slate-400">{tx.sender}</span> → <span className="text-slate-200">{tx.receiver}</span>
                  </td>
                  <td className="px-6 py-3 font-bold text-emerald-400">{tx.amount} BTC</td>
                  <td className="px-6 py-3 text-slate-300">
                    {tx.ip} <span className="text-slate-500">({tx.country})</span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`font-bold ${
                        tx.anomalyScore > 75 ? 'text-rose-400' : tx.anomalyScore > 50 ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {tx.anomalyScore}/100
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {tx.isAnomalous ? (
                      <span className="inline-flex items-center gap-1 bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-800 text-[10px] font-bold">
                        <AlertTriangle className="h-3 w-3" /> Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
