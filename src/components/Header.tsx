import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  User, 
  Bell,
  MessageSquare,
  Flame,
  BookOpen,
  Server
} from 'lucide-react';

export type MainNavSection = 
  | 'community' 
  | 'feed' 
  | 'messages' 
  | 'screener' 
  | 'hookchart' 
  | 'articles' 
  | 'profile' 
  | 'vps';

interface HeaderProps {
  activeSection: MainNavSection;
  onSelectSection: (section: MainNavSection) => void;
  unreadNotifications?: boolean;
  unreadMessagesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  unreadNotifications = true,
  unreadMessagesCount = 3,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080d17]/95 backdrop-blur-md border-b border-[#172338] px-3 sm:px-4 lg:px-7 py-2 sm:py-2.5">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 overflow-x-auto no-scrollbar">
          <div 
            onClick={() => onSelectSection('community')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
            title="Головна Community"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
              h<span className="text-[#00e5bf]">00</span>k
            </span>
            <span className="px-2 py-0.5 rounded-full border border-[#00e5bf]/70 text-[#00e5bf] text-[10px] sm:text-xs font-semibold tracking-wide bg-[#00e5bf]/10 shadow-[0_0_12px_rgba(0,229,191,0.2)]">
              Community
            </span>
          </div>

          <div className="h-5 w-[1px] bg-[#1e2d47] shrink-0 hidden xs:block" />

          {/* Navigation Items (Responsive across all screens) */}
          <nav className="flex items-center gap-1 shrink-0">
            {/* 1. Community Hub (From concept screenshot) */}
            <button
              onClick={() => onSelectSection('community')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeSection === 'community'
                  ? 'bg-gradient-to-r from-[#00bda0] to-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_16px_rgba(0,229,191,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#131d2e]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Social · Community</span>
            </button>

            {/* 2. Стрічка трейдерів (Social Wall & Trades) */}
            <button
              onClick={() => onSelectSection('feed')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 ${
                activeSection === 'feed'
                  ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_15px_rgba(0,229,191,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#131d2e]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Стрічка</span>
            </button>

            {/* 3. Повідомлення & Чати (Messages & Signal Rooms) */}
            <button
              onClick={() => onSelectSection('messages')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 relative ${
                activeSection === 'messages'
                  ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_15px_rgba(0,229,191,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#131d2e]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Повідомлення</span>
              {unreadMessagesCount > 0 && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeSection === 'messages' ? 'bg-[#080d17] text-[#00e5bf]' : 'bg-[#00e5bf] text-[#080d17]'
                }`}>
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* 4. Скрінер плотностей h00k */}
            <button
              onClick={() => onSelectSection('screener')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 ${
                activeSection === 'screener'
                  ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_15px_rgba(0,229,191,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#131d2e]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Скрінер</span>
            </button>

            {/* 5. HookChart */}
            <button
              onClick={() => onSelectSection('hookchart')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 ${
                activeSection === 'hookchart'
                  ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_15px_rgba(0,229,191,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#131d2e]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>HookChart</span>
            </button>

            {/* 6. Статті */}
            <button
              onClick={() => onSelectSection('articles')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 ${
                activeSection === 'articles'
                  ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_15px_rgba(0,229,191,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#131d2e]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Статті</span>
            </button>

            {/* 7. Профіль */}
            <button
              onClick={() => onSelectSection('profile')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 ${
                activeSection === 'profile'
                  ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_15px_rgba(0,229,191,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#131d2e]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>Профіль</span>
            </button>

            {/* 8. VPS Калькулятор */}
            <button
              onClick={() => onSelectSection('vps')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition cursor-pointer shrink-0 ${
                activeSection === 'vps'
                  ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_15px_rgba(0,229,191,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#131d2e]'
              }`}
              title="Калькулятор навантаження на VPS"
            >
              <Server className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VPS</span>
            </button>
          </nav>
        </div>

        {/* Right Action: Messages Shortcut, Notifications & Profile Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Chat Shortcut Button */}
          <button
            onClick={() => onSelectSection('messages')}
            aria-label="Повідомлення"
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#131d2e] transition cursor-pointer"
            title="Відкрити чати та повідомлення"
          >
            <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 text-[#00e5bf]" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00e5bf] ring-2 ring-[#080d17] shadow-[0_0_8px_#00e5bf]" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            aria-label="Сповіщення"
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#131d2e] transition cursor-pointer"
          >
            <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
            {unreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#080d17] shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
          </button>

          {/* User mini badge: TradingAtlas */}
          <button
            onClick={() => onSelectSection('profile')}
            className="flex items-center gap-1.5 bg-[#0e1625] hover:bg-[#162238] border border-[#1b283d] pl-1.5 pr-2.5 py-1 rounded-xl text-xs transition cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#18263f] border border-[#00e5bf]/60 flex items-center justify-center text-[10px]">
              👤
            </div>
            <span className="font-bold text-white text-[11px] hidden sm:inline">TradingAtlas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
