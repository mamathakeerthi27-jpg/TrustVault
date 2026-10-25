import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'image/png',
  'image/jpeg'
];

export function FileDropzone({ onFileSelected, selectedFile, onRemoveFile, isUploading = false, uploadProgress = 0 }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const validateAndProcess = (file) => {
    setValidationError('');
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(`File size exceeds 25 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    // Pass file to parent
    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragOver ? 'var(--color-violet)' : 'var(--border-medium)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '40px 20px',
            textAlign: 'center',
            background: isDragOver ? 'rgba(120, 87, 255, 0.08)' : 'rgba(11, 16, 32, 0.6)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleInputChange}
            accept=".pdf,.docx,.xlsx,.txt,.zip,.png,.jpg"
          />
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(120, 87, 255, 0.12)',
              color: 'var(--color-violet-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <UploadCloud size={28} />
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
            Choose a file or drag & drop it here
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Supported formats: PDF, DOCX, XLSX, TXT, ZIP, PNG, JPG (Max 25 MB)
          </p>
          <span className="btn btn-secondary btn-sm" style={{ pointerEvents: 'none' }}>
            Browse Local File
          </span>
        </div>
      ) : (
        <div
          className="card-elevated"
          style={{
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(32, 201, 151, 0.12)',
                  color: 'var(--color-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Standard File'}
                </div>
              </div>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={onRemoveFile}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '4px' }}
                aria-label="Remove selected file"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Upload progress bar */}
          {isUploading && (
            <div style={{ width: '100%', marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>Simulating client encryption & upload...</span>
                <span style={{ fontWeight: 600, color: 'var(--color-violet-light)' }}>{uploadProgress}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(167, 174, 220, 0.15)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-violet) 0%, var(--color-emerald) 100%)',
                    transition: 'width 200ms ease'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {validationError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-rose)', fontSize: '13px', marginTop: '8px' }}>
          <AlertCircle size={15} />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
