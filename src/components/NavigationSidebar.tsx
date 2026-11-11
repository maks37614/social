import React from 'react';
import { 
  Flame, 
  User, 
  Activity, 
  MessageSquare, 
  BookOpen, 
  Server, 
  Users, 
  ExternalLink,
  Shield,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { TraderProfile } from '../types';

export type NavTab = 'feed' | 'profile' | 'screener' | 'chat' | 'articles' | 'vps_load';

interface NavigationSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  friends: TraderProfile[];
  onSelectFriendChat: (profile: TraderProfile) => void;
  unreadCount?: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onTabChange,
  friends,
  onSelectFriendChat,
  unreadCount = 2,
}) => {
  const navItems = [
    {
      id: 'feed' as NavTab,
      label: 'Стрічка трейдерів',
      desc: 'Пульс ринку, сетапи, угоди',
      icon: Flame,
      badge: null,
    },
    {
      id: 'profile' as NavTab,
      label: 'Мій профіль та стіна',
      desc: 'Заслуги, статистика, PnL',
      icon: User,
      badge: null,
    },
    {
      id: 'screener' as NavTab,
      label: 'Скрінер h00k',
      desc: 'Плотності стаканів онлайн',
      icon: Activity,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    },
    {
      id: 'chat' as NavTab,
      label: 'Чат & Друзі',
      desc: 'Особисті повідомлення, рум',
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: 'bg-cyan-500 text-slate-950 font-bold',
    },
    {
      id: 'articles' as NavTab,
      label: 'Статті та Аналітика',
      desc: 'Гайди по скальпінгу стакану',
      icon: BookOpen,
      badge: 'HOT',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'vps_load' as NavTab,
      label: 'Навантаження на VPS',
      desc: 'Оцінка ресурсів та архітектура',
      icon: Server,
      badge: 'Аналіз',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-4">
      {/* Navigation Buttons Card */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-3 shadow-xl space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Навігація мережі</span>
          <span className="text-[10px] text-cyan-400 font-mono">v2.4-social</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer text-left ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-emerald-500/10 border border-cyan-500/40 text-white font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium leading-snug">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Friends Online Quick List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Друзі онлайн ({friends.filter(f => f.status !== 'offline').length})</span>
          </div>
          <button 
            onClick={() => onTabChange('chat')}
            className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
          >
            Відкрити чат
          </button>
        </div>

        <div className="space-y-2">
          {friends.slice(0, 4).map((friend) => (
            <div
              key={friend.id}
              onClick={() => onSelectFriendChat(friend)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 cursor-pointer transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-slate-900 ${
                      friend.status === 'online'
                        ? 'bg-emerald-400'
                        : friend.status === 'in_trade'
                        ? 'bg-cyan-400 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                    {friend.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {friend.status === 'in_trade' ? '🟢 В угоді' : friend.status === 'online' ? 'В мережі' : 'Відійшов'}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400">
                +{friend.stats.pnl30dPercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Sentiment & Screener Link Card */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0a1120] border border-cyan-950/60 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Пульс Крипторинку</span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/40">
            h00k.top
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Fear & Greed</span>
            <span className="text-amber-400 font-bold text-sm">74 / 100</span>
            <span className="text-[9px] text-slate-500 block">Жадібність</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">BTC Домінація</span>
            <span className="text-cyan-400 font-bold text-sm">58.4%</span>
            <span className="text-[9px] text-emerald-400 block">+0.3% за 24г</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Скрінер стаканів & плотностей:</span>
          <a
            href="https://github.com/maks37614/h00k"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
