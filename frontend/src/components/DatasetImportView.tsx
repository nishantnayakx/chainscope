import { useEffect, useState } from 'react';
import type { DatasetDetail } from '../types';
import { fetchDatasetDetail, importDataset, triggerAnalysis } from '../api/client';
import { Upload, Database, CheckCircle, AlertCircle, Play, Cpu, FileText } from 'lucide-react';

export default function DatasetImportView() {
  const [dataset, setDataset] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDatasetDetail('demo_01').then((data) => {
      setDataset(data);
      setLoading(false);
    });
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus('Uploading transaction file...');
    try {
      const res = await importDataset(selectedFile, 'demo_01');
      setUploadStatus(`Ingestion Job Queued (ID: ${res.job_id}). Triggering ML Pipeline...`);
      await triggerAnalysis(res.dataset_id);
      const updated = await fetchDatasetDetail(res.dataset_id);
      setDataset(updated);
      setUploadStatus('Ingestion & Analysis Pipeline Completed Successfully!');
    } catch (err: any) {
      setUploadStatus(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !dataset) {
    return <div className="p-8 font-mono text-slate-400">Loading Dataset Ingestion Status...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-cyan-400" />
            Dataset Ingestion & Pipeline Control
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            POST /api/v1/datasets/import/ · Pipeline trigger /api/v1/analysis/
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 font-mono text-xs text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          Dataset: <span className="font-bold text-white">{dataset.dataset_id}</span> ({dataset.source_format})
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Form Card (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Upload className="h-5 w-5 text-cyan-400" />
            Upload Raw Ingestion File (CSV / JSON)
          </h2>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-8 text-center bg-slate-950 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv,.json"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                <FileText className="h-10 w-10 text-cyan-400 mx-auto" />
                <div className="text-sm font-mono font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to select CSV or JSON file'}
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Supported formats: Bitcoin Raw Dump (UTXO, IP, Timestamps)
                </div>
              </label>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-slate-950 border border-cyan-800 rounded-lg text-xs font-mono text-cyan-300">
                {uploadStatus}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className={`w-full py-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                selectedFile && !uploading
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="h-4 w-4" /> {uploading ? 'Ingesting Dataset...' : 'Start Ingestion & Analysis Pipeline'}
            </button>
          </form>
        </div>

        {/* Dataset Ingestion Summary Stats (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="h-5 w-5 text-cyan-400" />
            Ingestion Pipeline Validation Report
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Valid Records</span>
              <span className="font-bold text-emerald-400 text-lg flex items-center gap-1.5 mt-1">
                <CheckCircle className="h-4 w-4" /> {dataset.stats.records_valid.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Rejected / Errored</span>
              <span className="font-bold text-rose-400 text-lg flex items-center gap-1.5 mt-1">
                <AlertCircle className="h-4 w-4" /> {dataset.stats.records_errored}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Total Transactions</span>
              <span className="font-bold text-cyan-400 text-base mt-1 block">
                {dataset.stats.transactions.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Discovered Wallets</span>
              <span className="font-bold text-cyan-400 text-base mt-1 block">
                {dataset.stats.wallets.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Unique Ingress IPs</span>
              <span className="font-bold text-white text-base mt-1 block">
                {dataset.stats.unique_ips.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Unique Countries</span>
              <span className="font-bold text-white text-base mt-1 block">
                {dataset.stats.unique_countries} Countries
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
