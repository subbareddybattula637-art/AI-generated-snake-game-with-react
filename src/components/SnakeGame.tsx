import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, TerminalSquare } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 120;

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'BUTTON'].includes(document.activeElement?.tagName || '')) return;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!hasStarted && !gameOver && e.key !== ' ') {
        setHasStarted(true);
      }

      const { x, y } = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (hasStarted && !gameOver) {
            setIsPaused(p => !p);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(40, BASE_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Score Board */}
      <div className="flex gap-8 mb-8 bg-black p-4 border-glitch-magenta w-full max-w-md justify-between items-center relative">
        <div className="absolute -top-3 left-4 bg-black px-2 text-cyan-glitch text-sm">METRICS</div>
        <div className="flex flex-col">
          <span className="text-cyan-glitch text-xl mb-1">DATA_COLLECTED</span>
          <span className="text-4xl md:text-5xl font-digital text-magenta-glitch glitch" data-text={score}>{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-magenta-glitch text-xl flex items-center gap-2 mb-1">
            <Trophy size={16} /> MAX_EFFICIENCY
          </span>
          <span className="text-4xl md:text-5xl font-digital text-cyan-glitch glitch" data-text={highScore}>{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative bg-black border-4 border-cyan-glitch p-1 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        <div 
          className="grid bg-gray-950"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border-[0.5px] border-gray-900
                  ${isHead ? 'bg-cyan-glitch' : ''}
                  ${isSnake && !isHead ? 'bg-cyan-glitch opacity-60' : ''}
                  ${isFood ? 'bg-magenta-glitch animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-2 border-magenta-glitch m-1 backdrop-blur-sm">
            {!hasStarted && !gameOver && (
              <div className="text-center screen-tear">
                <TerminalSquare size={64} className="mx-auto text-cyan-glitch mb-6" />
                <h3 className="text-3xl font-digital text-magenta-glitch mb-4 glitch" data-text="SYSTEM_READY">SYSTEM_READY</h3>
                <p className="text-cyan-glitch text-2xl animate-pulse">AWAITING_INPUT...</p>
              </div>
            )}
            
            {isPaused && !gameOver && hasStarted && (
              <div className="text-center screen-tear">
                <h3 className="text-4xl font-digital text-cyan-glitch mb-4 glitch" data-text="SYSTEM_HALTED">SYSTEM_HALTED</h3>
                <p className="text-magenta-glitch text-2xl animate-pulse">INPUT_REQUIRED_TO_RESUME</p>
              </div>
            )}

            {gameOver && (
              <div className="text-center screen-tear">
                <h3 className="text-4xl font-digital text-magenta-glitch mb-6 glitch" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h3>
                <p className="text-cyan-glitch text-2xl mb-8">FINAL_OUTPUT: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-3 mx-auto px-6 py-4 bg-black border-2 border-cyan-glitch text-magenta-glitch hover:bg-cyan-glitch hover:text-black font-digital text-xl transition-none"
                >
                  <RotateCcw size={24} /> REBOOT_SEQUENCE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-magenta-glitch text-xl flex flex-col sm:flex-row gap-4 sm:gap-12 border-b-2 border-cyan-glitch pb-4">
        <span>[W,A,S,D] = OVERRIDE_VECTOR</span>
        <span>[SPACE] = HALT_PROCESS</span>
      </div>
    </div>
  );
}
