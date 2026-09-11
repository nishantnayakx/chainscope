import { useEffect, useState } from 'react';
import type { DatasetDetail } from '../types';
import { fetchDatasetDetail, importDataset, triggerAnalysis } from '../api/client';
import { Upload, Database, CheckCircle, AlertCircle, Play, Cpu, FileText } from 'lucide-react';

export default function DatasetImportView() {
  const [dataset, setDataset] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDatasetDetail('demo_01')
      .then((data) => {
        setDataset(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-[var(--netra-accent)] border-t-transparent animate-spin" />
          <p className="font-mono text-sm text-[var(--netra-text-muted)]">Loading dataset status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="netra-card p-6 border-red-500/30 space-y-2 max-w-lg mx-auto mt-12">
        <div className="text-red-400 font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5" /> Connection Error
        </div>
        <p className="text-sm text-[var(--netra-text-muted)] font-mono">{error}</p>
      </div>
    );
  }

  if (!dataset) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--netra-border)] pb-5">
        <div>
          <h1 className="netra-section-title text-2xl">
            <Database className="h-6 w-6 text-[var(--netra-accent)]" />
            Dataset Ingestion & Pipeline
          </h1>
          <p className="text-sm text-[var(--netra-text-muted)] font-mono mt-1">
            Upload raw Bitcoin transaction data and trigger the ML analysis pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 font-mono text-xs text-[var(--netra-accent)] netra-card px-3 py-1.5">
          Dataset: <span className="font-bold text-white">{dataset.dataset_id}</span> ({dataset.source_format})
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Form Card */}
        <div className="lg:col-span-6 netra-card-elevated p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[var(--netra-border)] pb-3">
            <Upload className="h-5 w-5 text-[var(--netra-accent)]" />
            Upload Raw Ingestion File
          </h2>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="border-2 border-dashed border-[var(--netra-border)] hover:border-[var(--netra-accent)]/50 rounded-xl p-8 text-center bg-[var(--netra-bg)] transition-colors cursor-pointer group">
              <input
                type="file"
                accept=".csv,.json"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                <FileText className="h-10 w-10 text-[var(--netra-accent)] mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-sm font-mono font-semibold text-white">
                  {selectedFile ? selectedFile.name : 'Click to select CSV or JSON file'}
                </div>
                <div className="text-xs font-mono text-[var(--netra-text-muted)]">
                  Supported: Bitcoin Raw Dump (UTXO, IP, Timestamps)
                </div>
              </label>
            </div>

            {uploadStatus && (
              <div className="p-3 netra-card border-[var(--netra-accent)]/30 text-xs font-mono text-[var(--netra-accent)]">
                {uploadStatus}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className={`w-full py-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                selectedFile && !uploading
                  ? 'netra-btn-primary justify-center w-full'
                  : 'bg-[var(--netra-surface-2)] text-[var(--netra-text-muted)] cursor-not-allowed border border-[var(--netra-border)]'
              }`}
            >
              <Play className="h-4 w-4" /> {uploading ? 'Ingesting Dataset...' : 'Start Ingestion & Analysis Pipeline'}
            </button>
          </form>
        </div>

        {/* Dataset Stats Card */}
        <div className="lg:col-span-6 netra-card-elevated p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[var(--netra-border)] pb-3">
            <Cpu className="h-5 w-5 text-[var(--netra-accent)]" />
            Pipeline Validation Report
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[var(--netra-bg)] p-3.5 rounded-lg border border-[var(--netra-border)]">
              <span className="text-[var(--netra-text-muted)] block text-[10px] uppercase">Valid Records</span>
              <span className="font-bold text-emerald-400 text-lg flex items-center gap-1.5 mt-1">
                <CheckCircle className="h-4 w-4" /> {dataset.stats.records_valid.toLocaleString()}
              </span>
            </div>

            <div className="bg-[var(--netra-bg)] p-3.5 rounded-lg border border-[var(--netra-border)]">
              <span className="text-[var(--netra-text-muted)] block text-[10px] uppercase">Rejected / Errored</span>
              <span className="font-bold text-red-400 text-lg flex items-center gap-1.5 mt-1">
                <AlertCircle className="h-4 w-4" /> {dataset.stats.records_errored}
              </span>
            </div>

            <div className="bg-[var(--netra-bg)] p-3.5 rounded-lg border border-[var(--netra-border)]">
              <span className="text-[var(--netra-text-muted)] block text-[10px] uppercase">Total Transactions</span>
              <span className="font-bold text-[var(--netra-accent)] text-base mt-1 block">
                {dataset.stats.transactions.toLocaleString()}
              </span>
            </div>

            <div className="bg-[var(--netra-bg)] p-3.5 rounded-lg border border-[var(--netra-border)]">
              <span className="text-[var(--netra-text-muted)] block text-[10px] uppercase">Discovered Wallets</span>
              <span className="font-bold text-[var(--netra-accent)] text-base mt-1 block">
                {dataset.stats.wallets.toLocaleString()}
              </span>
            </div>

            <div className="bg-[var(--netra-bg)] p-3.5 rounded-lg border border-[var(--netra-border)]">
              <span className="text-[var(--netra-text-muted)] block text-[10px] uppercase">Unique Ingress IPs</span>
              <span className="font-bold text-white text-base mt-1 block">
                {dataset.stats.unique_ips.toLocaleString()}
              </span>
            </div>

            <div className="bg-[var(--netra-bg)] p-3.5 rounded-lg border border-[var(--netra-border)]">
              <span className="text-[var(--netra-text-muted)] block text-[10px] uppercase">Countries</span>
              <span className="font-bold text-white text-base mt-1 block">
                {dataset.stats.unique_countries}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
