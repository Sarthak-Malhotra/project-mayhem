"use client";

import React, { useRef } from "react";
import { GondolaState } from "../types";
import { NUM_GONDOLAS } from "../constants";

interface FerrisWheelProps {
  gondolas: GondolaState[];
  rotationStep: number;
  onGondolaClick: (index: number) => void;
  disabled?: boolean;
}

const WHEEL_RADIUS = 160;       // px, gondola orbit radius
const GONDOLA_SIZE = 36;        // px, gondola box size
const SVG_SIZE = 420;           // total SVG viewport

export default function FerrisWheel({
  gondolas,
  rotationStep,
  onGondolaClick,
  disabled,
}: FerrisWheelProps) {
  const animRef = useRef<SVGGElement>(null);

  // Animate rotation by CSS transform — one full rotation = NUM_GONDOLAS steps
  const rotationDeg = (rotationStep * (360 / NUM_GONDOLAS)) % 360;

  return (
    <div className="relative flex items-center justify-center w-full select-none">
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="overflow-visible"
        aria-label="Ferris wheel puzzle"
      >
        <defs>
          {/* Hub glow */}
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dc143c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8b0000" stopOpacity="0.2" />
          </radialGradient>
          {/* Spoke gradient */}
          <radialGradient
            id="spokeGrad"
            cx={SVG_SIZE / 2}
            cy={SVG_SIZE / 2}
            r={WHEEL_RADIUS}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b8860b" stopOpacity="0.3" />
          </radialGradient>
          {/* Gondola normal */}
          <linearGradient id="gondolaNormal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a0a1a" />
            <stop offset="100%" stopColor="#0d0510" />
          </linearGradient>
          {/* Gondola glow */}
          <linearGradient id="gondolaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b8860b" stopOpacity="0.5" />
          </linearGradient>
          {/* Ghost/anomaly */}
          <linearGradient id="gondolaGhost" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b0000" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#dc143c" stopOpacity="0.5" />
          </linearGradient>
          {/* Drop shadow filter */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ghostGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hubFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Outer ring decorative track ── */}
        <circle
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={WHEEL_RADIUS + GONDOLA_SIZE / 2 + 6}
          fill="none"
          stroke="#ffd700"
          strokeWidth="1.5"
          strokeOpacity="0.15"
          strokeDasharray="4 6"
        />
        <circle
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={WHEEL_RADIUS + GONDOLA_SIZE / 2 + 14}
          fill="none"
          stroke="#dc143c"
          strokeWidth="0.5"
          strokeOpacity="0.1"
        />

        {/* ── Rotating group ── */}
        <g
          ref={animRef}
          style={{
            transformOrigin: `${SVG_SIZE / 2}px ${SVG_SIZE / 2}px`,
            transform: `rotate(${rotationDeg}deg)`,
            transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Spokes */}
          {Array.from({ length: NUM_GONDOLAS }, (_, i) => {
            const angleDeg = (i * 360) / NUM_GONDOLAS - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = SVG_SIZE / 2 + WHEEL_RADIUS * Math.cos(angleRad);
            const y = SVG_SIZE / 2 + WHEEL_RADIUS * Math.sin(angleRad);
            return (
              <line
                key={`spoke-${i}`}
                x1={SVG_SIZE / 2}
                y1={SVG_SIZE / 2}
                x2={x}
                y2={y}
                stroke="url(#spokeGrad)"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Hub center decoration rings */}
          <circle
            cx={SVG_SIZE / 2}
            cy={SVG_SIZE / 2}
            r={22}
            fill="url(#hubGlow)"
            filter="url(#hubFilter)"
          />
          <circle
            cx={SVG_SIZE / 2}
            cy={SVG_SIZE / 2}
            r={14}
            fill="#1a0010"
            stroke="#ffd700"
            strokeWidth="2"
          />
          <circle
            cx={SVG_SIZE / 2}
            cy={SVG_SIZE / 2}
            r={5}
            fill="#ffd700"
          />
        </g>

        {/* ── Gondolas (counter-rotate so text stays upright) ── */}
        {gondolas.map((gondola) => {
          const angleDeg =
            (gondola.index * 360) / NUM_GONDOLAS - 90 + rotationDeg;
          const angleRad = (angleDeg * Math.PI) / 180;
          const cx = SVG_SIZE / 2 + WHEEL_RADIUS * Math.cos(angleRad);
          const cy = SVG_SIZE / 2 + WHEEL_RADIUS * Math.sin(angleRad);
          const half = GONDOLA_SIZE / 2;

          const fillId = gondola.isGlowing
            ? "url(#gondolaGlow)"
            : gondola.isAnomaly
            ? "url(#gondolaGhost)"
            : "url(#gondolaNormal)";

          const strokeColor = gondola.isGlowing
            ? "#ffd700"
            : gondola.isAnomaly
            ? "#dc143c"
            : "#4a1a4a";

          const textColor = gondola.isGlowing
            ? "#1a0a00"
            : gondola.isAnomaly
            ? "#ff4444"
            : "#e8d5b7";

          const filterAttr = gondola.isAnomaly
            ? "url(#ghostGlow)"
            : gondola.isGlowing
            ? "url(#glow)"
            : undefined;

          return (
            <g
              key={`gondola-${gondola.index}`}
              style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              onClick={() => !disabled && onGondolaClick(gondola.index)}
              role="button"
              aria-label={`Gondola ${gondola.index}, value ${gondola.displayedNumber}`}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) =>
                !disabled && e.key === "Enter" && onGondolaClick(gondola.index)
              }
            >
              {/* Suspension wire */}
              <line
                x1={SVG_SIZE / 2 + WHEEL_RADIUS * Math.cos(angleRad)}
                y1={SVG_SIZE / 2 + WHEEL_RADIUS * Math.sin(angleRad)}
                x2={cx}
                y2={cy - half - 6}
                stroke="#b8860b"
                strokeWidth="1"
                strokeOpacity="0.4"
              />

              {/* Gondola box */}
              <rect
                x={cx - half}
                y={cy - half}
                width={GONDOLA_SIZE}
                height={GONDOLA_SIZE}
                rx={6}
                ry={6}
                fill={fillId}
                stroke={strokeColor}
                strokeWidth={gondola.isGlowing || gondola.isAnomaly ? 2 : 1}
                filter={filterAttr}
                style={{
                  transition: "fill 0.3s, stroke 0.3s",
                }}
              />

              {/* Gondola index (tiny, top-left corner) */}
              <text
                x={cx - half + 4}
                y={cy - half + 9}
                fontSize="7"
                fill="#6a3a6a"
                fontFamily="monospace"
              >
                {gondola.index}
              </text>

              {/* Number display */}
              <text
                x={cx}
                y={cy + 6}
                textAnchor="middle"
                fontSize={gondola.displayedNumber >= 10 ? "14" : "16"}
                fontWeight="bold"
                fill={textColor}
                fontFamily="monospace"
                style={{ transition: "fill 0.3s" }}
              >
                {gondola.displayedNumber}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
