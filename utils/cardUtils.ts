export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // For Blackjack: 2–10, 10 for face, 11 for Ace (adjusted later)
}

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Rank order for poker (index = numeric strength)
export const RANK_ORDER: Record<Rank, number> = {
  '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6,
  '9': 7, '10': 8, 'J': 9, 'Q': 10, 'K': 11, 'A': 12
};

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      let value = parseInt(rank);
      if (isNaN(value)) {
        value = rank === 'A' ? 11 : 10; // J, Q, K = 10, A = 11
      }
      deck.push({ suit, rank, value });
    }
  }
  return shuffle(deck);
};

export const createDurakDeck = (): Card[] => {
  const durakRanks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of durakRanks) {
      deck.push({ suit, rank, value: 0 }); // value unused in Durak
    }
  }
  return shuffle(deck);
};

export const getDurakRankValue = (rank: Rank): number => {
  const order: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const index = order.indexOf(rank);
  return index >= 0 ? index : 0;
};

export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getBlackjackScore = (hand: Card[]): number => {
  let score = 0;
  let aces = 0;
  
  for (const card of hand) {
    score += card.value;
    if (card.rank === 'A') aces++;
  }
  
  // Adjust aces to prevent bust
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  
  return score;
};

// Poker hand evaluator (assumes exactly 5 cards)
export const evaluatePokerHand = (hand: Card[]): { rank: number; name: string; highCard?: Rank } => {
  if (hand.length !== 5) {
    throw new Error('Poker hand must contain exactly 5 cards');
  }

  const ranks = hand.map(c => c.rank);
  const suits = hand.map(c => c.suit);
  const rankCounts: Record<Rank, number> = {} as Record<Rank, number>;

  // Count rank frequencies
  for (const rank of ranks) {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  }

  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  
  // Check flush
  const isFlush = suits.every(s => s === suits[0]);
  
  // Get numeric ranks for straight detection
  const numericRanks = ranks.map(r => RANK_ORDER[r]).sort((a, b) => a - b);
  const uniqueNumericRanks = [...new Set(numericRanks)];

  // Check straight (handle wheel straight A-2-3-4-5)
  let isStraight = false;
  let highCardRank: Rank | null = null;
  
  if (uniqueNumericRanks.length === 5) {
    // Normal straight
    isStraight = numericRanks.every((val, i) => i === 0 || val === numericRanks[i - 1] + 1);
    highCardRank = ranks[numericRanks.indexOf(Math.max(...numericRanks))] as Rank;
    
    // Wheel straight (A,2,3,4,5)
    if (!isStraight && numericRanks[0] === 0 && numericRanks.slice(1, 4).every((val, i) => val === i + 1) && numericRanks[4] === 12) {
      isStraight = true;
      highCardRank = '5';
    }
  }

  // Hand rankings (9 = highest, 0 = lowest)
  if (isFlush && isStraight) {
    return numericRanks.includes(12) 
      ? { rank: 9, name: 'Royal Flush' }
      : { rank: 8, name: 'Straight Flush', highCard: highCardRank! };
  }
  
  if (counts[0] === 4) {
    const quadRank = Object.keys(rankCounts).find(r => rankCounts[r as Rank] === 4)! as Rank;
    return { rank: 7, name: 'Four of a Kind', highCard: quadRank };
  }
  
  if (counts[0] === 3 && counts[1] === 2) {
    const tripsRank = Object.keys(rankCounts).find(r => rankCounts[r as Rank] === 3)! as Rank;
    return { rank: 6, name: 'Full House', highCard: tripsRank };
  }
  
  if (isFlush) {
    return { rank: 5, name: 'Flush', highCard: ranks[numericRanks.indexOf(Math.max(...numericRanks))] as Rank };
  }
  
  if (isStraight) {
    return { rank: 4, name: 'Straight', highCard: highCardRank! };
  }
  
  if (counts[0] === 3) {
    const tripsRank = Object.keys(rankCounts).find(r => rankCounts[r as Rank] === 3)! as Rank;
    return { rank: 3, name: 'Three of a Kind', highCard: tripsRank };
  }
  
  if (counts[0] === 2 && counts[1] === 2) {
    const pair1 = Object.keys(rankCounts).find(r => rankCounts[r as Rank] === 2)! as Rank;
    const pair2 = Object.keys(rankCounts).filter(r => rankCounts[r as Rank] === 2)[1] as Rank;
    return { rank: 2, name: 'Two Pair', highCard: pair1 };
  }
  
  if (counts[0] === 2) {
    const pairRank = Object.keys(rankCounts).find(r => rankCounts[r as Rank] === 2)! as Rank;
    const isJacksOrBetter = ['J', 'Q', 'K', 'A'].includes(pairRank);
    return { rank: 1, name: isJacksOrBetter ? 'Jacks or Better' : 'Pair', highCard: pairRank };
  }

  // High card
  const highCard = ranks[numericRanks.indexOf(Math.max(...numericRanks))] as Rank;
  return { rank: 0, name: 'High Card', highCard };
};

// Additional utility functions
export const dealCards = (deck: Card[], count: number): { cards: Card[]; remaining: Card[] } => {
  if (deck.length < count) {
    throw new Error('Not enough cards in deck');
  }
  return {
    cards: deck.slice(0, count),
    remaining: deck.slice(count)
  };
};

export const isBlackjack = (hand: Card[]): boolean => {
  return hand.length === 2 && getBlackjackScore(hand) === 21;
};
