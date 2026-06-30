"use client";
import '../styles.css';


import { useState, useEffect } from 'react';
import { markCaseCompleted } from '@/components/case-progress';
import { useGameEngine } from '../hooks/useGameEngine';
import { FirstPersonView } from './FirstPersonView';
import { Minimap } from './Minimap';
import { QuestionModal } from './QuestionModal';
import { StoryModal } from './StoryModal';
import { ArrowUp, ArrowDown, CornerUpLeft, CornerUpRight } from 'lucide-react';

export default function GameContainer() {
  const { 
    player, anomalies, activeAnomaly, solveAnomaly, closeAnomaly, 
    gameWon, allSolved, movePlayer, turnPlayer, levelIndex, currentMap,
    showStory, finishStory
  } = useGameEngine();

  const [showMap, setShowMap] = useState<boolean>(false);

  useEffect(() => {
    (window as any).map = () => {
      setShowMap(prev => !prev);
      return "Map visibility toggled.";
    };
    return () => {
      delete (window as any).map;
    };
  }, []);

  useEffect(() => {
    if (gameWon) {
      markCaseCompleted("01");
      const timer = setTimeout(() => {
        window.location.href = '/hunt';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [gameWon]);

  const solvedCount = Object.values(anomalies).filter(a => a.solved).length;
  const totalAnomalies = Object.keys(anomalies).length;

  return (
    <div className="game-container">
      <div className="scanline-overlay"></div>

      <div className="hud-area">
        <div className="hud-box">
          <h3 style={{ margin: 0, color: 'var(--color-danger)' }}>PROJECT NULL</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>SECTOR: TOMB {levelIndex + 1}</p>
          {levelIndex === 0 && (
            <p style={{ margin: '8px 0 0 0' }}>Anomalies Sealed: {solvedCount} / {totalAnomalies}</p>
          )}
          {levelIndex === 1 && (
            <p style={{ margin: '8px 0 0 0', color: 'var(--color-accent)' }}>Primary Objective Located</p>
          )}
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'var(--desktop-instructions)' }}>W,A,S,D to navigate</p>
        </div>
      </div>

      <div className="viewport-area">
        <FirstPersonView player={player} anomalies={anomalies} allSolved={allSolved} currentMap={currentMap} />
      </div>

      <div className="controls-area">
        <div className="d-pad">
          <button className="basic-btn control-btn" onClick={() => turnPlayer(-1)}><CornerUpLeft size={32} /></button>
          <div className="up-down">
            <button className="basic-btn control-btn" onClick={() => movePlayer(0, 1)}><ArrowUp size={32} /></button>
            <button className="basic-btn control-btn" onClick={() => movePlayer(0, -1)}><ArrowDown size={32} /></button>
          </div>
          <button className="basic-btn control-btn" onClick={() => turnPlayer(1)}><CornerUpRight size={32} /></button>
        </div>
      </div>

      {showMap && (
        <div className="minimap-area">
          <Minimap player={player} anomalies={anomalies} allSolved={allSolved} currentMap={currentMap} />
        </div>
      )}

      <QuestionModal activeAnomaly={activeAnomaly} solveAnomaly={solveAnomaly} closeAnomaly={closeAnomaly} showMap={showMap} />

      {showStory && <StoryModal onClose={finishStory} />}

      {gameWon && (
        <div className="win-screen">
          <h1 className="glitch-text" data-text="PRISON SEALED">
            PRISON SEALED
          </h1>
          <p className="win-subtext">The future remains unborn.</p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => { markCaseCompleted("01"); window.location.href = '/hunt'; }}
              className="basic-btn"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                border: '1px solid var(--color-danger)',
                color: 'var(--color-danger)',
                background: 'rgba(0, 0, 0, 0.5)',
                cursor: 'pointer',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              Return to Hub
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              Redirecting automatically in 5 seconds...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
