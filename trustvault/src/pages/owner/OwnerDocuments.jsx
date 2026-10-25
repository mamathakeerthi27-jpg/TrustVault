import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderLock,
  Search,
  Filter,
  FileText,
  UploadCloud,
  Trash2,
  Share2,
  ExternalLink,
  Shield,
  Eye,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

export function OwnerDocuments() {
  const { currentUser } = useAuth();
  const { documents, shares, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  // STRICT RULE: Only show documents owned by current owner
  const myDocs = useMemo(() => {
    return documents.filter(d => d.ownerId === currentUser?.id);
  }, [documents, currentUser]);

  const categories = useMemo(() => {
    return Array.from(new Set(myDocs.map(d => d.category)));
  }, [myDocs]);

  const filteredDocs = useMemo(() => {
    return myDocs
      .filter(doc => {
        const matchesSearch =
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = categoryFilter === 'all' || doc.category === categoryFilter;

        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        } else if (sortOrder === 'oldest') {
          return new Date(a.uploadedAt) - new Date(b.uploadedAt);
        } else {
          return a.title.localeCompare(b.title);
        }
      });
  }, [myDocs, searchQuery, categoryFilter, sortOrder]);

  const getDocShareCount = (docId) => {
    return shares.filter(s => s.documentId === docId && s.status === 'active').length;
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    setIsDeleting(true);

    const res = deleteDocument(docToDelete.id, currentUser);
    setTimeout(() => {
      if (res.success) {
        toast.success('Document Deleted', `"${docToDelete.title}" and associated shares have been removed.`);
      } else {
        toast.error('Deletion Failed', res.error || 'Could not delete document.');
      }
      setIsDeleting(false);
      setDocToDelete(null);
    }, 350);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            My Stored Documents
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Confidential assets owned by your corporate tenant profile.
          </p>
        </div>

        <Link to="/owner/upload" className="btn btn-emerald">
          <UploadCloud size={16} />
          <span>Upload Document</span>
        </Link>
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
              placeholder="Search your documents by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid / Table */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FolderLock}
          title={myDocs.length === 0 ? "You haven't uploaded any documents" : "No documents match search"}
          description={myDocs.length === 0 ? "Upload your first confidential enterprise document to begin sharing." : "Try clearing your search terms or filters."}
          action={
            myDocs.length === 0 && (
              <Link to="/owner/upload" className="btn btn-emerald">
                <Plus size={16} />
                Upload New File
              </Link>
            )
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Title & File</th>
                <th>Category</th>
                <th>Classification</th>
                <th>Active Shares</th>
                <th>Upload Date</th>
                <th>Passcode (Demo)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => {
                const shareCount = getDocShareCount(doc.id);

                return (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(32, 201, 151, 0.12)',
                            color: 'var(--color-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <FileText size={20} />
                        </div>
                        <div>
                          <Link
                            to={`/owner/documents/${doc.id}`}
                            style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-emerald)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                          >
                            {doc.title}
                          </Link>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {doc.filename} • {doc.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-muted">{doc.category}</span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: doc.classification === 'Highly Confidential' ? 'rgba(244, 63, 94, 0.12)' : doc.classification === 'Restricted' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(120, 87, 255, 0.12)',
                          color: doc.classification === 'Highly Confidential' ? 'var(--color-rose)' : doc.classification === 'Restricted' ? 'var(--color-amber)' : 'var(--color-violet-light)',
                          border: `1px solid ${doc.classification === 'Highly Confidential' ? 'rgba(244, 63, 94, 0.28)' : 'rgba(120, 87, 255, 0.28)'}`
                        }}
                      >
                        {doc.classification}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <Share2 size={14} color="var(--color-violet-light)" />
                        <span>{shareCount} recipient{shareCount !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td>
                      <code style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'rgba(0, 0, 0, 0.4)', padding: '3px 6px', borderRadius: '4px', color: 'var(--color-emerald)' }}>
                        {doc.passcode}
                      </code>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link
                          to={`/owner/documents/${doc.id}`}
                          className="btn btn-secondary btn-sm"
                          title="View metadata and access list"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </Link>
                        <Link
                          to="/owner/sharing"
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-violet-light)' }}
                          title="Manage sharing grants"
                        >
                          <Share2 size={14} />
                          <span>Share</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="btn btn-outline-danger btn-sm"
                          title="Delete document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Confidential Document?"
        message={`Are you sure you want to permanently delete "${docToDelete?.title}"? All viewer access grants for this file will be immediately invalidated.`}
        confirmLabel="Delete Document"
        confirmVariant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
