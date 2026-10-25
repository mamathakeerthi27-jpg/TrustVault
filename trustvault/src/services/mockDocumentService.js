import { INITIAL_DOCUMENTS, INITIAL_SHARES } from '../data/mockData';
import { generateSimulatedPasscode } from '../utils/formatters';

const DOCS_STORAGE_KEY = 'trustvault_demo_documents_v1';
const SHARES_STORAGE_KEY = 'trustvault_demo_shares_v1';

function loadDocs() {
  try {
    const raw = localStorage.getItem(DOCS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading demo documents', e);
  }
  return [...INITIAL_DOCUMENTS];
}

function saveDocs(docs) {
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Error saving demo documents', e);
  }
}

function loadShares() {
  try {
    const raw = localStorage.getItem(SHARES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading demo shares', e);
  }
  return [...INITIAL_SHARES];
}

function saveShares(shares) {
  try {
    localStorage.setItem(SHARES_STORAGE_KEY, JSON.stringify(shares));
  } catch (e) {
    console.error('Error saving demo shares', e);
  }
}

export const mockDocumentService = {
  // Admin view: all documents
  getAllDocuments() {
    return loadDocs();
  },

  // Owner view: strictly owned documents
  getDocumentsByOwner(ownerId) {
    const docs = loadDocs();
    return docs.filter(d => d.ownerId === ownerId);
  },

  getDocumentById(id) {
    const docs = loadDocs();
    return docs.find(d => d.id === id) || null;
  },

  uploadDocument({ title, category, description, classification, fileName, fileSize, ownerId, ownerName }) {
    const docs = loadDocs();
    const newDocId = `doc_${Date.now().toString(36)}`;
    const passcode = generateSimulatedPasscode('TV');

    const newDoc = {
      id: newDocId,
      title: title.trim(),
      filename: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
      category: category || 'General',
      classification: classification || 'Confidential',
      size: fileSize || '1.2 MB',
      uploadedAt: new Date().toISOString(),
      ownerId: ownerId,
      ownerName: ownerName,
      description: description ? description.trim() : 'Confidential enterprise asset.',
      passcode: passcode,
      fileHash: `sha256:${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
      status: 'active'
    };

    docs.unshift(newDoc);
    saveDocs(docs);
    return { success: true, document: newDoc };
  },

  deleteDocument(docId, ownerId) {
    const docs = loadDocs();
    const doc = docs.find(d => d.id === docId);

    if (!doc) {
      return { success: false, error: 'Document not found' };
    }

    if (doc.ownerId !== ownerId) {
      return { success: false, error: 'Access denied: You can only delete documents you own.' };
    }

    const filteredDocs = docs.filter(d => d.id !== docId);
    saveDocs(filteredDocs);

    // Also remove shares associated with this document
    const shares = loadShares().filter(s => s.documentId !== docId);
    saveShares(shares);

    return { success: true };
  },

  // Sharing permissions management
  getAllShares() {
    return loadShares();
  },

  getSharesForDocument(docId) {
    const shares = loadShares();
    return shares.filter(s => s.documentId === docId);
  },

  getSharesByOwner(ownerId) {
    const shares = loadShares();
    return shares.filter(s => s.grantedBy === ownerId);
  },

  // Viewer view: ONLY explicitly shared documents
  getSharesForViewer(viewerId) {
    const shares = loadShares();
    const docs = loadDocs();

    const viewerShares = shares.filter(s => s.recipientId === viewerId && s.status === 'active');
    
    // Combine share details with document metadata
    return viewerShares.map(share => {
      const doc = docs.find(d => d.id === share.documentId);
      return {
        shareId: share.id,
        permission: share.permission,
        sharedAt: share.createdAt,
        grantedBy: share.grantedBy,
        grantorName: share.grantorName,
        passcode: share.passcode || doc?.passcode,
        document: doc || {
          id: share.documentId,
          title: share.documentTitle,
          status: 'unavailable'
        }
      };
    }).filter(item => item.document.status !== 'unavailable');
  },

  grantShare({ documentId, grantorId, grantorName, recipientId, recipientEmail, recipientName, permission }) {
    const docs = loadDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc) return { success: false, error: 'Document not found' };

    if (doc.ownerId !== grantorId) {
      return { success: false, error: 'Authorization error: Only document owner can grant access.' };
    }

    const shares = loadShares();
    const existingIndex = shares.findIndex(s => s.documentId === documentId && s.recipientId === recipientId);

    if (existingIndex >= 0) {
      // Update existing share
      shares[existingIndex].status = 'active';
      shares[existingIndex].permission = permission || 'read_download';
      shares[existingIndex].createdAt = new Date().toISOString();
      saveShares(shares);
      return { success: true, share: shares[existingIndex], updated: true };
    }

    const newShare = {
      id: `shr_${Date.now().toString(36)}`,
      documentId: documentId,
      documentTitle: doc.title,
      grantedBy: grantorId,
      grantorName: grantorName,
      recipientId: recipientId,
      recipientEmail: recipientEmail,
      recipientName: recipientName,
      permission: permission || 'read_download',
      passcode: doc.passcode,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    shares.unshift(newShare);
    saveShares(shares);
    return { success: true, share: newShare };
  },

  revokeShare(shareId, grantorId) {
    const shares = loadShares();
    const shareIndex = shares.findIndex(s => s.id === shareId);
    if (shareIndex === -1) return { success: false, error: 'Share record not found' };

    if (shares[shareIndex].grantedBy !== grantorId) {
      return { success: false, error: 'Permission denied: Only the granting owner can revoke access.' };
    }

    shares[shareIndex].status = 'revoked';
    saveShares(shares);
    return { success: true, share: shares[shareIndex] };
  },

  verifyPasscode(documentId, passcode) {
    const docs = loadDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc) return { valid: false, error: 'Document not found' };

    const cleanInput = passcode.trim();
    if (cleanInput === doc.passcode) {
      return { valid: true, document: doc };
    }

    // Also check if any share assigned a specific passcode
    const shares = loadShares();
    const share = shares.find(s => s.documentId === documentId && s.passcode === cleanInput);
    if (share && share.status === 'active') {
      return { valid: true, document: doc };
    }

    return { valid: false, error: 'Invalid verification passcode for this document.' };
  }
};
