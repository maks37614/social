import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  Minus, 
  TrendingUp, 
  Move, 
  Eye, 
  Layers 
} from 'lucide-react';

export const HookChartEmbed: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'cursor' | 'line' | 'levels' | 'channel' | 'fib'>('cursor');
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; price: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Candlestick data points mirroring the exact wave on the screenshot
  // from 138.80 up to 144.20, then correction to 142.16
  const candles = [
    { o: 139.1, h: 139.4, l: 138.8, c: 139.3, t: '09:00' },
    { o: 139.3, h: 139.8, l: 139.0, c: 139.6, t: '09:10' },
    { o: 139.6, h: 139.7, l: 139.2, c: 139.3, t: '09:20' },
    { o: 139.3, h: 140.2, l: 139.1, c: 140.1, t: '09:30' },
    { o: 140.1, h: 140.6, l: 139.9, c: 140.4, t: '09:40' },
    { o: 140.4, h: 140.5, l: 139.8, c: 139.9, t: '09:50' },
    { o: 139.9, h: 140.3, l: 139.6, c: 140.2, t: '10:00' },
    { o: 140.2, h: 140.9, l: 140.0, c: 140.7, t: '10:15' },
    { o: 140.7, h: 141.2, l: 140.5, c: 141.0, t: '10:30' },
    { o: 141.0, h: 141.1, l: 140.6, c: 140.8, t: '10:45' },
    { o: 140.8, h: 141.5, l: 140.7, c: 141.4, t: '11:00' },
    { o: 141.4, h: 141.9, l: 141.2, c: 141.8, t: '11:15' },
    { o: 141.8, h: 142.3, l: 141.5, c: 142.1, t: '11:30' },
    { o: 142.1, h: 142.0, l: 141.4, c: 141.6, t: '11:45' },
    { o: 141.6, h: 142.4, l: 141.5, c: 142.2, t: '12:00' },
    { o: 142.2, h: 142.9, l: 142.0, c: 142.7, t: '12:15' },
    { o: 142.7, h: 143.4, l: 142.5, c: 143.2, t: '12:30' },
    { o: 143.2, h: 143.8, l: 143.0, c: 143.6, t: '12:45' },
    { o: 143.6, h: 144.2, l: 143.4, c: 144.1, t: '13:00' },
    { o: 144.1, h: 144.4, l: 143.6, c: 143.8, t: '13:15' },
    { o: 143.8, h: 144.2, l: 143.5, c: 144.0, t: '13:30' },
    { o: 144.0, h: 144.1, l: 143.3, c: 143.5, t: '13:45' },
    { o: 143.5, h: 143.7, l: 142.9, c: 143.1, t: '14:00' },
    { o: 143.1, h: 143.2, l: 142.4, c: 142.6, t: '14:15' },
    { o: 142.6, h: 142.8, l: 142.0, c: 142.2, t: '14:30' },
    { o: 142.2, h: 142.5, l: 141.8, c: 142.0, t: '14:45' },
    { o: 142.0, h: 142.6, l: 141.9, c: 142.5, t: '15:00' },
    { o: 142.5, h: 142.7, l: 142.1, c: 142.68, t: '15:15' },
  ];

  // SVG coordinate calculations
  // Chart dimensions in viewBox: 800 x 380
  // Price range: 138.5 to 146.5
  const minPrice = 138.5;
  const maxPrice = 146.5;
  const chartHeight = 320;
  const chartWidth = 690;
  const leftPadding = 45;
  const topPadding = 20;

  const priceToY = (price: number) => {
    return topPadding + ((maxPrice - price) / (maxPrice - minPrice)) * chartHeight;
  };

  const fibLevels = [
    { label: '1.272 (145.80)', price: 145.80, color: '#38bdf8' },
    { label: '1.000 (144.20)', price: 144.20, color: '#64748b' },
    { label: '0.786 (143.06)', price: 143.06, color: '#64748b' },
    { label: '0.618 (142.16)', price: 142.16, color: '#00e5bf' },
    { label: '0.500 (141.52)', price: 141.52, color: '#64748b' },
    { label: '0.382 (140.88)', price: 140.88, color: '#64748b' },
    { label: '0.236 (140.09)', price: 140.09, color: '#f43f5e' },
    { label: '0.000 (138.84)', price: 138.84, color: '#64748b' },
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const price = maxPrice - ((y - topPadding) / chartHeight) * (maxPrice - minPrice);
    setHoverCoord({ x, y, price });
  };

  return (
    <div className="bg-[#0b101b] border border-[#1b273d] rounded-2xl overflow-hidden shadow-2xl relative font-mono text-xs">
      {/* Chart Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#162338] bg-[#090e18]/80 text-slate-300 overflow-x-auto no-scrollbar gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-white tracking-tight">HookChart</span>
          <span className="text-slate-500">•</span>
          <span className="text-white font-bold">SOLUSDT</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">5m</span>
        </div>

        {/* OHLC Values */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] text-slate-400 shrink-0">
          <div><span className="text-slate-500">O</span> <span className="text-emerald-400">142.36</span></div>
          <div><span className="text-slate-500">H</span> <span className="text-emerald-400">142.71</span></div>
          <div><span className="text-slate-500">L</span> <span className="text-emerald-400">142.28</span></div>
          <div><span className="text-slate-500">C</span> <span className="text-emerald-400">142.68</span></div>
          <div className="text-emerald-400 font-bold">+0.32 (+0.23%)</div>
        </div>
      </div>

      <div className="flex relative overflow-x-auto no-scrollbar">
        {/* Left Toolbar */}
        <div className="w-10 border-r border-[#17243a] bg-[#090e18] p-1.5 flex flex-col items-center gap-2 shrink-0">
          {/* Cursor tool */}
          <button
            onClick={() => setActiveTool('cursor')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeTool === 'cursor' ? 'bg-[#00e5bf]/20 text-[#00e5bf] border border-[#00e5bf]/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Курсор"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M4 3l15 9-6.5 2 3.5 7-3 1.5-3.5-7L4 20V3z"/>
            </svg>
          </button>

          {/* Line tool */}
          <button
            onClick={() => setActiveTool('line')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeTool === 'line' ? 'bg-[#00e5bf]/20 text-[#00e5bf] border border-[#00e5bf]/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Трендова лінія"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2">
              <line x1="4" y1="20" x2="20" y2="4"/>
              <circle cx="4" cy="20" r="2" fill="currentColor"/>
              <circle cx="20" cy="4" r="2" fill="currentColor"/>
            </svg>
          </button>

          {/* Horizontal levels tool */}
          <button
            onClick={() => setActiveTool('levels')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeTool === 'levels' ? 'bg-[#00e5bf]/20 text-[#00e5bf] border border-[#00e5bf]/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Горизонтальні рівні"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2">
              <line x1="3" y1="8" x2="21" y2="8"/>
              <line x1="3" y1="16" x2="21" y2="16"/>
              <line x1="8" y1="5" x2="8" y2="19"/>
            </svg>
          </button>

          {/* Parallel channel tool */}
          <button
            onClick={() => setActiveTool('channel')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeTool === 'channel' ? 'bg-[#00e5bf]/20 text-[#00e5bf] border border-[#00e5bf]/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Висхідний канал"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2">
              <line x1="3" y1="18" x2="19" y2="6"/>
              <line x1="5" y1="22" x2="21" y2="10"/>
            </svg>
          </button>

          {/* Fibonacci tool */}
          <button
            onClick={() => setActiveTool('fib')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              activeTool === 'fib' ? 'bg-[#00e5bf]/20 text-[#00e5bf] border border-[#00e5bf]/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Сітка Фібоначчі"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Main Canvas Area */}
        <div ref={containerRef} className="flex-1 relative bg-[#080d17] select-none min-w-[560px]">
          <svg
            viewBox="0 0 780 370"
            className="w-full h-[320px] sm:h-[370px] cursor-crosshair min-w-[560px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverCoord(null)}
          >
            <defs>
              {/* Glow filter for cyan trend lines */}
              <filter id="tealGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="channelFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5bf" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#00e5bf" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Subtle background grid lines */}
            {[139, 140, 141, 142, 143, 144, 145, 146].map((p) => (
              <line
                key={p}
                x1={leftPadding}
                y1={priceToY(p)}
                x2={leftPadding + chartWidth}
                y2={priceToY(p)}
                stroke="#121d30"
                strokeWidth="1"
              />
            ))}

            {/* Time vertical grid lines */}
            {[70, 160, 250, 340, 430, 520, 610, 690].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1={topPadding}
                x2={x}
                y2={topPadding + chartHeight}
                stroke="#121d30"
                strokeWidth="1"
              />
            ))}

            {/* Ascending Parallel Channel Area */}
            <polygon
              points={`
                70,${priceToY(140.4)} 
                690,${priceToY(146.1)} 
                690,${priceToY(142.7)} 
                70,${priceToY(138.8)}
              `}
              fill="url(#channelFill)"
            />

            {/* Upper channel line */}
            <line
              x1="70"
              y1={priceToY(140.4)}
              x2="690"
              y2={priceToY(146.1)}
              stroke="#00e5bf"
              strokeWidth="2.5"
              filter="url(#tealGlow)"
            />

            {/* Lower channel line (Support) */}
            <line
              x1="70"
              y1={priceToY(138.8)}
              x2="690"
              y2={priceToY(142.7)}
              stroke="#00e5bf"
              strokeWidth="2.5"
              filter="url(#tealGlow)"
            />

            {/* Fibonacci Retracement Levels */}
            {fibLevels.map((fib) => {
              const y = priceToY(fib.price);
              return (
                <g key={fib.label}>
                  <line
                    x1={leftPadding + 10}
                    y1={y}
                    x2={leftPadding + chartWidth - 80}
                    y2={y}
                    stroke={fib.color}
                    strokeWidth={fib.color === '#00e5bf' || fib.color === '#f43f5e' ? '1.5' : '1'}
                    strokeDasharray={fib.color === '#64748b' ? '3 3' : 'none'}
                    opacity={fib.color === '#64748b' ? 0.7 : 0.9}
                  />
                  <text
                    x={leftPadding + 15}
                    y={y - 4}
                    fill={fib.color}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {fib.label}
                  </text>
                </g>
              );
            })}

            {/* Render Candlesticks */}
            {candles.map((c, i) => {
              const x = 70 + i * 22;
              const isGreen = c.c >= c.o;
              const bodyTop = priceToY(Math.max(c.o, c.c));
              const bodyBottom = priceToY(Math.min(c.o, c.c));
              const bodyHeight = Math.max(2, bodyBottom - bodyTop);
              const color = isGreen ? '#00e5bf' : '#ef4444';

              return (
                <g key={i}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={priceToY(c.h)}
                    x2={x}
                    y2={priceToY(c.l)}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - 4}
                    y={bodyTop}
                    width="8"
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}

            {/* Projected White Arrow (Trajectory towards TP 145.80) */}
            <path
              d={`M 640 ${priceToY(142.4)} Q 660 ${priceToY(144.0)} 675 ${priceToY(145.6)}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon
              points={`675,${priceToY(145.6) - 5} 670,${priceToY(145.6) + 7} 682,${priceToY(145.6) + 4}`}
              fill="#ffffff"
            />

            {/* Take Profit (TP 145.80) Badge */}
            <g transform={`translate(${leftPadding + chartWidth - 110}, ${priceToY(145.80) - 10})`}>
              <rect
                width="72"
                height="20"
                rx="6"
                fill="#00e5bf"
                stroke="#00e5bf"
                strokeWidth="1"
                filter="url(#tealGlow)"
              />
              <text x="36" y="14" fill="#080d17" fontWeight="bold" fontSize="10" textAnchor="middle">
                TP 145.80
              </text>
            </g>

            {/* Entry (Entry 142.16) Badge */}
            <g transform={`translate(${leftPadding + chartWidth - 110}, ${priceToY(142.16) - 10})`}>
              <rect
                width="72"
                height="20"
                rx="6"
                fill="#0e2338"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              <text x="36" y="14" fill="#38bdf8" fontWeight="bold" fontSize="10" textAnchor="middle">
                Entry 142.16
              </text>
            </g>

            {/* Stop Loss (SL 140.09) Badge */}
            <g transform={`translate(${leftPadding + chartWidth - 110}, ${priceToY(140.09) - 10})`}>
              <rect
                width="72"
                height="20"
                rx="6"
                fill="#27111a"
                stroke="#ef4444"
                strokeWidth="1"
              />
              <text x="36" y="14" fill="#f87171" fontWeight="bold" fontSize="10" textAnchor="middle">
                SL 140.09
              </text>
            </g>

            {/* Interactive Crosshair if hovering */}
            {hoverCoord && (
              <g pointerEvents="none">
                <line
                  x1={leftPadding}
                  y1={hoverCoord.y}
                  x2={leftPadding + chartWidth}
                  y2={hoverCoord.y}
                  stroke="#38bdf8"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
                <line
                  x1={hoverCoord.x}
                  y1={topPadding}
                  x2={hoverCoord.x}
                  y2={topPadding + chartHeight}
                  stroke="#38bdf8"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              </g>
            )}

            {/* Right Price Scale */}
            <g transform={`translate(${leftPadding + chartWidth + 5}, 0)`}>
              {[146.00, 145.00, 144.00, 143.00, 142.00, 141.00, 140.00, 139.00].map((p) => (
                <text
                  key={p}
                  x="0"
                  y={priceToY(p) + 3}
                  fill="#64748b"
                  fontSize="10"
                >
                  {p.toFixed(2)}
                </text>
              ))}

              {/* Current Active Price Marker (142.68) */}
              <g transform={`translate(-4, ${priceToY(142.68) - 9})`}>
                <rect width="48" height="18" rx="4" fill="#00e5bf" />
                <text x="24" y="13" fill="#080d17" fontWeight="bold" fontSize="10" textAnchor="middle">
                  142.68
                </text>
              </g>
            </g>

            {/* Bottom Time Scale */}
            <g transform={`translate(0, ${topPadding + chartHeight + 18})`}>
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time, idx) => (
                <text
                  key={time}
                  x={70 + idx * 88}
                  y="0"
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {time}
                </text>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
