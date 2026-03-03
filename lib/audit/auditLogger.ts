/**
 * Audit Logger
 *
 * Tracks sensitive operations for security, compliance, and debugging.
 * Logs user actions, data modifications, and access control changes.
 */

import { prisma } from "@/lib/prisma";

/**
 * Audit event types
 */
export enum AuditEventType {
  // Authentication events
  AUTH_LOGIN = "AUTH_LOGIN",
  AUTH_LOGOUT = "AUTH_LOGOUT",
  AUTH_REGISTER = "AUTH_REGISTER",
  AUTH_LOGIN_FAILED = "AUTH_LOGIN_FAILED",
  AUTH_PASSWORD_CHANGE = "AUTH_PASSWORD_CHANGE",

  // Data modification events
  DATA_CREATE = "DATA_CREATE",
  DATA_UPDATE = "DATA_UPDATE",
  DATA_DELETE = "DATA_DELETE",

  // Access control events
  ACCESS_GRANTED = "ACCESS_GRANTED",
  ACCESS_DENIED = "ACCESS_DENIED",

  // Sensitive data access
  SENSITIVE_DATA_ACCESS = "SENSITIVE_DATA_ACCESS",
  SENSITIVE_DATA_EXPORT = "SENSITIVE_DATA_EXPORT",

  // System events
  SYSTEM_ERROR = "SYSTEM_ERROR",
  SYSTEM_CONFIG_CHANGE = "SYSTEM_CONFIG_CHANGE",
}

/**
 * Audit event severity levels
 */
export enum AuditSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  resourceType?: string;
  resourceId?: string;
  action?: string;
  details?: Record<string, any>;
  severity?: AuditSeverity;
  status: "SUCCESS" | "FAILURE";
  errorMessage?: string;
}

/**
 * Log an audit event to the database
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        eventType: entry.eventType,
        userId: entry.userId,
        userEmail: entry.userEmail,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        action: entry.action,
        details: entry.details as any,
        severity: entry.severity || AuditSeverity.INFO,
        status: entry.status,
        errorMessage: entry.errorMessage,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    // Don't throw - audit logging failures shouldn't break the app
    console.error("Failed to log audit event:", error);
  }
}

/**
 * Log authentication event
 */
export async function logAuthEvent(
  eventType: AuditEventType,
  userId: string | undefined,
  userEmail: string | undefined,
  ipAddress: string | undefined,
  userAgent: string | undefined,
  status: "SUCCESS" | "FAILURE",
  errorMessage?: string
): Promise<void> {
  await logAuditEvent({
    eventType,
    userId,
    userEmail,
    ipAddress,
    userAgent,
    severity: status === "FAILURE" ? AuditSeverity.WARNING : AuditSeverity.INFO,
    status,
    errorMessage,
  });
}

/**
 * Log data modification event
 */
export async function logDataModification(
  action: "CREATE" | "UPDATE" | "DELETE",
  userId: string,
  userEmail: string | undefined,
  resourceType: string,
  resourceId: string,
  details?: Record<string, any>,
  ipAddress?: string
): Promise<void> {
  const eventTypeMap = {
    CREATE: AuditEventType.DATA_CREATE,
    UPDATE: AuditEventType.DATA_UPDATE,
    DELETE: AuditEventType.DATA_DELETE,
  };

  await logAuditEvent({
    eventType: eventTypeMap[action],
    userId,
    userEmail,
    ipAddress,
    resourceType,
    resourceId,
    action,
    details,
    severity: action === "DELETE" ? AuditSeverity.WARNING : AuditSeverity.INFO,
    status: "SUCCESS",
  });
}

/**
 * Log access control event
 */
export async function logAccessControl(
  granted: boolean,
  userId: string | undefined,
  userEmail: string | undefined,
  resourceType: string,
  resourceId: string,
  ipAddress?: string,
  reason?: string
): Promise<void> {
  await logAuditEvent({
    eventType: granted ? AuditEventType.ACCESS_GRANTED : AuditEventType.ACCESS_DENIED,
    userId,
    userEmail,
    ipAddress,
    resourceType,
    resourceId,
    severity: granted ? AuditSeverity.INFO : AuditSeverity.WARNING,
    status: granted ? "SUCCESS" : "FAILURE",
    errorMessage: reason,
  });
}

/**
 * Log sensitive data access
 */
export async function logSensitiveDataAccess(
  userId: string,
  userEmail: string | undefined,
  resourceType: string,
  resourceId: string,
  action: string,
  ipAddress?: string
): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.SENSITIVE_DATA_ACCESS,
    userId,
    userEmail,
    ipAddress,
    resourceType,
    resourceId,
    action,
    severity: AuditSeverity.WARNING,
    status: "SUCCESS",
  });
}

/**
 * Query audit logs (for admin dashboard)
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  eventType?: AuditEventType;
  resourceType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (filters?.userId) where.userId = filters.userId;
  if (filters?.eventType) where.eventType = filters.eventType;
  if (filters?.resourceType) where.resourceType = filters.resourceType;
  if (filters?.startDate || filters?.endDate) {
    where.timestamp = {};
    if (filters.startDate) where.timestamp.gte = filters.startDate;
    if (filters.endDate) where.timestamp.lte = filters.endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

/**
 * Get audit log statistics
 */
export async function getAuditStats() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalEvents,
    dailyEvents,
    weeklyEvents,
    failedAuth,
    dataModifications,
    accessDenied,
  ] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.count({ where: { timestamp: { gte: oneDayAgo } } }),
    prisma.auditLog.count({ where: { timestamp: { gte: oneWeekAgo } } }),
    prisma.auditLog.count({
      where: {
        eventType: AuditEventType.AUTH_LOGIN_FAILED,
        timestamp: { gte: oneDayAgo },
      },
    }),
    prisma.auditLog.count({
      where: {
        eventType: {
          in: [
            AuditEventType.DATA_CREATE,
            AuditEventType.DATA_UPDATE,
            AuditEventType.DATA_DELETE,
          ],
        },
        timestamp: { gte: oneDayAgo },
      },
    }),
    prisma.auditLog.count({
      where: {
        eventType: AuditEventType.ACCESS_DENIED,
        timestamp: { gte: oneDayAgo },
      },
    }),
  ]);

  return {
    totalEvents,
    dailyEvents,
    weeklyEvents,
    failedAuth,
    dataModifications,
    accessDenied,
  };
}

/**
 * Extract IP address from request headers
 */
export function getIpFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    undefined
  );
}
