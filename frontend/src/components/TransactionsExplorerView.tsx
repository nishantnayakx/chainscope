import { useEffect, useState } from 'react';
import type { PaginatedResponse, TransactionDetail, TransactionListItem } from '../types';
import { fetchTransactionDetail, fetchTransactions } from '../api/client';
import { Search, Zap, ArrowRight, X, ExternalLink, Hash, Clock, Cpu } from 'lucide-react';

export default function TransactionsExplorerView() {
  const [data, setData] = useState<PaginatedResponse<TransactionListItem> | null>(null);
  const [selectedTxDetail, setSelectedTxDetail] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [addressFilter, setAddressFilter] = useState('');
  const [ipFilter, setIpFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchTransactions({ address: addressFilter, src_ip: ipFilter }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [addressFilter, ipFilter]);

  const handleSelectTx = async (txid: string) => {
    const detail = await fetchTransactionDetail(txid);
    setSelectedTxDetail(detail);
  };

  if (loading || !data) {
    return <div className="p-8 font-mono text-slate-400">Loading Transaction Index...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            Transaction Index & UTXO Explorer
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            GET /api/v1/transactions/ · Offset-based pagination ({data.count} Total Records)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter address..."
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter Ingress IP..."
              value={ipFilter}
              onChange={(e) => setIpFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-950 uppercase text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Block Height</th>
                <th className="px-6 py-3.5">In / Out Value</th>
                <th className="px-6 py-3.5">UTXO Count</th>
                <th className="px-6 py-3.5">Script Type</th>
                <th className="px-6 py-3.5">Source IP</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.results.map((tx) => (
                <tr key={tx.txid} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-cyan-400 max-w-[180px] truncate" title={tx.txid}>
                    {tx.txid}
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-3.5 text-slate-300">#{tx.block_height}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-emerald-400 font-bold">{tx.total_input_amount} BTC</span>
                    <span className="text-slate-500 text-[10px] block">Fee: {tx.fee} BTC</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">
                    {tx.input_count} In → {tx.output_count} Out
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300">
                      {tx.script_type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-300">{tx.src_ip}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleSelectTx(tx.txid)}
                      className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white transition-colors text-xs font-semibold"
                    >
                      Deep Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Deep Details Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedTxDetail(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-cyan-400">GET /api/v1/transactions/{'{txid}'}/</span>
              <h2 className="font-serif text-lg font-bold text-white mt-1 break-all">{selectedTxDetail.txid}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Block Height</span>
                <span className="font-bold text-white">#{selectedTxDetail.block_height}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Block Hash</span>
                <span className="font-bold text-cyan-300 truncate block" title={selectedTxDetail.block_hash}>
                  {selectedTxDetail.block_hash}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Version / Locktime</span>
                <span className="font-bold text-white">
                  v{selectedTxDetail.version} · LT:{selectedTxDetail.locktime}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Tx Size / Weight</span>
                <span className="font-bold text-white">
                  {selectedTxDetail.transaction_size} bytes ({selectedTxDetail.transaction_weight} wu)
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Source IP:Port</span>
                <span className="font-bold text-emerald-400">
                  {selectedTxDetail.src_ip}:{selectedTxDetail.src_port || 8333}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Destination IP:Port</span>
                <span className="font-bold text-cyan-400">
                  {selectedTxDetail.dst_ip || '198.51.100.1'}:{selectedTxDetail.dst_port || 8333}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-mono font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
