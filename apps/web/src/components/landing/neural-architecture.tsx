"use client";

import { motion } from "motion/react";
import type React from "react";

export const AIArchitecture: React.FC = () => {
  const nodes = [
    { x: 100, y: 100, label: "Intent" },
    { x: 300, y: 100, label: "Context" },
    { x: 100, y: 300, label: "Gap" },
    { x: 300, y: 300, label: "Match" },
  ];

  return (
    <div className="relative flex aspect-square w-full items-center justify-center p-comfortable">
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full max-w-[340px]"
      >
        {/* Simple Connection Lines */}
        <g className="stroke-line" strokeWidth="1.5">
          {nodes.map((node, i) => (
            <path key={i} d={`M200,200 L${node.x},${node.y}`} />
          ))}
        </g>

        {/* Flowing Particles out of Center (Success Green) */}
        <g fill="var(--status-success-text)">
          {nodes.map((node, i) => (
            <circle key={`p1-${i}`} r="3">
              <animateMotion
                dur={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * -0.5}s`}
                path={`M200,200 L${node.x},${node.y}`}
              />
            </circle>
          ))}
          {nodes.map((node, i) => (
            <circle key={`p2-${i}`} r="3" opacity="0.4">
              <animateMotion
                dur={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * -0.5 - 1}s`}
                path={`M200,200 L${node.x},${node.y}`}
              />
            </circle>
          ))}
        </g>

        {/* Central Hub */}
        <g>
          <circle
            cx="200"
            cy="200"
            r="42"
            className="fill-surface stroke-line-strong"
            strokeWidth="1"
          />
          <motion.circle
            cx="200"
            cy="200"
            r="34"
            className="fill-primary-alpha/20 stroke-line"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <circle cx="200" cy="200" r="6" className="fill-primary" />
        </g>

        {/* Analysis Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r="30"
              className="fill-surface stroke-line-medium"
              strokeWidth="0.5"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-ink-muted font-medium font-sans text-[11px]"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Labels for central hub */}
        <text
          x="200"
          y="254"
          textAnchor="middle"
          className="fill-ink-full font-medium font-serif text-[12px]"
        >
          Screener
        </text>
      </svg>
    </div>
  );
};
