import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Shield,
  Tag,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { useToast } from '../../context/ToastContext';
import { FileDropzone } from '../../components/FileDropzone';

const CATEGORIES = [
  'Financial',
  'Legal',
  'Security',
  'Architecture',
  'Compliance',
  'Executive',
  'Human Resources'
];

const CLASSIFICATIONS = [
  { value: 'Confidential', label: 'Confidential (Standard NDA required)' },
  { value: 'Restricted', label: 'Restricted (Need-to-know access)' },
  { value: 'Highly Confidential', label: 'Highly Confidential (Executive / Audit only)' },
  { value: 'Internal', label: 'Internal (Corporate employees only)' }
];

export function OwnerUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Financial');
  const [classification, setClassification] = useState('Confidential');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();
  const { uploadDocument } = useDocuments();
  const toast = useToast();
  const navigate = useNavigate();

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setError('');
    // Auto-fill title from filename if title empty
    if (!title) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select or drop a file to upload.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a document title.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    // Simulate cryptographic hash computation and chunked upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const res = uploadDocument({
        title,
        category,
        classification,
        description,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      }, currentUser);

      if (res.success) {
        toast.success(
          'Document Registered',
          `"${res.document.title}" encrypted and added to your vault with passcode: ${res.document.passcode}`
        );
        setTimeout(() => {
          navigate('/owner/documents');
        }, 500);
      } else {
        setError(res.error || 'Failed to upload document.');
        setIsUploading(false);
      }
    }, 1100);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Upload Confidential Asset
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Ingest new corporate documents with time-bounded simulated encryption and permission tracking.
        </p>
      </div>

      {/* Mock Storage Prototype Notice */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          background: 'rgba(23, 29, 53, 0.85)',
          borderLeft: '4px solid var(--color-violet)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <Info size={20} color="var(--color-violet-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-main)' }}>Prototype Notice:</strong> This frontend demonstration simulates client-side encryption and mock file storage. Actual server-side AES-256 / ChaCha20 encryption, cloud object storage, and virus scanning will be handled by the upcoming Node.js + Express backend.
        </div>
      </div>

      {/* Upload Form */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--color-rose)',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File dropzone */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '8px' }}>
              <span>Upload Document Payload <span style={{ color: 'var(--color-rose)' }}>*</span></span>
            </label>
            <FileDropzone
              onFileSelected={handleFileSelected}
              selectedFile={file}
              onRemoveFile={() => setFile(null)}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="doc-title" className="form-label">
              <span>Document Title <span style={{ color: 'var(--color-rose)' }}>*</span></span>
            </label>
            <input
              id="doc-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FY2026 Strategic Acquisition Due Diligence"
              required
              disabled={isUploading}
              className="form-control"
            />
          </div>

          {/* Category & Classification */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="doc-category" className="form-label">
                <span>Category</span>
              </label>
              <select
                id="doc-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isUploading}
                className="form-control"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="doc-classification" className="form-label">
                <span>Data Classification</span>
              </label>
              <select
                id="doc-classification"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                disabled={isUploading}
                className="form-control"
              >
                {CLASSIFICATIONS.map(cls => (
                  <option key={cls.value} value={cls.value}>{cls.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="doc-desc" className="form-label">
              <span>Executive Summary / Scope</span>
            </label>
            <textarea
              id="doc-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context regarding document sensitivity, purpose, or intended viewers..."
              disabled={isUploading}
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/owner/documents')}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-emerald btn-lg"
              disabled={isUploading || !file}
            >
              {isUploading ? (
                'Encrypting & Uploading...'
              ) : (
                <>
                  <UploadCloud size={18} />
                  <span>Encrypt & Store in Vault</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
