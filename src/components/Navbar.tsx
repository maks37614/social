import React from 'react';
import { 
  Zap, 
  Search, 
  Bell, 
  PlusCircle, 
  TrendingUp, 
  Layers, 
  ChevronDown,
  ShieldCheck,
  Flame,
  Radio
} from 'lucide-react';
import { TraderProfile, ScreenerCoin } from '../types';
import { formatCryptoPrice } from '../utils/formatters';

interface NavbarProps {
  currentProfile: TraderProfile;
  allProfiles: TraderProfile[];
  onSelectProfile: (profile: TraderProfile) => void;
  onOpenCreatePost: () => void;
  coins: ScreenerCoin[];
  onSelectCoinToScreener: (coin: ScreenerCoin) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProfile,
  allProfiles,
  onSelectProfile,
  onOpenCreatePost,
  coins,
  onSelectCoinToScreener,
  searchQuery,
  onSearchChange,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Real-time Screener Ticker Tape */}
      <div className="bg-[#060910] border-b border-slate-800/80 px-4 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-wider shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>H00K LIVE:</span>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          {coins.slice(0, 6).map((c) => (
            <button
              key={c.symbol}
              onClick={() => onSelectCoinToScreener(c)}
              className="flex items-center gap-2 hover:bg-slate-800/60 px-2 py-0.5 rounded transition cursor-pointer"
              title="Натисніть для перегляду в скрінері"
            >
              <span className="font-semibold text-slate-200">{c.baseAsset}</span>
              <span className="text-slate-400">${formatCryptoPrice(c.price)}</span>
              <span
                className={`font-semibold ${
                  c.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {c.change24h >= 0 ? '+' : ''}{c.change24h}%
              </span>
              {c.bidDensity && (
                <span className="bg-emerald-950/80 text-emerald-300 text-[10px] px-1 rounded border border-emerald-800/60">
                  ${(c.bidDensity.amountUsd / 1000).toFixed(0)}k bid
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <span className="font-black text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  h00k
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">h00k</span>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/30">
                  SOCIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Трейдерська мережа & скрінер
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Пошук трейдерів, сетапів ($SOL, $BTC), статей..."
              className="w-full bg-slate-900/90 text-sm text-slate-200 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Right Action Icons & User Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Новий пост / Сетап</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition relative cursor-pointer"
              aria-label="Сповіщення"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#090d16]"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300">Сповіщення h00k</span>
                  <span className="text-[10px] text-cyan-400 cursor-pointer">Прочитано</span>
                </div>
                <div className="space-y-2.5 mt-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer">
                    <p className="text-slate-200">
                      <strong className="text-cyan-400">@maks_h00k</strong> опублікував новий сетап на стіні по <span className="text-emerald-400">$SOL</span>
                    </p>
                    <span className="text-[10px] text-slate-500">12 хв тому</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer">
                    <p className="text-slate-200">
                      <strong className="text-cyan-400">@olena_flow</strong> вподобала ваш коментар до угоди
                    </p>
                    <span className="text-[10px] text-slate-500">35 хв тому</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
                    <p className="font-semibold">⚡ Алерт скрінера: Плотність $4.8M по BTC на 93,500$</p>
                    <span className="text-[10px] text-emerald-500">1 год тому</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#090d16]"></span>
              </div>
              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-200 leading-tight max-w-[110px] truncate">
                    {currentProfile.name}
                  </span>
                  {currentProfile.isVerified && (
                    <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-medium block">
                  {currentProfile.stats.pnl30dPercent >= 0 ? '+' : ''}{currentProfile.stats.pnl30dPercent}% PnL
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Перемкнути активного трейдера:
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {allProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProfile(p);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                        p.id === currentProfile.id
                          ? 'bg-cyan-500/10 border border-cyan-500/30'
                          : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-200">{p.name}</span>
                            {p.id === 'user_maks' && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-mono">
                                DEV
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">@{p.handle}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        +{p.stats.pnl30dPercent}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
