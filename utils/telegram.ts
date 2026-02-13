import { TelegramWebApp } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const tg = window.Telegram?.WebApp;

export const initTelegram = () => {
  if (tg) {
    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor('#050a08');
      tg.setBackgroundColor('#050a08');
    } catch (e) {
      // Ignore styling errors on non-supported versions
    }
  }
};

export const sendGameResult = (finalBalance: number, totalWon: number) => {
  if (tg) {
    const data = JSON.stringify({
      finalBalance,
      totalWon,
      timestamp: Date.now(),
    });
    tg.sendData(data);
  } else {
    console.log('Telegram WebApp not detected. Mock result:', { finalBalance, totalWon });
    alert('Session Concluded. Data sent (simulated).');
  }
};

export const getUserName = (): string => {
  return tg?.initDataUnsafe?.user?.first_name || "Guest";
};