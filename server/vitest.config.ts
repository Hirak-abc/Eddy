import { defineConfig } from 'vitest/config';

// `src/integrations/convex` throws at import time when CONVEX_URL is missing,
// which takes down every suite that imports the Express app (auth middleware ->
// convex integration) even when that suite never talks to Convex. Tests get a
// placeholder so collection succeeds; tests that actually exercise Convex must
// mock `src/integrations/convex` themselves.
export default defineConfig({
  test: {
    env: {
      CONVEX_URL: process.env.CONVEX_URL ?? 'https://placeholder.convex.cloud',
    },
  },
});
