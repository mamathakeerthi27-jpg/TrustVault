import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockDocumentService } from '../services/mockDocumentService';
import { mockAuditService } from '../services/mockAuditService';

const DocumentContext = createContext(null);

const TEMP_DOWNLOADS_KEY = 'trustvault_temp_downloads_v1';
const FIVE_MINUTES_MS = 5 * 60 * 1000;

function loadStoredDownloads() {
  try {
    const raw = localStorage.getItem(TEMP_DOWNLOADS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const now = Date.now();
      // Filter out items already expired in previous session
      return parsed.map(item => {
        const remaining = Math.max(0, Math.floor((item.expiresAt - now) / 1000));
        return {
          ...item,
          remainingSeconds: remaining,
          isExpired: remaining <= 0
        };
      });
    }
  } catch (e) {
    console.error('Error loading temporary downloads', e);
  }
  return [];
}

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState(() => mockDocumentService.getAllDocuments());
  const [shares, setShares] = useState(() => mockDocumentService.getAllShares());
  const [temporaryDownloads, setTemporaryDownloads] = useState(loadStoredDownloads);

  const refreshDocuments = useCallback(() => {
    setDocuments(mockDocumentService.getAllDocuments());
    setShares(mockDocumentService.getAllShares());
  }, []);

  // Save temporary downloads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TEMP_DOWNLOADS_KEY, JSON.stringify(temporaryDownloads));
    } catch (e) {
      console.error('Error saving temporary downloads', e);
    }
  }, [temporaryDownloads]);

  // 1-second countdown interval with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setTemporaryDownloads(prev => {
        if (!prev || prev.length === 0) return prev;

        const now = Date.now();
        let changed = false;

        const updated = prev.map(item => {
          const remaining = Math.max(0, Math.floor((item.expiresAt - now) / 1000));
          const isExpired = remaining <= 0;

          if (remaining !== item.remainingSeconds || isExpired !== item.isExpired) {
            changed = true;
            return {
              ...item,
              remainingSeconds: remaining,
              isExpired
            };
          }
          return item;
        });

        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Add a temporary download entry upon verified passcode
  const recordDownloadSuccess = useCallback((document, currentUser) => {
    const now = Date.now();
    const expiresAt = now + FIVE_MINUTES_MS;

    const newDownloadEntry = {
      id: `tmp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      documentId: document.id,
      title: document.title,
      filename: document.filename,
      size: document.size,
      category: document.category,
      downloadedAt: new Date(now).toISOString(),
      expiresAt: expiresAt,
      remainingSeconds: 300,
      isExpired: false
    };

    setTemporaryDownloads(prev => [newDownloadEntry, ...prev.filter(p => p.documentId !== document.id)]);

    mockAuditService.logEvent({
      actor: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Authorized Viewer',
      actorId: currentUser ? currentUser.id : 'viewer',
      action: 'DOWNLOAD_TOKEN_ISSUED',
      target: document.title,
      result: 'SUCCESS',
      severity: 'INFO',
      details: 'Passcode verified. 5-minute temporary portal download session initialized.'
    });

    return newDownloadEntry;
  }, []);

  // Upload document
  const uploadDocument = useCallback((docData, currentUser) => {
    const res = mockDocumentService.uploadDocument({
      ...docData,
      ownerId: currentUser.id,
      ownerName: currentUser.name
    });

    if (res.success) {
      refreshDocuments();
      mockAuditService.logEvent({
        actor: `${currentUser.name} (Owner)`,
        actorId: currentUser.id,
        action: 'DOCUMENT_UPLOAD',
        target: res.document.title,
        result: 'SUCCESS',
        severity: 'INFO',
        details: `Simulated encryption workflow complete. File size: ${res.document.size}. Classification: ${res.document.classification}.`
      });
    }
    return res;
  }, [refreshDocuments]);

  // Delete document
  const deleteDocument = useCallback((docId, currentUser) => {
    const doc = mockDocumentService.getDocumentById(docId);
    const title = doc?.title || 'Unknown Document';

    const res = mockDocumentService.deleteDocument(docId, currentUser.id);
    if (res.success) {
      refreshDocuments();
      mockAuditService.logEvent({
        actor: `${currentUser.name} (Owner)`,
        actorId: currentUser.id,
        action: 'DOCUMENT_DELETE',
        target: title,
        result: 'SUCCESS',
        severity: 'WARNING',
        details: 'Document and all associated access grants permanently removed.'
      });
    }
    return res;
  }, [refreshDocuments]);

  // Grant share
  const grantShare = useCallback((shareData, currentUser) => {
    const res = mockDocumentService.grantShare({
      ...shareData,
      grantorId: currentUser.id,
      grantorName: currentUser.name
    });

    if (res.success) {
      refreshDocuments();
      mockAuditService.logEvent({
        actor: `${currentUser.name} (Owner)`,
        actorId: currentUser.id,
        action: 'PERMISSION_GRANT',
        target: `${res.share.documentTitle} -> ${res.share.recipientEmail}`,
        result: 'SUCCESS',
        severity: 'INFO',
        details: `Granted permission '${res.share.permission}'. Unique simulated passcode registered.`
      });
    }
    return res;
  }, [refreshDocuments]);

  // Revoke share
  const revokeShare = useCallback((shareId, currentUser) => {
    const allShares = mockDocumentService.getAllShares();
    const share = allShares.find(s => s.id === shareId);
    const targetDesc = share ? `${share.documentTitle} -> ${share.recipientEmail}` : 'Share grant';

    const res = mockDocumentService.revokeShare(shareId, currentUser.id);
    if (res.success) {
      refreshDocuments();
      mockAuditService.logEvent({
        actor: `${currentUser.name} (Owner)`,
        actorId: currentUser.id,
        action: 'PERMISSION_REVOKE',
        target: targetDesc,
        result: 'SUCCESS',
        severity: 'WARNING',
        details: 'Access grant revoked. Viewer can no longer download or view this asset.'
      });
    }
    return res;
  }, [refreshDocuments]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        shares,
        temporaryDownloads,
        refreshDocuments,
        recordDownloadSuccess,
        uploadDocument,
        deleteDocument,
        grantShare,
        revokeShare
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocuments must be used within DocumentProvider');
  return ctx;
}
