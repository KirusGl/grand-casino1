import React, { useState } from 'react';
import { Diamond, Bomb } from 'lucide-react';
import BettingControls from '../shared/BettingControls';

interface Props { balance: number; onUpdateBalance: (d: number) => void; }

const MinesGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
    const [gameState, setGameState] = useState<'BETTING' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('BETTING');
    const [bet, setBet] = useState(10);
    const [minesCount, setMinesCount] = useState(3);
    const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
    const [mineLocations, setMineLocations] = useState<number[]>([]);
    const [gemsFound, setGemsFound] = useState(0);

    const startGame = () => {
        if (balance < bet) return;
        onUpdateBalance(-bet);
        const mines: number[] = [];
        while(mines.length < minesCount) {
            const r = Math.floor(Math.random() * 25);
            if(!mines.includes(r)) mines.push(r);
        }
        setMineLocations(mines);
        setRevealed(Array(25).fill(false));
        setGemsFound(0);
        setGameState('PLAYING');
    };

    const handleTileClick = (index: number) => {
        if (gameState !== 'PLAYING' || revealed[index]) return;
        const newRevealed = [...revealed];
        newRevealed[index] = true;
        setRevealed(newRevealed);
        if (mineLocations.includes(index)) {
            setGameState('GAMEOVER');
            setRevealed(Array(25).fill(true));
        } else {
            const found = gemsFound + 1;
            setGemsFound(found);
            if (found === 25 - minesCount) cashOut(found);
        }
    };

    const cashOut = (f?: number) => {
        if (gameState !== 'PLAYING') return;
        let m = 1.0;
        const found = f !== undefined ? f : gemsFound;
        for(let i=0; i<found; i++) m = m * (25 - i) / (25 - minesCount - i);
        
        onUpdateBalance(Math.floor(bet * m));
        setGameState('VICTORY');
        setRevealed(Array(25).fill(true));
    };

    return (
        <div className="flex flex-col h-full w-full bg-royal-bg overflow-hidden items-center justify-between">
            
            {/* Header */}
            <div className="w-full flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/20">
                <span className="text-royal-gold font-playfair font-bold text-[clamp(1.2rem,4vw,2rem)]">Royal Mines</span>
                <div className={`font-mono font-bold text-[clamp(1rem,4vw,1.2rem)] px-3 py-1 rounded bg-black/40 ${gameState === 'GAMEOVER' ? 'text-red-500' : 'text-royal-green'}`}>
                    {gameState === 'PLAYING' ? `Hit: ${gemsFound}` : gameState === 'VICTORY' ? 'WON' : gameState === 'GAMEOVER' ? 'LOST' : ''}
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 w-full flex items-center justify-center p-4">
                {/* АДАПТИВ: Grid всегда квадратный и не превышает ширину экрана или 450px */}
                <div className="w-full max-w-[min(90vw,450px)] aspect-square grid grid-cols-5 gap-[clamp(8px,2vw,16px)]">
                    {Array.from({length: 25}).map((_, i) => {
                        const isMine = mineLocations.includes(i);
                        const isRevealed = revealed[i];
                        return (
                            <button
                                key={i}
                                onClick={() => handleTileClick(i)}
                                disabled={gameState !== 'PLAYING' || isRevealed}
                                className={`
                                    relative w-full h-full rounded-md md:rounded-lg transition-all duration-300 shadow-lg overflow-hidden
                                    ${isRevealed 
                                        ? (isMine ? 'bg-red-900/80 shadow-inner' : 'bg-royal-green/20 border border-royal-green/50') 
                                        : 'bg-gradient-to-br from-om-wood to-[#2d1409] hover:brightness-110 border border-royal-gold/10 active:scale-95'}
                                `}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {isRevealed && isMine && <Bomb className="w-[50%] h-[50%] text-red-500 animate-[pulse_0.5s_ease-in-out_infinite]" />}
                                    {isRevealed && !isMine && <Diamond className="w-[50%] h-[50%] text-cyan-400 animate-[bounce_0.5s_ease-out]" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {gameState === 'BETTING' || gameState === 'GAMEOVER' || gameState === 'VICTORY' ? (
                <BettingControls
                    balance={balance}
                    currentBet={bet}
                    onBetChange={setBet}
                    onAction={startGame}
                    actionLabel={gameState === 'BETTING' ? 'START' : 'RETRY'}
                >
                    <div className="flex justify-between gap-2 mb-2 bg-black/40 p-1.5 rounded-lg">
                        {[1, 3, 5, 10, 24].map(m => (
                            <button 
                                key={m} 
                                onClick={() => setMinesCount(m)} 
                                className={`flex-1 py-2 rounded-md text-[10px] md:text-xs font-bold transition-all uppercase tracking-wider ${minesCount === m ? 'bg-royal-gold text-black shadow-md' : 'text-royal-gold/60 hover:text-royal-gold hover:bg-white/5'}`}
                            >
                                {m} Mines
                            </button>
                        ))}
                    </div>
                </BettingControls>
            ) : (
                <div className="w-full bg-royal-wood/95 border-t border-royal-gold/30 p-4 pb-safe shadow-[0_-5px_20px_black]">
                    <button 
                        onClick={() => cashOut()} 
                        className="w-full py-4 bg-gradient-to-r from-royal-green to-green-700 text-white font-black text-[clamp(1.2rem,5vw,1.5rem)] rounded-sm shadow-embossed hover:brightness-110 active:scale-95 transition-all border border-white/20"
                    >
                        CASH OUT
                    </button>
                </div>
            )}
        </div>
    );
};

export default MinesGame;