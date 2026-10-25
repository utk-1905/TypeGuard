/**
 * TypeGuard - Local Storage Utilities
 * Handles persistence for code draft, theme preference, and editor state
 */

const STORAGE_KEYS = {
  CODE_DRAFT: 'typeguard_code_draft',
  THEME: 'typeguard_theme',
  RECENT_EXAMPLES: 'typeguard_recent_examples'
};

export function getStoredCode(defaultCode) {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CODE_DRAFT);
    return saved !== null ? saved : defaultCode;
  } catch (err) {
    return defaultCode;
  }
}

export function saveStoredCode(code) {
  try {
    localStorage.setItem(STORAGE_KEYS.CODE_DRAFT, code);
  } catch (err) {
    // Ignore storage quota errors
  }
}

export function getStoredTheme(defaultTheme = 'dark') {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'light' || saved === 'dark' ? saved : defaultTheme;
  } catch (err) {
    return defaultTheme;
  }
}

export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (err) {
    // Ignore storage quota errors
  }
}

export function clearStoredCode() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CODE_DRAFT);
  } catch (err) {
    // Ignore storage quota errors
  }
}
