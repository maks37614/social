import React, { useState } from 'react';
import { 
  User,
  Settings, 
  Info, 
  X, 
  Globe, 
  Edit3, 
  Star, 
  BarChart, 
  Gift, 
  ChevronRight,
  ChevronDown,
  Check
} from 'lucide-react';

export interface TradingSession {
  id: string;
  name: string;
  countryFlag: string;
  hours: string;
}

interface LeftTraderSidebarProps {
  activeSessions: TradingSession[];
  onRemoveSession: (sessionId: string) => void;
  userPoints: number;
  receivedAwardsCount: number;
  giftedAwardsCount: number;
  onOpenAwardHistory?: () => void;
}

export const LeftTraderSidebar: React.FC<LeftTraderSidebarProps> = ({
  activeSessions,
  onRemoveSession,
  userPoints,
  receivedAwardsCount,
  giftedAwardsCount,
  onOpenAwardHistory,
}) => {
  const [status, setStatus] = useState('Аналізую ринок');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(
    'Скальпінг та внутрішньоденна торгівля (інтрадей). Працюю з ліквідністю, структурами та рівнями. Ділюся сценаріями, ідеями та спостереженнями.'
  );

  const availableStatuses = [
    'Аналізую ринок',
    'В лонгу SOL',
    'В шорті BTC',
    'Скальплю плотності',
    'Поза ринком / Відпочинок',
  ];

  return (
    <aside className="w-full md:w-[230px] lg:w-[280px] xl:w-[310px] shrink-0 space-y-3.5 md:sticky md:top-[68px]">
      {/* Profile Main Card */}
      <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3.5 sm:space-y-4">
        {/* Profile Block Top Label */}
        <div className="flex items-center justify-between pb-2 border-b border-[#18253b] text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5 text-[#00e5bf]">
            <User className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[11px]">Блок профілю</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">TradingAtlas</span>
        </div>

        {/* Avatar, Name, Country & Status */}
        <div className="flex items-start gap-3.5">
          {/* Avatar with hoodie trader & teal trendline glow */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#162740] to-[#0a111c] border-2 border-[#00e5bf]/60 p-0.5 shadow-[0_0_15px_rgba(0,229,191,0.25)] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                {/* Dark silhouette with hoodie */}
                <path d="M14 58 C16 42 22 36 32 36 C42 36 48 42 50 58 Z" fill="#132035" />
                <path d="M22 28 C22 17 26 12 32 12 C38 12 42 17 42 28 C42 35 38 39 32 39 C26 39 22 35 22 28 Z" fill="#182740" />
                <path d="M25 26 C26 22 29 19 32 19 C35 19 38 22 39 26 C39 31 36 34 32 34 C28 34 25 31 25 26 Z" fill="#0d1624" />
                {/* Glowing upward trend arrow */}
                <path d="M12 48 L26 36 L34 42 L48 24" fill="none" stroke="#00e5bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="48,20 44,28 52,26" fill="#00e5bf" />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white truncate font-sans">
                TradingAtlas
              </h2>
              <button 
                className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                title="Налаштування профілю"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
              <span>🇵🇱</span>
              <span>Польща</span>
            </div>

            {/* Status Dropdown */}
            <div className="relative mt-2">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="w-full flex items-center justify-between gap-1.5 bg-[#0a101b] hover:bg-[#121c2d] border border-[#1f2e47] px-2.5 py-1 rounded-full text-[11px] text-slate-200 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[10px]">🔍</span>
                  <span className="truncate">{status}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {statusDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-[#0d1626] border border-[#22334f] rounded-xl shadow-2xl p-1 z-30 space-y-0.5 text-xs">
                  {availableStatuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatus(st);
                        setStatusDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#16243b] text-slate-200 flex items-center justify-between transition cursor-pointer text-[11px]"
                    >
                      <span>{st}</span>
                      {status === st && <Check className="w-3 h-3 text-[#00e5bf]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Trading Sessions */}
        <div className="space-y-2 pt-2 border-t border-[#18253b]">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Торгові сесії (активні)</span>
              <Info className="w-3 h-3 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            {activeSessions.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">Не вибрано жодної сесії</p>
            ) : (
              activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between bg-[#0a1f26] border border-[#00e5bf]/30 hover:border-[#00e5bf]/60 rounded-xl px-3 py-1.5 text-xs text-[#00e5bf] font-medium transition"
                >
                  <div className="flex items-center gap-2">
                    <span>{session.countryFlag}</span>
                    <span>{session.name}</span>
                    <span className="text-slate-400 text-[11px] font-mono">• {session.hours}</span>
                  </div>
                  <button
                    onClick={() => onRemoveSession(session.id)}
                    className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                    title="Видалити сесію"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Europe/Warsaw (UTC+1)</span>
            </div>
            <button className="text-slate-500 hover:text-slate-300 cursor-pointer">
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* About Me Section */}
        <div className="space-y-1.5 pt-2 border-t border-[#18253b]">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span>Про мене</span>
            <button 
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {isEditingBio ? (
            <div className="space-y-2">
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                rows={3}
                className="w-full bg-[#090f1a] text-xs text-slate-200 p-2 rounded-xl border border-[#1f2f4a] focus:outline-none focus:border-[#00e5bf]"
              />
              <button
                onClick={() => setIsEditingBio(false)}
                className="bg-[#00e5bf] text-[#080d17] font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Зберегти
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {bioText}
            </p>
          )}
        </div>

        {/* Community Stats */}
        <div className="space-y-2 pt-2 border-t border-[#18253b]">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Статистика в Community</span>
              <Info className="w-3 h-3 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {/* Balance */}
            <div className="flex items-center justify-between py-1 text-slate-300">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Баланс балів:</span>
              </div>
              <span className="text-base font-black text-[#00e5bf] font-mono">
                {userPoints}
              </span>
            </div>

            {/* Received awards */}
            <button
              onClick={onOpenAwardHistory}
              className="w-full flex items-center justify-between py-1 text-slate-300 hover:text-white cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <BarChart className="w-3.5 h-3.5 text-[#00e5bf]" />
                <span>Отримано нагород:</span>
                <span className="font-bold text-white font-mono">{receivedAwardsCount}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </button>

            {/* Gifted awards */}
            <button
              onClick={onOpenAwardHistory}
              className="w-full flex items-center justify-between py-1 text-slate-300 hover:text-white cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-[#00e5bf]" />
                <span>Подаровано нагород:</span>
                <span className="font-bold text-white font-mono">{giftedAwardsCount}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Achievements / Досягнення */}
        <div className="space-y-2.5 pt-2 border-t border-[#18253b]">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Досягнення</span>
              <Info className="w-3 h-3 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* 1. Golden wreath & crown */}
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#0a101b] border border-[#21304a] hover:border-amber-500/50 transition group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-amber-400/30 flex items-center justify-center text-amber-400 mb-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-400 stroke-amber-400">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-200 leading-tight">
                Активний учасник
              </span>
            </div>

            {/* 2. Blue lightning bolt */}
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#0a101b] border border-[#21304a] hover:border-cyan-500/50 transition group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600/30 via-blue-500/20 to-teal-400/30 flex items-center justify-center text-cyan-400 mb-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-cyan-400 stroke-cyan-400">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-200 leading-tight">
                Серійний трейдер
              </span>
            </div>

            {/* 3. Purple target */}
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#0a101b] border border-[#21304a] hover:border-purple-500/50 transition group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/30 via-fuchsia-500/20 to-pink-400/30 flex items-center justify-center text-purple-400 mb-1 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-purple-400 fill-none" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" fill="#a855f7" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-200 leading-tight">
                Аналітик ринку
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
