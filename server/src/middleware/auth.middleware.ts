import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import type { UserRole } from '../types';
import { ERROR_CODES } from '../config/constants';
import { config } from '../config/env';
import { createAuthenticatedConvexClient } from '../integrations/convex/client';
import { makeFunctionReference } from 'convex/server';

const getUserByClerkId = makeFunctionReference<
  'query',
  { clerkId: string },
  { role: UserRole; status?: string | null } | null
>('users:getUserByClerkId');

const redactDiagnosticMessage = (message: string) =>
  message
    .replace(/\bBearer\s+[^\s"',}]+/gi, 'Bearer [REDACTED]')
    .replace(/\b(?:sk|pk)_(?:test|live)_[A-Za-z0-9_-]+/g, '[REDACTED]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[REDACTED]')
    .replace(
      /([?&](?:token|secret|password|authorization|api[_-]?key)=)[^&\s]+/gi,
      '$1[REDACTED]',
    )
    .slice(0, 500);

const logAuthenticationFailure = (
  req: Request,
  res: Response,
  dependency: 'clerk_token_verification' | 'convex_role_lookup',
  error: unknown,
) => {
  const suppliedRequestId = req.get('x-request-id');
  const requestId =
    suppliedRequestId && /^[A-Za-z0-9._:-]{1,128}$/.test(suppliedRequestId)
      ? suppliedRequestId
      : randomUUID();
  const errorClass = error instanceof Error ? error.constructor.name : typeof error;
  const errorMessage =
    error instanceof Error ? redactDiagnosticMessage(error.message) : 'Non-Error exception';

  res.setHeader('x-request-id', requestId);
  console.error(JSON.stringify({
    event: 'authentication_dependency_failure',
    dependency,
    requestId,
    errorClass,
    errorMessage,
  }));
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : undefined;

  if (!token || !config.CLERK_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Authentication required' },
    });
  }

  let userId: string;
  try {
    userId = (await verifyToken(token, { secretKey: config.CLERK_SECRET_KEY })).sub;
  } catch (error) {
    logAuthenticationFailure(req, res, 'clerk_token_verification', error);
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Invalid authentication token' },
    });
  }

  try {
    const profile = await createAuthenticatedConvexClient(token).query(getUserByClerkId, {
      clerkId: userId,
    });
    const isInactive =
      profile?.status === 'SUSPENDED' ||
      profile?.status === 'DELETED' ||
      profile?.status === 'INACTIVE';
    req.user = {
      id: userId,
      role: isInactive ? undefined : profile?.role,
    };
    req.authToken = token;
    next();
  } catch (error) {
    logAuthenticationFailure(req, res, 'convex_role_lookup', error);
    return res.status(503).json({
      success: false,
      data: null,
      error: {
        code: ERROR_CODES.EXTERNAL_API_ERROR,
        message: 'Authentication services are temporarily unavailable.',
      },
    });
  }
};

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: ERROR_CODES.FORBIDDEN, message: 'Forbidden' },
      });
    }
    next();
  };
};
