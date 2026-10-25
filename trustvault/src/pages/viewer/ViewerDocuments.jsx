import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderLock,
  Search,
  Filter,
  FileText,
  Download,
  User,
  Shield,
  Clock,
  AlertCircle,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { PasscodeModal } from '../../components/PasscodeModal';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';

export function ViewerDocuments() {
  const { currentUser } = useAuth();
  const { shares, documents } = useDocuments();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDocForDownload, setSelectedDocForDownload] = useState(null);

  // STRICT RULE: Only documents explicitly shared with current viewer
  const sharedItems = useMemo(() => {
    return shares
      .filter(s => s.recipientId === currentUser?.id)
      .map(share => {
        const doc = documents.find(d => d.id === share.documentId);
        return {
          shareId: share.id,
          permission: share.permission,
          sharedAt: share.createdAt,
          grantedBy: share.grantedBy,
          grantorName: share.grantorName,
          status: share.status,
          passcode: share.passcode || doc?.passcode,
          document: doc || {
            id: share.documentId,
            title: share.documentTitle,
            category: 'General',
            size: 'Unknown',
            status: 'unavailable'
          }
        };
      });
  }, [shares, documents, currentUser]);

  const categories = useMemo(() => {
    return Array.from(new Set(sharedItems.map(item => item.document.category)));
  }, [sharedItems]);

  const filteredItems = useMemo(() => {
    return sharedItems.filter(item => {
      const doc = item.document;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.grantorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'all' || doc.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [sharedItems, searchQuery, categoryFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Shared Confidential Documents
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Restricted repository of enterprise files explicitly shared with your verified identity.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search shared documents by title or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Shared Documents Table */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={FolderLock}
          title="No documents shared with you"
          description="Documents that enterprise owners authorize for your account will appear here."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name & File</th>
                <th>Authorizing Owner</th>
                <th>Category</th>
                <th>Shared Date</th>
                <th>Access Status</th>
                <th style={{ textAlign: 'right' }}>Permitted Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const doc = item.document;
                const isRevoked = item.status === 'revoked' || doc.status === 'unavailable';

                return (
                  <tr key={item.shareId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--radius-sm)',
                            background: isRevoked ? 'rgba(244, 63, 94, 0.1)' : 'rgba(79, 70, 229, 0.15)',
                            color: isRevoked ? 'var(--color-rose)' : '#818CF8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
                            {doc.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {doc.filename || 'Confidential Asset'} • {doc.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <User size={14} color="var(--color-emerald)" />
                        <span>{item.grantorName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-muted">{doc.category}</span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {formatDate(item.sharedAt)}
                    </td>
                    <td>
                      {isRevoked ? (
                        <span className="badge badge-danger">Access Unavailable</span>
                      ) : (
                        <StatusBadge status="active" label="Authorized" />
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isRevoked ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled
                          style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        >
                          Access Unavailable
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedDocForDownload(doc)}
                          className="btn btn-emerald btn-sm"
                        >
                          <Download size={14} />
                          <span>Download</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Passcode Modal Dialog */}
      <PasscodeModal
        isOpen={!!selectedDocForDownload}
        onClose={() => setSelectedDocForDownload(null)}
        document={selectedDocForDownload}
        onDownloadSuccess={() => navigate('/viewer/downloads')}
      />
    </div>
  );
}
