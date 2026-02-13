
import { Language } from '../types';

export const TEXTS = {
  EN: {
    start: {
      title: "The Residency",
      est: "Est. 1924",
      invitation: "Private Invitation",
      honoredGuest: "Honored Guest",
      accessCode: "Access Code Required",
      enter: "ENTER SALON",
      patience: "Patience is the currency of kings."
    },
    lobby: {
      member: "Member",
      estateValue: "Estate Value",
      jackpot: "Grand Jackpot",
      spin: "SPIN",
      butler: "Butler",
      vault: "Vault",
      ledger: "Ledger",
      salon: "Salon",
      forbes: "Forbes",
      cabinet: "Cabinet",
      vipAccess: "VIP Only",
      classic: "The Classics",
      other: "Grand Salon Collection",
      news: "Global markets open with gains. Luxury assets hit new records."
    },
    games: {
      roulette: { name: "Roulette", desc: "European Wheel" },
      rocket: { name: "Rocket", desc: "Crash Multiplier" },
      mines: { name: "Mines", desc: "Strategic Mines" },
      durak: { name: "Durak", desc: "Russian Classic" },
      blackjack: { name: "21", desc: "Standard 3:2" },
      poker: { name: "Poker", desc: "Hold'em Style" },
      slots: { name: "Slots", desc: "Classic 3-Reel" },
      dice: { name: "Dice", desc: "Wagered Bones" },
      billiards: { name: "Billiards", desc: "Private Table" },
      video_poker: { name: "Video Poker", desc: "Jacks or Better" },
      keno: { name: "Keno", desc: "Royal Draw" }
    },
    gameUI: {
      totalBet: "Total Bet",
      clear: "CLEAR",
      deal: "DEAL",
      hit: "HIT",
      stand: "STAND",
      fold: "FOLD",
      call: "CALL",
      draw: "DRAW",
      launch: "LAUNCH",
      cashOut: "CASH OUT",
      searching: "Finding match...",
      yourTurn: "Your Turn",
      waiting: "Waiting..."
    },
    leaderboard: {
      title: "Forbes Rich List",
      subtitle: "Global Elite Ranking",
      rank: "#",
      player: "Member",
      wealth: "Net Worth",
      you: "YOU",
      updated: "Real-Time Tracking"
    },
    settings: {
      title: "Private Office",
      cabinet: "Account",
      verified: "Verified VIP",
      language: "Language",
      privacy: "Privacy Mode",
      sound: "Sound",
      on: "ON",
      off: "OFF",
      danger: "Danger Zone",
      reset: "Reset Account",
      resetConfirm: "Warning: This will wipe all progress. Proceed?",
      version: "The Residency v4.0 • Secure Protocol"
    },
    concierge: {
      title: "Royal Butler",
      desc: "Concierge AI",
      welcome: "Welcome back, My Lord. How may I assist you today?",
      thinking: "Thinking...",
      error: "Service unavailable. Please wait.",
      ask: "Ask the Butler..."
    },
    vault: {
      title: "The Vault",
      desc: "Distinguished Assets",
      buy: "Buy"
    },
    result: {
      magnificent: "Victory!",
      accrued: "Estate Growth",
      concluded: "Session End",
      wealthFlows: "Fortune favors the bold",
      patience: "Wealth is born of patience",
      currentValue: "Total Value",
      netResult: "Net Result",
      performance: "Gain",
      reenter: "CONTINUE"
    }
  },
  RU: {
    start: {
      title: "Резиденция",
      est: "Осн. 1924",
      invitation: "Личный Допуск",
      honoredGuest: "Почетный Гость",
      accessCode: "Требуется Доступ",
      enter: "ВОЙТИ В САЛОН",
      patience: "Терпение — валюта королей."
    },
    lobby: {
      member: "Участник",
      estateValue: "Состояние",
      jackpot: "Гранд Джекпот",
      spin: "КРУТИТЬ",
      butler: "Дворецкий",
      vault: "Хранилище",
      ledger: "Реестр",
      salon: "Салон",
      forbes: "Forbes",
      cabinet: "Кабинет",
      vipAccess: "VIP Допуск",
      classic: "Классика",
      other: "Другое",
      news: "Мировые рынки растут. Стоимость люксовых активов на пике."
    },
    games: {
      roulette: { name: "Рулетка", desc: "Европейская" },
      rocket: { name: "Ракета", desc: "Множитель" },
      mines: { name: "Мины", desc: "Стратегия" },
      durak: { name: "Дурак", desc: "Имперский" },
      blackjack: { name: "21", desc: "Стандарт" },
      poker: { name: "Покер", desc: "Холдем" },
      slots: { name: "Слоты", desc: "3 Барабана" },
      dice: { name: "Кости", desc: "Dice" },
      billiards: { name: "Бильярд", desc: "Приватный Стол" },
      video_poker: { name: "Видео Покер", desc: "Валеты и выше" },
      keno: { name: "Кено", desc: "Королевский Тираж" }
    },
    gameUI: {
      totalBet: "Ставка",
      clear: "СБРОС",
      deal: "РАЗДАТЬ",
      hit: "ЕЩЕ",
      stand: "ХВАТИТ",
      fold: "ПАС",
      call: "ОТВЕТИТЬ",
      draw: "ОБМЕН",
      launch: "ПУСК",
      cashOut: "ЗАБРАТЬ",
      searching: "Поиск...",
      yourTurn: "Ваш Ход",
      waiting: "Ожидание..."
    },
    leaderboard: {
      title: "Forbes Rich List",
      subtitle: "Мировой Рейтинг",
      rank: "#",
      player: "Участник",
      wealth: "Состояние",
      you: "ВЫ",
      updated: "В реальном времени"
    },
    settings: {
      title: "Личный Кабинет",
      cabinet: "Аккаунт",
      verified: "VIP Верификация",
      language: "Язык",
      privacy: "Инкогнито",
      sound: "Звук",
      on: "ВКЛ",
      off: "ВЫКЛ",
      danger: "Опасная Зона",
      reset: "Сброс Прогресса",
      resetConfirm: "Внимание: Весь прогресс будет удален. Продолжить?",
      version: "The Residency v4.0 • Протокол Защищен"
    },
    concierge: {
      title: "Дворецкий",
      desc: "AI Консьерж",
      welcome: "С возвращением, Милорд. Чем могу помочь?",
      thinking: "Думаю...",
      error: "Сервис занят. Подождите.",
      ask: "Ваш вопрос..."
    },
    vault: {
      title: "Хранилище",
      desc: "Элитные Активы",
      buy: "Купить"
    },
    result: {
      magnificent: "Победа!",
      accrued: "Прирост Капитала",
      concluded: "Итоги Сессии",
      wealthFlows: "Удача любит смелых",
      patience: "Богатство рождается из терпения",
      currentValue: "Общая Стоимость",
      netResult: "Результат",
      performance: "Доход",
      reenter: "ПРОДОЛЖИТЬ"
    }
  }
};
