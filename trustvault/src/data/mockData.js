/**
 * TrustVault - Seeded Mock Data for Frontend Prototype
 * 
 * DISCLAIMER: This is prototype data used strictly for client-side demonstration.
 * Passwords, secrets, and cryptographic signatures are simulated.
 * The production application will enforce all authorization and encryption via Node.js + Express backend.
 */

export const INITIAL_USERS = [
  {
    id: "usr_admin_01",
    name: "Sarah Connor",
    email: "admin@trustvault.internal",
    password: "AdminPass123!",
    role: "admin",
    status: "active",
    company: "TrustVault Internal Security",
    createdAt: "2026-08-10T09:00:00Z",
    lastLogin: "2026-10-24T18:15:00Z"
  },
  {
    id: "usr_owner_01",
    name: "Elena Rostova",
    email: "elena.rostova@acmecorp.com",
    password: "OwnerPass123!",
    role: "owner",
    status: "active",
    company: "Acme Enterprise Solutions",
    createdAt: "2026-09-01T10:30:00Z",
    lastLogin: "2026-10-24T16:40:00Z"
  },
  {
    id: "usr_owner_02",
    name: "Marcus Vance",
    email: "marcus.vance@apexfinancial.io",
    password: "OwnerPass123!",
    role: "owner",
    status: "active",
    company: "Apex Financial Holdings",
    createdAt: "2026-09-15T14:20:00Z",
    lastLogin: "2026-10-24T12:00:00Z"
  },
  {
    id: "usr_owner_03",
    name: "David Kim",
    email: "david.kim@synthetix.tech",
    password: "PendingPass123!",
    role: "owner",
    status: "pending",
    company: "Synthetix AI Labs",
    createdAt: "2026-10-24T08:00:00Z",
    lastLogin: null
  },
  {
    id: "usr_viewer_01",
    name: "Charlotte Lin",
    email: "charlotte.lin@partnerfirm.com",
    password: "ViewerPass123!",
    role: "viewer",
    status: "active",
    company: "Partner Advisory Group",
    createdAt: "2026-09-18T11:00:00Z",
    lastLogin: "2026-10-24T17:10:00Z"
  },
  {
    id: "usr_viewer_02",
    name: "Liam Neil",
    email: "liam.neil@auditconsulting.org",
    password: "ViewerPass123!",
    role: "viewer",
    status: "active",
    company: "Global Audit & Consulting",
    createdAt: "2026-09-22T15:45:00Z",
    lastLogin: "2026-10-23T19:30:00Z"
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: "doc_acq_001",
    title: "Q3 2026 Strategic Acquisition Audit",
    filename: "Q3_Strategic_Acquisition_Audit.pdf",
    category: "Financial",
    classification: "Highly Confidential",
    size: "4.8 MB",
    uploadedAt: "2026-10-12T14:22:00Z",
    ownerId: "usr_owner_01",
    ownerName: "Elena Rostova",
    description: "Detailed financial evaluation, balance sheet reconciliation, and liability projections for project Titan.",
    passcode: "TV-ACQ-9281",
    fileHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    status: "active"
  },
  {
    id: "doc_soc_002",
    title: "SOC2 Type II Compliance Attestation",
    filename: "SOC2_Type_II_Attestation_2026.pdf",
    category: "Security",
    classification: "Restricted",
    size: "2.3 MB",
    uploadedAt: "2026-10-14T09:15:00Z",
    ownerId: "usr_owner_01",
    ownerName: "Elena Rostova",
    description: "Annual external auditor certification of security, availability, and confidentiality controls.",
    passcode: "TV-SOC-4412",
    fileHash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "active"
  },
  {
    id: "doc_pen_003",
    title: "Penetration Testing Summary Report v4",
    filename: "PenTest_Summary_Oct2026.pdf",
    category: "Security",
    classification: "Highly Confidential",
    size: "1.9 MB",
    uploadedAt: "2026-10-19T11:40:00Z",
    ownerId: "usr_owner_01",
    ownerName: "Elena Rostova",
    description: "Independent third-party penetration testing methodology, verified remediations, and residual risk posture.",
    passcode: "TV-PEN-1092",
    fileHash: "sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    status: "active"
  },
  {
    id: "doc_msa_004",
    title: "Master Services Agreement - Enterprise Tier",
    filename: "MSA_Enterprise_Template_2026.docx",
    category: "Legal",
    classification: "Confidential",
    size: "820 KB",
    uploadedAt: "2026-10-16T16:05:00Z",
    ownerId: "usr_owner_02",
    ownerName: "Marcus Vance",
    description: "Standard legal terms, SLA schedules, indemnification frameworks, and data protection addendum.",
    passcode: "TV-MSA-7730",
    fileHash: "sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    status: "active"
  },
  {
    id: "doc_arc_005",
    title: "Multi-Region Zero Trust Architecture Blueprint",
    filename: "Zero_Trust_Architecture_v2.1.pdf",
    category: "Architecture",
    classification: "Restricted",
    size: "6.1 MB",
    uploadedAt: "2026-10-20T13:30:00Z",
    ownerId: "usr_owner_02",
    ownerName: "Marcus Vance",
    description: "Zero-trust network ingress architecture, mTLS mesh topology, and hardware security module orchestration.",
    passcode: "TV-ZTA-5589",
    fileHash: "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    status: "active"
  }
];

export const INITIAL_SHARES = [
  {
    id: "shr_001",
    documentId: "doc_acq_001",
    documentTitle: "Q3 2026 Strategic Acquisition Audit",
    grantedBy: "usr_owner_01",
    grantorName: "Elena Rostova",
    recipientId: "usr_viewer_01",
    recipientEmail: "charlotte.lin@partnerfirm.com",
    recipientName: "Charlotte Lin",
    permission: "read_download",
    passcode: "TV-ACQ-9281",
    createdAt: "2026-10-15T10:00:00Z",
    status: "active"
  },
  {
    id: "shr_002",
    documentId: "doc_soc_002",
    documentTitle: "SOC2 Type II Compliance Attestation",
    grantedBy: "usr_owner_01",
    grantorName: "Elena Rostova",
    recipientId: "usr_viewer_01",
    recipientEmail: "charlotte.lin@partnerfirm.com",
    recipientName: "Charlotte Lin",
    permission: "read_download",
    passcode: "TV-SOC-4412",
    createdAt: "2026-10-16T14:30:00Z",
    status: "active"
  },
  {
    id: "shr_003",
    documentId: "doc_msa_004",
    documentTitle: "Master Services Agreement - Enterprise Tier",
    grantedBy: "usr_owner_02",
    grantorName: "Marcus Vance",
    recipientId: "usr_viewer_01",
    recipientEmail: "charlotte.lin@partnerfirm.com",
    recipientName: "Charlotte Lin",
    permission: "read_download",
    passcode: "TV-MSA-7730",
    createdAt: "2026-10-17T09:15:00Z",
    status: "active"
  },
  {
    id: "shr_004",
    documentId: "doc_pen_003",
    documentTitle: "Penetration Testing Summary Report v4",
    grantedBy: "usr_owner_01",
    grantorName: "Elena Rostova",
    recipientId: "usr_viewer_02",
    recipientEmail: "liam.neil@auditconsulting.org",
    recipientName: "Liam Neil",
    permission: "read_download",
    passcode: "TV-PEN-1092",
    createdAt: "2026-10-21T11:00:00Z",
    status: "active"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud_001",
    actor: "Elena Rostova (Owner)",
    actorId: "usr_owner_01",
    action: "DOCUMENT_UPLOAD",
    target: "Penetration Testing Summary Report v4",
    timestamp: "2026-10-19T11:40:00Z",
    result: "SUCCESS",
    severity: "INFO",
    ipAddress: "198.51.100.44",
    details: "Encrypted payload ingested (1.9 MB). SHA-256 integrity hash registered."
  },
  {
    id: "aud_002",
    actor: "Elena Rostova (Owner)",
    actorId: "usr_owner_01",
    action: "PERMISSION_GRANT",
    target: "doc_pen_003 -> liam.neil@auditconsulting.org",
    timestamp: "2026-10-21T11:00:00Z",
    result: "SUCCESS",
    severity: "INFO",
    ipAddress: "198.51.100.44",
    details: "Permission level 'read_download' assigned with unique simulated passcode."
  },
  {
    id: "aud_003",
    actor: "David Kim (Unverified)",
    actorId: "usr_owner_03",
    action: "OWNER_REGISTRATION",
    target: "Account Status: Pending Approval",
    timestamp: "2026-10-24T08:00:00Z",
    result: "PENDING",
    severity: "WARNING",
    ipAddress: "203.0.113.89",
    details: "New owner registered from Synthetix AI Labs. Quarantined until Admin review."
  },
  {
    id: "aud_004",
    actor: "Charlotte Lin (Viewer)",
    actorId: "usr_viewer_01",
    action: "DOWNLOAD_REQUEST",
    target: "Q3 2026 Strategic Acquisition Audit",
    timestamp: "2026-10-24T17:12:00Z",
    result: "SUCCESS",
    severity: "INFO",
    ipAddress: "192.0.2.112",
    details: "Passcode TV-ACQ-9281 verified. 5-minute temporary download token issued."
  },
  {
    id: "aud_005",
    actor: "Unknown Session",
    actorId: "unknown",
    action: "ACCESS_DENIED",
    target: "doc_arc_005 (Multi-Region Zero Trust)",
    timestamp: "2026-10-24T17:45:00Z",
    result: "BLOCKED",
    severity: "ALERT",
    ipAddress: "185.220.101.5",
    details: "Unauthorized viewer attempted direct URI resolution without active share grant."
  },
  {
    id: "aud_006",
    actor: "Sarah Connor (Admin)",
    actorId: "usr_admin_01",
    action: "SECURITY_SCAN",
    target: "Global Access ACLs",
    timestamp: "2026-10-24T18:00:00Z",
    result: "SUCCESS",
    severity: "INFO",
    ipAddress: "10.0.4.15",
    details: "Automated compliance health check passed. 4 active shares validated."
  }
];

export const INITIAL_SECURITY_STATS = {
  failedAccessAttempts: 14,
  permissionChanges24h: 3,
  activeSessions: 5,
  complianceScore: "98.4%",
  threatStatus: "Low (Demo Mode)",
  recentThreatEvents: [
    {
      id: "thr_001",
      title: "Repeated invalid passcode attempts",
      source: "203.0.113.19",
      target: "doc_acq_001",
      timestamp: "2026-10-24T15:20:00Z",
      status: "Blocked by rate-limiter simulation",
      level: "medium"
    },
    {
      id: "thr_002",
      title: "Out-of-policy permission grant attempt",
      source: "Marcus Vance (usr_owner_02)",
      target: "Admin console",
      timestamp: "2026-10-23T11:05:00Z",
      status: "Denied by role guard",
      level: "low"
    }
  ],
  securityRecommendations: [
    {
      id: "rec_001",
      title: "Enforce Hardware Key MFA for Admins",
      priority: "High",
      description: "Require FIDO2 / WebAuthn security keys for all tenant administrators in the upcoming backend release."
    },
    {
      id: "rec_002",
      title: "Audit Expired Document Shares",
      priority: "Medium",
      description: "Review shares older than 30 days to enforce principle of least privilege."
    },
    {
      id: "rec_003",
      title: "Automate Quarantine on Multiple Denials",
      priority: "Low",
      description: "Temporarily lock viewer sessions after 5 consecutive incorrect passcodes."
    }
  ]
};
