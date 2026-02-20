import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameType, Language, VIPRank, LedgerEntry, InventoryItem } from './types';
import StartScreen from './components/StartScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import SettingsScreen from './components/SettingsScreen';
import ResultScreen from './components/ResultScreen';
import VaultScreen from './components/VaultScreen';
import LedgerScreen from './components/LedgerScreen';
import AIConciergeScreen from './components/AIConciergeScreen';
import WheelOfFortune from './components/WheelOfFortune';
import { initTelegram, getUserName } from './utils/telegram';
import { loadBalance, saveBalance, loadLanguage, saveLanguage, isFirstTime, setVisited } from './utils/storage';
import { hapticNotification } from './utils/haptics';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userName, setUserName] = useState<string>("Guest");
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.ROULETTE);
  const [balance, setBalance] = useState(0); 
  const [language, setLanguage] = useState<Language>('EN');
  const [sessionStartBalance, setSessionStartBalance] = useState(0);
  const [rank, setRank] = useState<VIPRank>(VIPRank.GUEST);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [jackpot, setJackpot] = useState(2500000);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Patek Philippe Nautilus', price: 150000, icon: '⌚', owned: false, type: 'ASSET' },
    { id: '2', name: 'Riva Aquarama Yacht', price: 850000, icon: '🛥️', owned: false, type: 'ASSET' },
    { id: '3', name: '1945 Romanée-Conti', price: 25000, icon: '🍷', owned: false, type: 'ASSET' },
    { id: '4', name: 'Lake Como Villa', price: 5000000, icon: '🏰', owned: false, type: 'ESTATE' },
    { id: '5', name: 'Grand Architect Medal', price: 0, icon: '🏅', owned: true, type: 'MEDAL' },
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    initTelegram();
    setUserName(getUserName());
    const initialBalance = loadBalance();
    setBalance(initialBalance);
    setLanguage(loadLanguage());
    if (!isFirstTime()) setGameState(GameState.LOBBY);

    // Progressive Jackpot Mock
    const jInterval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 500) + 100);
    }, 3000);

    // Dividends & Tax Logic
    const wealthInterval = setInterval(() => {
      setBalance(prev => {
        let delta = 0;
        delta += Math.max(10, Math.floor(prev * 0.001));
        if (prev > 1000000) delta -= Math.floor(prev * 0.0005);
        return prev + delta;
      });
    }, 60000);

    return () => {
      clearInterval(jInterval);
      clearInterval(wealthInterval);
    };
  }, []);

  useEffect(() => {
    if (balance > 1000000) setRank(VIPRank.SOVEREIGN);
    else if (balance > 500000) setRank(VIPRank.DUKE);
    else if (balance > 100000) setRank(VIPRank.EARL);
    else if (balance > 50000) setRank(VIPRank.VISCOUNT);
    else if (balance > 10000) setRank(VIPRank.BARON);
    else setRank(VIPRank.GUEST);
  }, [balance]);

  useEffect(() => { if (balance > 0) saveBalance(balance); }, [balance]);
  useEffect(() => { saveLanguage(language); }, [language]);

  const handleUpdateBalance = (delta: number) => {
    setBalance(prev => {
      const newVal = Math.max(0, prev + delta);
      return newVal;
    });
    
    if (delta > 0) hapticNotification('success');
    else if (delta < 0) hapticNotification('warning');

    if (delta !== 0) {
      setLedger(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        game: gameState === GameState.PLAYING ? selectedGame : 'System',
        amount: Math.abs(delta),
        result: delta > 0 ? 'WIN' : 'LOSS' as 'WIN' | 'LOSS',
        timestamp: Date.now()
      }, ...prev].slice(0, 50));
    }
  };

  const handleWinJackpot = (amount: number) => {
    handleUpdateBalance(amount);
    setJackpot(500000); // Reset jackpot to floor
    hapticNotification('success');
  };

  const handlePurchase = (item: InventoryItem) => {
    if (balance >= item.price && !item.owned) {
      handleUpdateBalance(-item.price);
      setInventory(prev => prev.map(i => i.id === item.id ? { ...i, owned: true } : i));
    }
  };

  return (
    <div className="min-h-screen font-sans bg-royal-bg text-royal-ivory overflow-hidden relative">
      <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" />

      {gameState === GameState.START && (
        <StartScreen onStart={() => { 
          setVisited(); 
          setGameState(GameState.LOBBY); 
          audioRef.current?.play().catch(() => {});
        }} userName={userName} lang={language} />
      )}
      
      {(gameState === GameState.LOBBY || gameState === GameState.LEADERBOARD || gameState === GameState.SETTINGS || gameState === GameState.VAULT || gameState === GameState.LEDGER || gameState === GameState.CONCIERGE) && (
        <LobbyScreen 
          onSelectGame={(g) => { setSelectedGame(g); setSessionStartBalance(balance); setGameState(GameState.PLAYING); }} 
          userName={privacyMode ? "Anonymous Member" : userName} 
          balance={balance}
          jackpot={jackpot}
          currentTab={gameState}
          onTabChange={setGameState}
          lang={language}
          rank={rank}
        >
          {gameState === GameState.LEADERBOARD && <LeaderboardScreen userBalance={balance} userName={userName} lang={language} />}
          {gameState === GameState.SETTINGS && (
            <SettingsScreen 
              lang={language} 
              onToggleLang={() => setLanguage(l => l === 'EN' ? 'RU' : 'EN')} 
              privacyMode={privacyMode}
              onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
            />
          )}
          {gameState === GameState.VAULT && <VaultScreen inventory={inventory} onPurchase={handlePurchase} balance={balance} />}
          {gameState === GameState.LEDGER && <LedgerScreen ledger={ledger} />}
          {gameState === GameState.CONCIERGE && <AIConciergeScreen userName={userName} rank={rank} />}
        </LobbyScreen>
      )}

      {gameState === GameState.WHEEL && (
        <WheelOfFortune 
          onWin={handleUpdateBalance} 
          onWinJackpot={handleWinJackpot}
          onBack={() => setGameState(GameState.LOBBY)} 
          jackpot={jackpot}
        />
      )}
      
      {gameState === GameState.PLAYING && (
        <GameScreen 
          gameType={selectedGame} 
          balance={balance} 
          onUpdateBalance={handleUpdateBalance} 
          onBackToLobby={() => setGameState(GameState.LOBBY)} 
        />
      )}
      
      {gameState === GameState.RESULT && (
        <ResultScreen 
          finalBalance={balance} 
          totalWon={balance - sessionStartBalance} 
          onRestart={() => setGameState(GameState.LOBBY)} 
          lang={language}
        />
      )}
    </div>
  );
}

export default App;