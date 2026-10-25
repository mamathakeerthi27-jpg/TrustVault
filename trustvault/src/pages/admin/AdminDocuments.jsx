import React, { useState, useMemo } from 'react';
import {
  FolderLock,
  Search,
  Filter,
  FileText,
  User,
  Share2,
  Lock,
  Shield,
  Tag
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

export function AdminDocuments() {
  const { documents, shares } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all');

  const categories = useMemo(() => {
    return Array.from(new Set(documents.map(d => d.category)));
  }, [documents]);

  const classifications = useMemo(() => {
    return Array.from(new Set(documents.map(d => d.classification)));
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'all' || doc.category === categoryFilter;
      const matchesClass = classificationFilter === 'all' || doc.classification === classificationFilter;

      return matchesSearch && matchesCat && matchesClass;
    });
  }, [documents, searchQuery, categoryFilter, classificationFilter]);

  const getDocShareCount = (docId) => {
    return shares.filter(s => s.documentId === docId && s.status === 'active').length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Global Document Inventory
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Platform-wide inventory of tenant encrypted assets, data classifications, and active access grants.
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
              placeholder="Search by title, filename, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={16} color="var(--text-muted)" />
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
            <Shield size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Classification:</span>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="all">All Classifications</option>
              {classifications.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FolderLock}
          title="No documents matching search"
          description="Adjust your search terms or filters to view documents in the registry."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name & File</th>
                <th>Owner (Tenant)</th>
                <th>Category</th>
                <th>Classification</th>
                <th>Active Shares</th>
                <th>Upload Date</th>
                <th>Status</th>
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
                            background: 'rgba(120, 87, 255, 0.12)',
                            color: 'var(--color-violet-light)',
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
                            {doc.filename} • {doc.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>
                        <User size={14} color="var(--color-emerald)" />
                        <span>{doc.ownerName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-muted">
                        {doc.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: doc.classification === 'Highly Confidential' ? 'rgba(244, 63, 94, 0.12)' : doc.classification === 'Restricted' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(120, 87, 255, 0.12)',
                          color: doc.classification === 'Highly Confidential' ? 'var(--color-rose)' : doc.classification === 'Restricted' ? 'var(--color-amber)' : 'var(--color-violet-light)',
                          border: `1px solid ${doc.classification === 'Highly Confidential' ? 'rgba(244, 63, 94, 0.3)' : doc.classification === 'Restricted' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(120, 87, 255, 0.3)'}`
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
                      <StatusBadge status={doc.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
