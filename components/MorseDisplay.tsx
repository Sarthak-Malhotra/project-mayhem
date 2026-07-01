import React from "react";

interface MorseDisplayProps {
  transmission: string;
}

export function MorseDisplay({ transmission }: MorseDisplayProps) {
  // Split the transmission into words using double newlines
  const words = transmission.split(/\n\s*\n/);

  return (
    <div className="w-full border border-dashed border-zinc-800 bg-black/40 rounded-2xl p-6 md:p-8 flex flex-col items-center max-w-2xl relative font-mono">
      <div className="text-[10px] tracking-wider text-cyan-500/40 uppercase mb-6 select-none">
        RECOVERED TRANSMISSION // RAW_DATA
      </div>

      <div className="flex flex-col items-center gap-6 select-none w-full text-center">
        {words.map((word, wordIndex) => (
          <div
            key={wordIndex}
            className="text-lg md:text-xl font-bold tracking-[0.2em] text-cyan-300/90 py-2 px-6 bg-zinc-950/40 border border-zinc-900/50 rounded-lg hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] w-fit"
          >
            {word.trim()}
          </div>
        ))}
      </div>
    </div>
  );
}
