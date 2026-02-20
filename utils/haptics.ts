
import { tg } from './telegram';

export const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred(style);
  }
};

export const hapticNotification = (type: 'success' | 'warning' | 'error') => {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred(type);
  }
};

export const hapticSelection = () => {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.selectionChanged();
  }
};
