import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'eddy-customer-avatar';
const AVATAR_CHANGE_EVENT = 'eddy-avatar-change';
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB localStorage-safe cap

const readStoredPhoto = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/** Local-only customer avatar stored as a data URL in localStorage. */
export const useProfilePhoto = () => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => readStoredPhoto());

  useEffect(() => {
    const sync = () => setPhotoUrl(readStoredPhoto());
    window.addEventListener('storage', sync);
    window.addEventListener(AVATAR_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(AVATAR_CHANGE_EVENT, sync);
    };
  }, []);

  const persist = useCallback((value: string | null) => {
    try {
      if (value) window.localStorage.setItem(STORAGE_KEY, value);
      else window.localStorage.removeItem(STORAGE_KEY);
      setPhotoUrl(value);
      window.dispatchEvent(new Event(AVATAR_CHANGE_EVENT));
      return true;
    } catch {
      return false;
    }
  }, []);

  const uploadPhoto = useCallback(
    (file: File): Promise<{ ok: boolean; error?: string }> =>
      new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
          resolve({ ok: false, error: 'Please choose an image file (PNG, JPG, WEBP).' });
          return;
        }
        if (file.size > MAX_AVATAR_BYTES) {
          resolve({ ok: false, error: 'Image is too large. Please choose one under 2 MB.' });
          return;
        }
        const reader = new FileReader();
        reader.onerror = () => resolve({ ok: false, error: 'Could not read that image. Try another file.' });
        reader.onload = () => {
          const dataUrl = typeof reader.result === 'string' ? reader.result : null;
          if (!dataUrl) {
            resolve({ ok: false, error: 'Could not read that image. Try another file.' });
            return;
          }
          const saved = persist(dataUrl);
          resolve(saved ? { ok: true } : { ok: false, error: 'Browser storage is full. Try a smaller image.' });
        };
        reader.readAsDataURL(file);
      }),
    [persist]
  );

  const removePhoto = useCallback(() => persist(null), [persist]);

  return { photoUrl, uploadPhoto, removePhoto };
};
