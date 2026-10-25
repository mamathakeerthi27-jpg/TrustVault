import { INITIAL_AUDIT_LOGS, INITIAL_SECURITY_STATS } from '../data/mockData';

const AUDIT_STORAGE_KEY = 'trustvault_demo_audit_v1';
const SECURITY_STORAGE_KEY = 'trustvault_demo_security_v1';

function loadAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading demo audit logs', e);
  }
  return [...INITIAL_AUDIT_LOGS];
}

function saveAuditLogs(logs) {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving demo audit logs', e);
  }
}

export const mockAuditService = {
  // Global audit logs (Admin only)
  getAllLogs() {
    return loadAuditLogs();
  },

  // Owner specific audit events (Owner views ONLY their relevant events)
  getLogsForOwner(ownerId) {
    const logs = loadAuditLogs();
    return logs.filter(l => l.actorId === ownerId);
  },

  // Log an audit event.
  // CRITICAL SECURITY RULE: Never log raw passwords, passcodes, document contents, or auth tokens.
  logEvent({ actor, actorId, action, target, result = 'SUCCESS', severity = 'INFO', details = '' }) {
    const logs = loadAuditLogs();
    const newEntry = {
      id: `aud_${Date.now().toString(36)}`,
      actor: actor || 'System Service',
      actorId: actorId || 'system',
      action: action,
      target: target || 'Resource',
      timestamp: new Date().toISOString(),
      result: result,
      severity: severity,
      ipAddress: '192.0.2.' + Math.floor(10 + Math.random() * 200),
      details: details
    };

    logs.unshift(newEntry);
    saveAuditLogs(logs);
    return newEntry;
  },

  getSecurityStats() {
    try {
      const raw = localStorage.getItem(SECURITY_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading security stats', e);
    }
    return INITIAL_SECURITY_STATS;
  }
};
