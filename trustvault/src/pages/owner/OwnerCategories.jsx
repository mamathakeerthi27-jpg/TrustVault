import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  FolderLock,
  FileText,
  Plus,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/EmptyState';

const DEFAULT_CATEGORIES = [
  { name: 'Financial', color: 'var(--color-emerald)', desc: 'Reconciliations, audit statements, and corporate balance sheets' },
  { name: 'Legal', color: '#818CF8', desc: 'Master services agreements, NDAs, and corporate governance contracts' },
  { name: 'Security', color: 'var(--color-rose)', desc: 'SOC2 certifications, penetration testing reports, and ISO audits' },
  { name: 'Architecture', color: 'var(--color-violet-light)', desc: 'Zero-trust blueprints, mTLS topology, and network ingress specs' },
  { name: 'Compliance', color: 'var(--color-amber)', desc: 'GDPR, HIPAA, and industry compliance attestation records' },
  { name: 'Executive', color: 'var(--color-cyan)', desc: 'Board resolutions, strategic acquisition notes, and cap table models' }
];

export function OwnerCategories() {
  const { currentUser } = useAuth();
  const { documents, shares } = useDocuments();
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const toast = useToast();

  // Strictly current owner's documents
  const myDocs = useMemo(() => {
    return documents.filter(d => d.ownerId === currentUser?.id);
  }, [documents, currentUser]);

  const categoryStats = useMemo(() => {
    const stats = {};
    categoriesList.forEach(c => {
      stats[c.name] = myDocs.filter(d => d.category.toLowerCase() === c.name.toLowerCase());
    });
    return stats;
  }, [categoriesList, myDocs]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    if (categoriesList.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      toast.warning('Category Exists', 'This category is already registered in your vault.');
      return;
    }

    const newCat = {
      name: newCatName.trim(),
      color: 'var(--color-violet-light)',
      desc: newCatDesc.trim() || 'Custom tenant document category'
    };

    setCategoriesList(prev => [...prev, newCat]);
    toast.success('Category Added', `Registered "${newCat.name}" category for your workspace.`);
    setNewCatName('');
    setNewCatDesc('');
    setIsAdding(false);
  };

  const displayedDocs = useMemo(() => {
    if (selectedCategory === 'All') return myDocs;
    return myDocs.filter(d => d.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [myDocs, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Document Categories
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Organize, classify, and inspect confidential assets grouped by corporate operational domains.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>{isAdding ? 'Close Form' : 'Add Category'}</span>
        </button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="glass-panel" style={{ padding: '24px', animation: 'scaleIn 180ms ease-out' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
            Register Custom Category
          </h3>
          <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                placeholder="e.g. Intellectual Property"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description</label>
              <input
                type="text"
                placeholder="Scope or domain description..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-emerald" style={{ height: '42px' }}>
              Save Category
            </button>
          </form>
        </div>
      )}

      {/* Category Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {categoriesList.map(cat => {
          const docsInCat = categoryStats[cat.name] || [];
          const isSelected = selectedCategory === cat.name;

          return (
            <div
              key={cat.name}
              className="card-elevated"
              onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--color-emerald)' : 'var(--border-subtle)',
                background: isSelected ? 'rgba(32, 201, 151, 0.08)' : 'rgba(17, 22, 42, 0.7)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(120, 87, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.color
                    }}
                  >
                    <Tag size={18} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {cat.name}
                  </h3>
                </div>
                <span className="badge badge-muted">
                  {docsInCat.length} file{docsInCat.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {cat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Categorized Documents List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              {selectedCategory === 'All' ? 'All Owned Documents' : `Documents in "${selectedCategory}"`}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {displayedDocs.length} confidential asset{displayedDocs.length !== 1 ? 's' : ''}
            </span>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-violet-light)' }}
            >
              Show All Categories
            </button>
          )}
        </div>

        {displayedDocs.length === 0 ? (
          <EmptyState
            icon={FolderLock}
            title="No documents in this category"
            description="Upload a document and assign this category to organize it here."
            action={
              <Link to="/owner/upload" className="btn btn-emerald btn-sm">
                Upload Document
              </Link>
            }
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Category</th>
                  <th>Classification</th>
                  <th>Size</th>
                  <th>Active Shares</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedDocs.map(doc => {
                  const docShares = shares.filter(s => s.documentId === doc.id && s.status === 'active');
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileText size={18} color="var(--color-emerald)" />
                          <Link
                            to={`/owner/documents/${doc.id}`}
                            style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}
                          >
                            {doc.title}
                          </Link>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-muted">{doc.category}</span>
                      </td>
                      <td>
                        <span className="badge badge-primary">{doc.classification}</span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{doc.size}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <Share2 size={14} color="var(--color-violet-light)" />
                          <span>{docShares.length} recipient{docShares.length !== 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/owner/documents/${doc.id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
