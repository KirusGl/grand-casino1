
export enum GameState {
  START = 'START',
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  LEADERBOARD = 'LEADERBOARD',
  SETTINGS = 'SETTINGS',
  VAULT = 'VAULT',
  LEDGER = 'LEDGER',
  CONCIERGE = 'CONCIERGE',
  WHEEL = 'WHEEL'
}

export enum GameType {
  ROULETTE = 'ROULETTE',
  BLACKJACK = 'BLACKJACK',
  POKER = 'POKER',
  DICE = 'DICE',
  SLOTS = 'SLOTS',
  ROCKET = 'ROCKET',
  MINES = 'MINES',
  DURAK = 'DURAK',
  BILLIARDS = 'BILLIARDS',
  VIDEO_POKER = 'VIDEO_POKER',
  KENO = 'KENO'
}

export enum VIPRank {
  GUEST = 'GUEST',
  BARON = 'BARON',
  VISCOUNT = 'VISCOUNT',
  EARL = 'EARL',
  DUKE = 'DUKE',
  SOVEREIGN = 'SOVEREIGN'
}

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  owned: boolean;
  type: 'ASSET' | 'ESTATE' | 'MEDAL';
}

export interface LedgerEntry {
  id: string;
  game: string;
  amount: number;
  result: 'WIN' | 'LOSS';
  timestamp: number;
}

export type Language = 'EN' | 'RU';

export type BetType = 'RED' | 'BLACK' | 'GREEN' | null;

export interface Bet {
  type: BetType;
  amount: number;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  initDataUnsafe?: {
    user?: {
      first_name: string;
      last_name?: string;
      username?: string;
      id?: number;
    }
  }
}
