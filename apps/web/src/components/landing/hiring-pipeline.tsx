"use client";

import type React from "react";

export const HiringPipeline: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden py-4">
      <h2 className="sr-only">
        AI hiring pipeline: applicant data flows into an AI screener which
        outputs shortlisted candidates, interviews, and insights
      </h2>

      <svg
        width="100%"
        viewBox="0 0 680 465"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
      >
        <title>AI-powered hiring pipeline</title>
        <desc>
          Five applicant data types flow into a central AI screener, which
          outputs shortlisted candidates, interview schedules, and hiring
          insights
        </desc>
        <defs>
          <marker
            id="arr"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M2 1L8 5L2 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-line"
            />
          </marker>
        </defs>

        {/* connection paths */}
        <g className="stroke-line" fill="none" strokeWidth="1.5">
          <path d="M92,90 C197,90 197,250 302,250" />
          <path d="M92,170 C197,170 197,250 302,250" />
          <path d="M92,250 L302,250" />
          <path d="M92,330 C197,330 197,250 302,250" />
          <path d="M92,410 C197,410 197,250 302,250" />
          <path d="M378,250 C483,250 483,170 588,170" />
          <path d="M378,250 L588,250" />
          <path d="M378,250 C483,250 483,330 588,330" />
        </g>

        {/* animated particles - input */}
        <g fill="var(--status-warning-text)">
          <circle r="3.5">
            <animateMotion
              dur="2.3s"
              repeatCount="indefinite"
              begin="0s"
              path="M92,90 C197,90 197,250 302,250"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="2.3s"
              repeatCount="indefinite"
              begin="-1.15s"
              path="M92,90 C197,90 197,250 302,250"
            />
          </circle>
          <circle r="3.5">
            <animateMotion
              dur="2.0s"
              repeatCount="indefinite"
              begin="-0.3s"
              path="M92,170 C197,170 197,250 302,250"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="2.0s"
              repeatCount="indefinite"
              begin="-1.3s"
              path="M92,170 C197,170 197,250 302,250"
            />
          </circle>
          <circle r="3.5">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              begin="-0.2s"
              path="M92,250 L302,250"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              begin="-0.95s"
              path="M92,250 L302,250"
            />
          </circle>
          <circle r="3.5">
            <animateMotion
              dur="2.1s"
              repeatCount="indefinite"
              begin="-0.7s"
              path="M92,330 C197,330 197,250 302,250"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="2.1s"
              repeatCount="indefinite"
              begin="-1.6s"
              path="M92,330 C197,330 197,250 302,250"
            />
          </circle>
          <circle r="3.5">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin="-0.5s"
              path="M92,410 C197,410 197,250 302,250"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin="-1.75s"
              path="M92,410 C197,410 197,250 302,250"
            />
          </circle>
        </g>

        {/* animated particles - output */}
        <g fill="var(--status-success-text)">
          <circle r="3.5">
            <animateMotion
              dur="1.9s"
              repeatCount="indefinite"
              begin="-0.2s"
              path="M378,250 C483,250 483,170 588,170"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="1.9s"
              repeatCount="indefinite"
              begin="-1.1s"
              path="M378,250 C483,250 483,170 588,170"
            />
          </circle>
          <circle r="3.5">
            <animateMotion
              dur="1.6s"
              repeatCount="indefinite"
              begin="0s"
              path="M378,250 L588,250"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="1.6s"
              repeatCount="indefinite"
              begin="-0.8s"
              path="M378,250 L588,250"
            />
          </circle>
          <circle r="3.5">
            <animateMotion
              dur="2.0s"
              repeatCount="indefinite"
              begin="-0.5s"
              path="M378,250 C483,250 483,330 588,330"
            />
          </circle>
          <circle r="3.5" opacity=".45">
            <animateMotion
              dur="2.0s"
              repeatCount="indefinite"
              begin="-1.4s"
              path="M378,250 C483,250 483,330 588,330"
            />
          </circle>
        </g>

        {/* nodes */}
        <g className="fill-surface stroke-line-medium" strokeWidth="0.5">
          <circle cx="66" cy="90" r="30" />
          <circle cx="66" cy="170" r="30" />
          <circle cx="66" cy="250" r="30" />
          <circle cx="66" cy="330" r="30" />
          <circle cx="66" cy="410" r="30" />

          <circle cx="614" cy="170" r="30" />
          <circle cx="614" cy="250" r="30" />
          <circle cx="614" cy="330" r="30" />
        </g>

        {/* hub */}
        <circle
          cx="340"
          cy="250"
          r="38"
          className="fill-surface stroke-line-strong"
          strokeWidth="1"
        />

        {/* icons */}
        <g
          className="stroke-ink-muted"
          fill="none"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <g transform="translate(58,82)">
            <rect x="3" y="1" width="10" height="13" rx="1.5" />
            <line x1="5.5" y1="5" x2="10.5" y2="5" />
            <line x1="5.5" y1="7.5" x2="10.5" y2="7.5" />
            <line x1="5.5" y1="10" x2="8.5" y2="10" />
          </g>
          <g transform="translate(58,162)">
            <circle cx="8" cy="5" r="2.5" />
            <path d="M3.5 14c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
          </g>
          <g transform="translate(58,242)" strokeLinejoin="round">
            <rect x="1.5" y="3.5" width="13" height="9" rx="1" />
            <polyline points="1.5,3.5 8,9 14.5,3.5" />
          </g>
          <g transform="translate(58,322)" strokeLinejoin="round">
            <rect x="3" y="1" width="10" height="13" rx="1.5" />
            <polyline points="5.5,5.5 6.5,7 9.5,4" />
            <polyline points="5.5,9.5 6.5,11 9.5,8" />
          </g>
          <g transform="translate(58,402)">
            <rect x="1.5" y="1.5" width="5.5" height="5.5" rx=".5" />
            <rect x="9" y="1.5" width="5.5" height="5.5" rx=".5" />
            <rect x="1.5" y="9" width="5.5" height="5.5" rx=".5" />
            <rect x="9" y="9" width="5.5" height="5.5" rx=".5" />
          </g>
          <g transform="translate(606,162)" strokeLinejoin="round">
            <polygon points="8,1 9.8,5.8 15,6.3 11.2,10 12.4,15 8,12.2 3.6,15 4.8,10 1,6.3 6.2,5.8" />
          </g>
          <g transform="translate(606,242)">
            <rect x="1.5" y="3" width="13" height="11" rx="1" />
            <line x1="5" y1="1.5" x2="5" y2="4.5" />
            <line x1="11" y1="1.5" x2="11" y2="4.5" />
            <line x1="1.5" y1="7" x2="14.5" y2="7" strokeWidth="0.8" />
            <circle cx="5" cy="10" r="0.8" fill="currentColor" />
            <circle cx="8" cy="10" r="0.8" fill="currentColor" />
            <circle cx="11" cy="10" r="0.8" fill="currentColor" />
          </g>
          <g transform="translate(606,322)">
            <rect
              x="2"
              y="10"
              width="3"
              height="4.5"
              fill="currentColor"
              opacity=".65"
            />
            <rect
              x="6.5"
              y="7"
              width="3"
              height="7.5"
              fill="currentColor"
              opacity=".65"
            />
            <rect
              x="11"
              y="4"
              width="3"
              height="10.5"
              fill="currentColor"
              opacity=".65"
            />
            <line x1="1.5" y1="14.8" x2="14.5" y2="14.8" strokeWidth="0.8" />
          </g>
        </g>

        {/* hub mark */}
        <g transform="translate(328,238)">
          <path
            d="M12 1 L14.2 9.5 L22.8 12 L14.2 14.5 L12 23 L9.8 14.5 L1.2 12 L9.8 9.5 Z"
            fill="var(--primary)"
            opacity=".92"
          />
        </g>

        {/* labels */}
        <g
          className="fill-ink-muted font-medium font-sans text-[13px]"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <text x="66" y="130">
            Resume
          </text>
          <text x="66" y="210">
            LinkedIn
          </text>
          <text x="66" y="290">
            Cover letter
          </text>
          <text x="66" y="370">
            Assessment
          </text>
          <text x="66" y="450">
            Portfolio
          </text>
          <text
            x="340"
            y="304"
            className="fill-ink-full font-semibold text-[14px]"
          >
            Screener
          </text>
          <text x="614" y="210">
            Shortlisted
          </text>
          <text x="614" y="290">
            Interviews
          </text>
          <text x="614" y="370">
            Insights
          </text>
        </g>
      </svg>
    </div>
  );
};
