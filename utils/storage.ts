import { Language } from '../types';
import { INITIAL_BALANCE } from '../constants';

const STORAGE_KEY_BALANCE = 'royal_casino_balance';
const STORAGE_KEY_LANG = 'royal_casino_language';
const STORAGE_KEY_FIRST_TIME = 'royal_casino_visited';

export const saveBalance = (balance: number) => {
  try {
    localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
  } catch (e) {
    console.warn('Storage failed', e);
  }
};

export const loadBalance = (): number => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
    return saved ? parseInt(saved, 10) : INITIAL_BALANCE;
  } catch (e) {
    return INITIAL_BALANCE;
  }
};

export const saveLanguage = (lang: Language) => {
  localStorage.setItem(STORAGE_KEY_LANG, lang);
};

export const loadLanguage = (): Language => {
  const saved = localStorage.getItem(STORAGE_KEY_LANG);
  return (saved === 'RU' || saved === 'EN') ? saved : 'EN';
};

export const isFirstTime = (): boolean => {
    return !localStorage.getItem(STORAGE_KEY_FIRST_TIME);
};

export const setVisited = () => {
    localStorage.setItem(STORAGE_KEY_FIRST_TIME, 'true');
};

export const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY_BALANCE);
    localStorage.removeItem(STORAGE_KEY_FIRST_TIME);
    window.location.reload();
};