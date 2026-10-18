import { describe, expect, it } from 'vitest';
import { getQrTokenFromQr } from './shopQr';

describe('getQrTokenFromQr', () => {
  const appOrigin = 'https://eddy.example';
  const token = 'r4nd0m-t0ken-that-is-long-enough-to-be-unforgeable';

  it('extracts the opaque QR token from the owner standee URL', () => {
    expect(
      getQrTokenFromQr(`${appOrigin}/customer/scan?qrToken=${token}`, appOrigin),
    ).toBe(token);
  });

  it('rejects QR URLs from a different origin', () => {
    expect(
      getQrTokenFromQr(`https://other.example/customer/scan?qrToken=${token}`, appOrigin),
    ).toBeNull();
  });

  it('rejects missing, duplicated, or malformed tokens and non-scanner URLs', () => {
    expect(getQrTokenFromQr(`${appOrigin}/customer/home?qrToken=${token}`, appOrigin)).toBeNull();
    expect(getQrTokenFromQr(`${appOrigin}/customer/scan`, appOrigin)).toBeNull();
    expect(
      getQrTokenFromQr(`${appOrigin}/customer/scan?qrToken=${token}&qrToken=${token}`, appOrigin),
    ).toBeNull();
    expect(getQrTokenFromQr(`${appOrigin}/customer/scan?qrToken=short`, appOrigin)).toBeNull();
    expect(getQrTokenFromQr('not a URL', appOrigin)).toBeNull();
  });
});
