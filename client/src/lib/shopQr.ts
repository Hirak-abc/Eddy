export const getQrTokenFromQr = (value: string, appOrigin: string): string | null => {
  try {
    const url = new URL(value);
    if (url.origin !== appOrigin || url.pathname !== '/customer/scan') {
      return null;
    }

    const tokens = url.searchParams.getAll('qrToken');
    const token = tokens.length === 1 ? tokens[0] : null;
    return token && /^[A-Za-z0-9_-]{32,}$/.test(token) ? token : null;
  } catch {
    return null;
  }
};
