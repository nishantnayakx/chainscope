import { useEffect, useState } from 'react';
import type { ClusterInfo } from '../types';
import { fetchClusters } from '../api/client';
import { Layers, ShieldAlert, Cpu, ExternalLink, ArrowUpRight } from 'lucide-react';

export default function ClustersView({ onInvestigate }: { onInvestigate?: (entity: string) => void }) {
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClusters().then((cData) => {
      setClusters(cData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 font-mono text-slate-400">Loading Risk Clusters & Obfuscation Intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-cyan-400" />
            Entity Resolution & Risk Clusters
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            Multi-input co-spending heuristics & CoinJoin / Mixer cluster aggregation
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 font-mono text-xs text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Cpu className="h-4 w-4" /> 19 Clusters Extracted
        </div>
      </div>

      {/* Cluster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clusters.map((c) => (
          <div
            key={c.clusterId}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-cyan-400">{c.clusterId}</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800">
                  Risk {c.riskScore}/100
                </span>
              </div>

              <h2 className="mt-3 font-serif text-lg font-bold text-white">{c.name}</h2>
              <div className="mt-1 text-xs text-rose-300 font-mono flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> {c.primaryRiskType}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Wallets Clustered</span>
                  <span className="font-bold text-slate-200">{c.walletCount} Addresses</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Volume Tracked</span>
                  <span className="font-bold text-emerald-400">{c.totalVolumeBtc} BTC</span>
                </div>
              </div>

              {/* Associated IPs */}
              <div className="mt-4 space-y-1">
                <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">Associated Relay IPs</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.associatedIps.map((ip) => (
                    <span key={ip} className="font-mono text-[11px] bg-slate-950 text-slate-300 px-2 py-1 rounded border border-slate-800">
                      {ip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onInvestigate && onInvestigate(c.topAddresses[0])}
              className="mt-4 w-full bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white py-2 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              Inspect Cluster Graph <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
