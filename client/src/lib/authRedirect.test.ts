import { describe, expect, it } from 'vitest';
import { resolveAuthFlowRole } from './authRedirect';

describe('resolveAuthFlowRole', () => {
  it('prefers the explicitly requested role to stale session data', () => {
    expect(resolveAuthFlowRole('OWNER', 'CUSTOMER', true)).toBe('OWNER');
    expect(resolveAuthFlowRole('CUSTOMER', 'OWNER', true)).toBe('CUSTOMER');
  });

  it('uses a saved role only during a Clerk continuation', () => {
    expect(resolveAuthFlowRole(null, 'CUSTOMER', true)).toBe('CUSTOMER');
    expect(resolveAuthFlowRole(null, 'CUSTOMER', false)).toBe('OWNER');
  });

  it('defaults invalid or missing role values to owner', () => {
    expect(resolveAuthFlowRole('ADMIN', 'ADMIN', true)).toBe('OWNER');
  });
});
