# TrustVault — Security Boundaries & Backend Requirements

> **Document Version:** 1.0.0-PROTOTYPE  
> **Target Audience:** Engineering Leads, Security Architects, Interview Evaluators  
> **Status:** Frontend Prototype (Mock Services Phase)

---

## 1. Prototype Limitations & Boundaries (Current Phase)

This initial release of **TrustVault** is a frontend demonstration application built with React, Vite, and client-side state management. It models enterprise workflows, UI state progression, and role-segregated boundaries.

### Critical Limitations to Acknowledge:

1. **Simulated Cryptography & Mock Passcodes:**
   - In this frontend phase, document passcodes (e.g., `TV-ACQ-9281`) and checksums (e.g., `sha256:7f83...`) are **simulated strings** used to demonstrate user interaction workflows.
   - Files are stored in browser memory/mock storage. No actual cryptographic ciphertext or key material is handled in the browser.
   - Mock passcodes do **not** provide true confidentiality or mathematical protection.

2. **Client-Side Role Authorization Guardrails:**
   - Role boundaries (`admin`, `owner`, `viewer`) and account statuses (`pending`, `active`, `suspended`, `rejected`) are currently enforced via React Router guards (`RequireAuth`) and client-side session state.
   - **Never trust client-side role state as real security.** Any user with browser developer tools could manipulate localStorage or in-memory variables.
   - True security must be established through cryptographically signed server session tokens (e.g., secure HTTP-only cookies, JWTs with Ed25519 or RS256 signatures).

3. **Temporary Download 5-Minute Expiry Boundary:**
   - The five-minute countdown timer implemented in the viewer portal governs the **temporary portal authorization entry**.
   - **Crucial Physical Reality:** A web browser cannot remotely delete, erase, or alter a file once it has been saved to a user's operating system file system (hard drive, solid-state drive, or mobile device storage).
   - Once the five minutes expire in TrustVault, the application's temporary token is invalidated, requiring fresh authorization to retrieve or re-verify the document from the vault.

4. **Sanitized, Non-Leaking Audit Logging:**
   - All client-side audit events adhere to zero-knowledge logging standards:
     - Actor identity and IP addresses are recorded.
     - Event outcomes (`SUCCESS`, `BLOCKED`, `PENDING`) are captured.
     - **Passwords, passcodes, authorization tokens, and raw document payloads are never logged or stored in audit records.**

---

## 2. Requirements for the Future Node.js + Express Backend

In the upcoming backend integration phase, all mock services must be replaced with robust server-side architecture adhering to enterprise zero-trust standards:

### A. Real Server-Side Encryption (Envelope Encryption)
- **Data at Rest:**
  - Files must be encrypted before writing to persistent storage (e.g., AWS S3, Google Cloud Storage, or private Ceph clusters).
  - Use established cryptographic libraries (Node.js native `crypto`, `libsodium`, or AWS Encryption SDK).
  - Adopt **AES-256-GCM** or **ChaCha20-Poly1305** for authenticated encryption with associated data (AEAD).
- **Key Management Service (KMS):**
  - Master keys (KEK - Key Encrypting Keys) must be stored in a dedicated Hardware Security Module (HSM) such as AWS KMS, HashiCorp Vault, or Google Cloud KMS.
  - Generate a unique Data Encryption Key (DEK) per document. Store the encrypted DEK alongside document metadata.

### B. Secure Passcode Verification & Rate Limiting
- Passcodes must be cryptographically hashed on the server using **Argon2id** or **bcrypt** with appropriate cost factors before persistent storage.
- Implement strict distributed rate-limiting (e.g., Redis Token Bucket / Leaky Bucket) against download endpoints to prevent brute-force passcode guessing (e.g., max 5 attempts per IP/session per 15 minutes).
- Trigger automatic administrative audit alerts on consecutive failed passcode attempts.

### C. Time-Bounded Pre-Signed Delivery & Token Invalidation
- File downloads must not expose direct server endpoints or static file paths.
- Generate short-lived **Pre-Signed URLs** (valid for 60 to 300 seconds) only after successful multi-factor or passcode verification.
- Enforce one-time token use: once the payload stream initiates, the token is consumed and marked invalid.

### D. Server-Side Role Enforcement & Tenant Isolation
- **Authentication:**
  - Secure session management utilizing HTTP-only, `SameSite=Strict`, `Secure` cookies containing signed session identifiers.
- **Authorization Middleware:**
  - Every API endpoint must validate the authenticated user's tenant ID, role, and document permissions.
  - An owner cannot query, mutate, or share another tenant's documents (`WHERE document.owner_id = req.user.id`).
  - Viewers can only request download tokens for documents where an active record exists in `document_shares` matching `share.recipient_id = req.user.id` and `share.status = 'active'`.

### E. Immutable Audit Trail Persistence
- Audit records must be written to an append-only database or centralized SIEM (e.g., Elasticsearch, AWS CloudWatch, Datadog).
- Audit tables must have database-level constraints prohibiting `UPDATE` and `DELETE` operations.
- Cryptographic hash chaining (Merkle tree or sequential block hashing) can be integrated to guarantee audit log tamper-evidence.

---

## 3. Summary of API Contracts for Backend Migration

| Feature | Frontend Service | Express Endpoint (Future) | Method | Backend Security Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **User Sign In** | `mockAuthService.login` | `/api/v1/auth/login` | `POST` | Argon2 password verify, rate limit, issue secure cookie |
| **Owner Signup** | `mockAuthService.signup` | `/api/v1/auth/register-owner` | `POST` | Quarantine with `status='pending'`, notify admin |
| **Viewer Signup** | `mockAuthService.signup` | `/api/v1/auth/register-viewer` | `POST` | Verify corporate email domain, activate viewer |
| **Owner Approval** | `mockAuthService.updateUserStatus` | `/api/v1/admin/owners/:id/approve` | `PATCH` | Admin role guard, log `OWNER_APPROVAL` audit event |
| **Upload File** | `mockDocumentService.uploadDocument` | `/api/v1/documents/upload` | `POST` | Multipart stream, virus scan, KMS DEK, S3 encrypt |
| **Grant Access** | `mockDocumentService.grantShare` | `/api/v1/shares/grant` | `POST` | Verify document ownership, generate hashed passcode |
| **Revoke Access**| `mockDocumentService.revokeShare` | `/api/v1/shares/:id/revoke` | `DELETE`| Verify ownership, invalidate active access tokens |
| **Verify Passcode**| `mockDocumentService.verifyPasscode` | `/api/v1/documents/:id/authorize`| `POST` | Rate-limit (5 req/15m), verify hash, issue pre-signed URL |
