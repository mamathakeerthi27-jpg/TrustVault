import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RequirePendingOwner, RequireUnauth } from './RouteGuards';
import { AppShell } from '../components/AppShell';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { SignupPage } from '../pages/public/SignupPage';
import { PendingApprovalPage } from '../pages/public/PendingApprovalPage';
import { AccessDeniedPage } from '../pages/public/AccessDeniedPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminOwners } from '../pages/admin/AdminOwners';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminDocuments } from '../pages/admin/AdminDocuments';
import { AdminActivity } from '../pages/admin/AdminActivity';
import { AdminSecurity } from '../pages/admin/AdminSecurity';
import { AdminSettings } from '../pages/admin/AdminSettings';

// Owner Pages
import { OwnerDashboard } from '../pages/owner/OwnerDashboard';
import { OwnerDocuments } from '../pages/owner/OwnerDocuments';
import { OwnerUpload } from '../pages/owner/OwnerUpload';
import { OwnerSharing } from '../pages/owner/OwnerSharing';
import { OwnerCategories } from '../pages/owner/OwnerCategories';
import { OwnerDocumentDetail } from '../pages/owner/OwnerDocumentDetail';
import { OwnerActivity } from '../pages/owner/OwnerActivity';
import { OwnerProfile } from '../pages/owner/OwnerProfile';

// Viewer Pages
import { ViewerDashboard } from '../pages/viewer/ViewerDashboard';
import { ViewerDocuments } from '../pages/viewer/ViewerDocuments';
import { ViewerDownloads } from '../pages/viewer/ViewerDownloads';
import { ViewerNotifications } from '../pages/viewer/ViewerNotifications';
import { ViewerProfile } from '../pages/viewer/ViewerProfile';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />

      {/* Auth Convenience Aliases */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/signup" replace />} />

      {/* Auth Pages (Redirect if already logged in) */}
      <Route element={<RequireUnauth />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
      </Route>

      {/* Pending Owner Screen */}
      <Route element={<RequirePendingOwner />}>
        <Route path="/auth/pending-approval" element={<PendingApprovalPage />} />
      </Route>

      {/* Admin Workspace */}
      <Route element={<RequireAuth allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AppShell title="Administration" breadcrumbs={['Admin']} />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="owners" element={<AdminOwners />} />
          <Route path="approvals" element={<AdminOwners />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Owner Workspace */}
      <Route element={<RequireAuth allowedRoles={['owner']} />}>
        <Route path="/owner" element={<AppShell title="Owner Workspace" breadcrumbs={['Owner']} />}>
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="documents" element={<OwnerDocuments />} />
          <Route path="upload" element={<OwnerUpload />} />
          <Route path="sharing" element={<OwnerSharing />} />
          <Route path="categories" element={<OwnerCategories />} />
          <Route path="documents/:id" element={<OwnerDocumentDetail />} />
          <Route path="activity" element={<OwnerActivity />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>
      </Route>

      {/* Viewer Workspace */}
      <Route element={<RequireAuth allowedRoles={['viewer']} />}>
        <Route path="/viewer" element={<AppShell title="Viewer Portal" breadcrumbs={['Viewer']} />}>
          <Route index element={<Navigate to="/viewer/dashboard" replace />} />
          <Route path="dashboard" element={<ViewerDashboard />} />
          <Route path="documents" element={<ViewerDocuments />} />
          <Route path="shared" element={<ViewerDocuments />} />
          <Route path="downloads" element={<ViewerDownloads />} />
          <Route path="notifications" element={<ViewerNotifications />} />
          <Route path="profile" element={<ViewerProfile />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
