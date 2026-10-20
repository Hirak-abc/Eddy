import { afterEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';

vi.mock('../config/env', () => ({
  config: {
    NODE_ENV: 'production',
    META_GRAPH_API_VERSION: 'v26.0',
    META_IG_GRAPH_API_VERSION: 'v21.0',
  },
}));

import { metaGet } from '../integrations/meta/meta.client';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Meta Graph client network configuration', () => {
  it('uses IPv4 for Meta HTTPS requests', async () => {
    const get = vi.spyOn(axios, 'get').mockResolvedValue({
      data: { success: true },
    });

    await expect(metaGet('/me')).resolves.toEqual({ success: true });

    const requestConfig = get.mock.calls[0][1];
    expect(requestConfig?.httpsAgent?.options.family).toBe(4);
    expect(requestConfig?.timeout).toBeGreaterThan(0);
  });
});
