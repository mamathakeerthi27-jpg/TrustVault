# TrustVault — Secure sharing. Smarter access. Verifiable accountability.

> **Enterprise-grade multi-tenant confidential document-sharing platform featuring role-segregated workspaces, time-bounded access tokens, simulated passcode decryption, and immutable audit telemetry.**

---

## 1. Overview & Architecture

TrustVault is an enterprise document-sharing web application built with **React.js, Vite, React Router v6, HTML5, and CSS3**. It implements a zero-trust tenant model with three strictly segregated roles:

1. **System Administrator** (`admin`): Exercises platform governance, approves or rejects new corporate owner accounts, audits global security events, and inspects multi-tenant access control lists.
2. **Document Owner** (`owner`): Enterprise tenant user who uploads confidential files, defines data classifications, issues least-privilege access grants, and manages document lifecycles. Newly registered owners start in **Pending approval** status and cannot enter the owner workspace until approved by an Admin.
3. **Authorized Viewer** (`viewer`): External or restricted partner consumer who can strictly read and download documents explicitly shared with them. Every document download requires passcode authentication and triggers a **5-minute expiring download token**. Viewers have no upload, edit, delete, or re-sharing capabilities.

---

## 2. Seeded Demo Accounts

During demonstration and interviews, you can either sign in with the following seeded accounts or use the built-in **"Demo Persona"** switcher located in the top navigation bar:

| Persona | Role | Email | Password | Status | Intended Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sarah Connor** | Administrator | `admin@trustvault.internal` | `AdminPass123!` | Active | Full administrative oversight, owner approval queues, global activity logs. |
| **Elena Rostova** | Document Owner | `elena.rostova@acmecorp.com` | `OwnerPass123!` | Active | Ingests documents, manages access control lists, grants/revokes viewer permissions. |
| **Marcus Vance** | Document Owner | `marcus.vance@apexfinancial.io` | `OwnerPass123!` | Active | Financial tenant owner with restricted legal & architectural documents. |
| **David Kim** | Document Owner | `david.kim@synthetix.tech` | `PendingPass123!` | Pending | **Locked in Pending Approval Screen** until approved by Administrator. |
| **Charlotte Lin** | Authorized Viewer | `charlotte.lin@partnerfirm.com` | `ViewerPass123!` | Active | Restricted consumer with time-bounded downloads and passcode validation. |
| **Liam Neil** | Authorized Viewer | `liam.neil@auditconsulting.org` | `ViewerPass123!` | Active | External compliance auditor with access to penetration testing reports. |

*Note: Public registration (`/auth/signup`) offers ONLY Owner and Viewer roles. Administrators are provisioned via internal security policy and cannot be created via public signup.*

---

## 3. Key Feature Implementation

### Time-Bounded Download Flow & 5-Minute Timer
- When an authorized viewer clicks **Download**, a Passcode Verification Modal appears with an **Autofill Helper** for the demo.
- Upon successful verification, the document is registered in the **Temporary Downloads** queue with a real-time **5-minute (300-second) countdown timer**.
- When the 5 minutes elapse, the entry transitions to **`Expired — request access again`**.
- *Important boundary notice:* The 5-minute countdown applies strictly to the web application's authorized portal session. As noted in the interface, web applications cannot remotely erase files saved to a user's operating system disk.

### Strict Tenant Boundary & Least Privilege
- Owners can only view, manage, and share documents they own (`ownerId === currentUser.id`).
- Viewers can only view documents explicitly granted to their verified email.
- The Admin workspace is completely unreachable by Owner and Viewer accounts, guarded by both route-level authorization barriers (`RequireAuth`) and navigation segregation.

### Immutable Audit Event Logging
- Operations (authentication, document uploads, permission grants, revocations, and download tokens) produce structured audit events.
- Audit logs contain Actor, Action, Target, Timestamp, Result, and Severity.
- **Zero-Secret Rule:** Passwords, passcodes, and raw document contents are never written to audit logs.

---

## 4. Local Setup & Execution

### Prerequisites
- Node.js (v18+ or v20+ LTS)
- npm (v9+)

### Installation
```bash
# Navigate to the project root
cd c:/Users/mamat/TrustVault/trustvault

# Install dependencies
npm install
```

### Running Locally (Laptop Browser)
```bash
# Start Vite development server
npm run dev
```
Open **`http://localhost:5173/`** in your desktop browser.

### Production Build & Validation
```bash
npm run build
```
The production bundle builds to `dist/` in ~2.5 seconds with zero compilation warnings.

---

## 5. Mobile & Cross-Device Testing (Same Wi-Fi)

To test on your smartphone or tablet connected to the same Wi-Fi network:

1. Identify your computer's local LAN IP address:
   - On Windows: Run `ipconfig` or `Get-NetIPAddress`
   - Current verified local LAN IP: **`192.168.1.9`**
2. Run the development server with host binding:
   ```bash
   npx vite --host 0.0.0.0 --port 5173
   ```
3. Open your mobile phone browser (Chrome, Safari, Firefox) and navigate to:
   ```
   http://192.168.1.9:5173/
   ```
4. Mobile design optimizations tested:
   - Sidebar transforms into a touch-friendly slide-over drawer toggled via the Topbar menu button.
   - Tables automatically adapt with horizontal smooth-scrolling containers or stacked cards.
   - Modals and forms fit within standard 390px (iPhone 13/14/15) and 360px viewports with zero horizontal page overflow.

---

## 6. Directory Structure

```
trustvault/
├── src/
│   ├── app/
│   │   ├── AppRoutes.jsx         # Complete application route tree
│   │   └── RouteGuards.jsx       # Role and account status protection
│   ├── components/
│   │   ├── AppShell.jsx          # Main layout shell with responsive drawer
│   │   ├── Sidebar.jsx           # Role-specific sidebar navigation
│   │   ├── Topbar.jsx            # Breadcrumbs, user profile, demo indicator
│   │   ├── DemoSwitcher.jsx      # 1-click persona switching for evaluations
│   │   ├── PasscodeModal.jsx     # Viewer passcode download verification modal
│   │   ├── FileDropzone.jsx      # Drag-and-drop file upload with progress bar
│   │   ├── PasswordField.jsx     # Password field with show/hide toggle
│   │   ├── ConfirmDialog.jsx     # Accessible confirmation dialog
│   │   ├── StatCard.jsx          # Metric cards with subtle glowing gradients
│   │   ├── StatusBadge.jsx       # Dynamic status badges with icons
│   │   ├── PermissionBadge.jsx   # Read/Download vs. Edit badges
│   │   ├── EmptyState.jsx        # Polished empty data states
│   │   └── LoadingState.jsx      # Glowing spinner loading component
│   ├── context/
│   │   ├── AuthContext.jsx       # User identity, session persistence, role state
│   │   ├── DocumentContext.jsx   # Documents, shares, 5-minute countdown timers
│   │   └── ToastContext.jsx      # Animated toast notifications system
│   ├── data/
│   │   └── mockData.js           # Seeded users, documents, shares, audit events
│   ├── pages/
│   │   ├── public/               # Landing, Login, Signup, PendingApproval, 404, 403
│   │   ├── admin/                # Dashboard, Owners, Users, Documents, Activity, Security, Settings
│   │   ├── owner/                # Dashboard, My Documents, Upload, Sharing, Detail, Activity
│   │   └── viewer/               # Dashboard, Shared Documents, Downloads, Profile
│   ├── services/
│   │   ├── mockAuthService.js    # Authentication and approval workflows
│   │   ├── mockDocumentService.js# Document catalog, boundaries, passcode validation
│   │   └── mockAuditService.js   # Non-leaking audit event logger
│   ├── styles/
│   │   └── index.css             # Design tokens, enterprise dark theme, glassmorphism
│   ├── utils/
│   │   └── formatters.js         # Date, countdown, file size, and passcode utilities
│   ├── App.jsx                   # Application root with context providers
│   └── main.jsx                  # React DOM entry point
├── index.html                    # HTML5 template with Google Fonts (Plus Jakarta Sans)
├── package.json                  # React, React Router, Lucide, Vite configuration
├── vite.config.js                # Vite build and 0.0.0.0 server configuration
├── SECURITY_NOTES.md             # Security boundaries and future backend requirements
└── PROMPTS.md                    # Detailed development trajectory and verification logs
```

---

## 7. Next Steps for Backend Integration (Node.js + Express)

Refer to **`SECURITY_NOTES.md`** for detailed specifications on migrating client-side mock services to a production Node.js + Express backend.
