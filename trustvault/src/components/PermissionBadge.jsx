import React from 'react';
import { Download, Edit3, Eye } from 'lucide-react';

export function PermissionBadge({ permission }) {
  const norm = permission?.toLowerCase() || 'read_download';

  if (norm === 'edit') {
    return (
      <span className="badge badge-primary">
        <Edit3 size={12} strokeWidth={2.5} />
        <span>Edit / Manage</span>
      </span>
    );
  }

  return (
    <span className="badge badge-success">
      <Download size={12} strokeWidth={2.5} />
      <span>Read / Download</span>
    </span>
  );
}
