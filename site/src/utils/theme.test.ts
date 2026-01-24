import {describe, it, expect, vi, beforeEach} from 'vitest';
import {getStoredTheme} from './theme';

describe('theme utilities', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  describe('getStoredTheme', () => {
    it('returns null when no theme stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(getStoredTheme()).toBeNull();
    });

    it('returns "dark" when dark theme stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns "light" when light theme stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light');
      expect(getStoredTheme()).toBe('light');
    });

    it('returns null for invalid stored value', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid');
      expect(getStoredTheme()).toBeNull();
    });
  });
});
