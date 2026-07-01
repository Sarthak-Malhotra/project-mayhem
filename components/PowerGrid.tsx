import React from "react";
import { PowerTile } from "./PowerTile";
import { BeamRenderer } from "./BeamRenderer";
import { GridStatus } from "./GridStatus";
import { PowerSuccessModal } from "./PowerSuccessModal";
import { usePowerGrid } from "../hooks/usePowerGrid";
import { RefreshCw, ShieldAlert, Cpu, Power } from "lucide-react";

interface PowerGridProps {
  onSolve: () => void;
  hideModal?: boolean;
}

export function PowerGrid({ onSolve, hideModal = false }: PowerGridProps) {
  const {
    grid,
    poweredTileIds,
    traversalOrder,
    isSolved,
    memoryCorePowered,
    authCorePowered,
    rotateTile,
    resetGrid,
  } = usePowerGrid();

  const onSolveRef = React.useRef(onSolve);
  React.useEffect(() => {
    onSolveRef.current = onSolve;
  }, [onSolve]);

  React.useEffect(() => {
    if (isSolved && hideModal) {
      const timer = setTimeout(() => {
        if (onSolveRef.current) {
          onSolveRef.current();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSolved, hideModal]);

  return (
    <div className="w-full max-w-5xl px-4 py-6 flex flex-col items-center gap-8 z-10 select-none">
      {/* Puzzle Title & Diagnostic HUD */}
      <div className="w-full flex flex-col items-center text-center font-mono gap-1">
        <div className="text-[10px] tracking-[0.4em] text-cyan-500/70 uppercase">
          SECURITY BYPASS JUNCTION REQUIRED
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.25em] text-cyan-400 uppercase drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          POWER RESTORATION
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-2" />
      </div>

      {/* Main Grid and Control HUD Side-by-Side */}
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8">
        
        {/* Left Column: Grid Interface */}
        <div className="flex-1 flex flex-col items-center gap-4 w-full max-w-[460px]">
          {/* Main Grid Card */}
          <div className="w-full border border-zinc-800/80 bg-zinc-950/60 rounded-3xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden flex flex-col items-center">
            
            {/* Tech grid frame aesthetics */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl pointer-events-none" />

            <div className="absolute top-4 left-6 font-mono text-[8px] text-zinc-500 tracking-wider">
              GRID_COORD: 7×7 // NODE_PATH
            </div>

            <div className="relative w-full aspect-square border border-zinc-900 bg-black/40 rounded-xl overflow-hidden mt-4">
              {/* 7x7 Tile Grid */}
              <div className="grid grid-cols-7 w-full h-full relative z-20">
                {grid.map((tile) => (
                  <PowerTile
                    key={tile.id}
                    tile={tile}
                    isPowered={poweredTileIds.has(tile.id)}
                    isSolved={isSolved}
                    onClick={rotateTile}
                  />
                ))}
              </div>

              {/* Glowing SVG Connected Beams */}
              <BeamRenderer
                grid={grid}
                poweredTileIds={poweredTileIds}
                traversalOrder={traversalOrder}
              />
            </div>

            {/* Quick action panel */}
            <div className="w-full flex justify-between items-center mt-5 font-mono text-[9px] text-zinc-500 px-1">
              <div>STATUS: {isSolved ? "SECURED" : "PENDING_INPUT"}</div>
              <button
                onClick={resetGrid}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 hover:border-cyan-500/50 bg-zinc-900/40 text-zinc-400 hover:text-cyan-400 transition-all rounded-md cursor-pointer uppercase font-bold tracking-widest text-[9px]"
              >
                <RefreshCw size={10} className="animate-spin-slow" />
                <span>Re-Shuffle Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status Dashboard */}
        <div className="w-full lg:w-auto flex items-center lg:items-start justify-center">
          <GridStatus
            memoryCorePowered={memoryCorePowered}
            authCorePowered={authCorePowered}
            isSolved={isSolved}
          />
        </div>
      </div>

      {/* Success Modal */}
      {!hideModal && <PowerSuccessModal isOpen={isSolved} onConfirm={onSolve} />}
    </div>
  );
}
