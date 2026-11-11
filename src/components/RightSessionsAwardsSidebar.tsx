import React, { useState } from 'react';
import { 
  Info, 
  Calendar, 
  Gift, 
  Check, 
  ChevronRight, 
  Star,
  Award
} from 'lucide-react';
import { TradingSession } from './LeftTraderSidebar';

export interface AwardItem {
  id: string;
  name: string;
  cost: number;
  iconType: 'cup' | 'star' | 'wreath';
}

interface RightSessionsAwardsSidebarProps {
  availableSessions: TradingSession[];
  activeSessionIds: string[];
  onToggleSession: (sessionId: string) => void;
  userPoints: number;
  onGiftAward: (award: AwardItem) => void;
}

export const RightSessionsAwardsSidebar: React.FC<RightSessionsAwardsSidebarProps> = ({
  availableSessions,
  activeSessionIds,
  onToggleSession,
  userPoints,
  onGiftAward,
}) => {
  const [selectedAwardId, setSelectedAwardId] = useState<string>('analysis');
  const [justGifted, setJustGifted] = useState(false);

  const awards: AwardItem[] = [
    {
      id: 'thanks',
      name: 'Подяка',
      cost: 20,
      iconType: 'cup',
    },
    {
      id: 'analysis',
      name: 'Крутий аналіз',
      cost: 50,
      iconType: 'star',
    },
    {
      id: 'top_trader',
      name: 'Топ трейдер',
      cost: 50,
      iconType: 'wreath',
    },
  ];

  const handleGiftClick = () => {
    const selected = awards.find((a) => a.id === selectedAwardId) || awards[0];
    onGiftAward(selected);
    setJustGifted(true);
    setTimeout(() => setJustGifted(false), 2200);
  };

  return (
    <aside className="w-full md:w-[230px] lg:w-[280px] xl:w-[310px] shrink-0 space-y-3.5 md:sticky md:top-[68px]">
      {/* 1. Мої торгові сесії Card */}
      <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-white font-bold">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00e5bf]" />
            <span className="text-sm font-extrabold text-white">Мої торгові сесії</span>
          </div>
          <Info className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Оберіть сесії, в яких переважно торгуєте. Час відображається у вашій часовій зоні Europe/Warsaw (UTC+1).
        </p>

        {/* Sessions checklist */}
        <div className="space-y-1.5 pt-1">
          {availableSessions.map((session) => {
            const isChecked = activeSessionIds.includes(session.id);
            return (
              <div
                key={session.id}
                onClick={() => onToggleSession(session.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer select-none ${
                  isChecked
                    ? 'bg-[#091826] border-[#00e5bf]/40'
                    : 'bg-[#0a101b] border-[#1b283d] hover:border-[#2a3c59]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Custom Checkbox */}
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition ${
                      isChecked
                        ? 'bg-[#00e5bf] text-[#080d17]'
                        : 'border border-[#283b57] bg-[#0c1422]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <span className="text-sm">{session.countryFlag}</span>
                  <span className="text-xs font-semibold text-slate-200">{session.name}</span>
                </div>

                <span className="text-[11px] font-mono text-slate-400">{session.hours}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Нагороди трейдерів Card */}
      <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-4 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between text-xs text-white font-bold">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#00e5bf]" />
            <span className="text-sm font-extrabold text-white">Нагороди трейдерів</span>
          </div>
          <Info className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Подякуйте трейдеру за корисний аналіз, ідею, освітній контент або активність у спільноті. Нагорода списується з вашого балансу балів.
        </p>

        {/* 3 Awards Cards Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Award 1: Cup */}
          <div
            onClick={() => setSelectedAwardId('thanks')}
            className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition cursor-pointer text-center relative ${
              selectedAwardId === 'thanks'
                ? 'bg-[#121c2c] border-[#00e5bf] shadow-[0_0_12px_rgba(0,229,191,0.2)]'
                : 'bg-[#0a101b] border-[#1c293f] hover:border-[#2b3e5e]'
            }`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center my-1">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
              </svg>
            </div>
            <span className="text-[11px] font-bold text-white mt-1">Подяка</span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold mt-0.5">20 балів</span>
          </div>

          {/* Award 2: Star */}
          <div
            onClick={() => setSelectedAwardId('analysis')}
            className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition cursor-pointer text-center relative ${
              selectedAwardId === 'analysis'
                ? 'bg-[#121c2c] border-[#00e5bf] shadow-[0_0_12px_rgba(0,229,191,0.2)]'
                : 'bg-[#0a101b] border-[#1c293f] hover:border-[#2b3e5e]'
            }`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center my-1">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-amber-300 drop-shadow-[0_2px_8px_rgba(252,211,77,0.5)]">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span className="text-[11px] font-bold text-white mt-1 leading-tight">Крутий аналіз</span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold mt-0.5">50 балів</span>
          </div>

          {/* Award 3: Wreath */}
          <div
            onClick={() => setSelectedAwardId('top_trader')}
            className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition cursor-pointer text-center relative ${
              selectedAwardId === 'top_trader'
                ? 'bg-[#121c2c] border-[#00e5bf] shadow-[0_0_12px_rgba(0,229,191,0.2)]'
                : 'bg-[#0a101b] border-[#1c293f] hover:border-[#2b3e5e]'
            }`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center my-1">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                <path d="M5.5 13.5 C4.5 11.5 5 8.5 7 7 M18.5 13.5 C19.5 11.5 19 8.5 17 7" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[11px] font-bold text-white mt-1 leading-tight">Топ трейдер</span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold mt-0.5">50 балів</span>
          </div>
        </div>

        {/* Gift Button */}
        <button
          onClick={handleGiftClick}
          className="w-full bg-[#00e5bf] hover:bg-[#00ffd4] text-[#080d17] font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,229,191,0.3)] transition cursor-pointer"
        >
          <Gift className="w-4 h-4 stroke-[2.5]" />
          <span>{justGifted ? 'Нагороду надіслано!' : 'Подарувати'}</span>
        </button>

        {/* User Balance Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-[#18253b] text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Ваш баланс балів:</span>
            <span className="font-bold text-[#00e5bf] font-mono">{userPoints}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-pointer" />
        </div>
      </div>

      {/* Concept Disclaimer */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1 pt-1">
        <Info className="w-3.5 h-3.5 shrink-0 text-slate-600" />
        <span>Концепт інтерфейсу — не поточна версія hOOK.</span>
      </div>
    </aside>
  );
};
