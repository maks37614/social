import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  UserCheck, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Flame, 
  MapPin, 
  Calendar, 
  Layers, 
  Share2, 
  Sparkles,
  Crown,
  Target,
  Eye,
  Zap,
  HeartHandshake
} from 'lucide-react';
import { TraderProfile, Post, Article } from '../types';
import { PostCard } from './PostCard';

interface TraderProfileViewProps {
  profile: TraderProfile;
  currentUser: TraderProfile;
  wallPosts: Post[];
  articles: Article[];
  onToggleFriend: (profileId: string) => void;
  onOpenDirectChat: (profile: TraderProfile) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenCreatePostOnWall: (profile: TraderProfile) => void;
  onSelectArticle: (article: Article) => void;
}

export const TraderProfileView: React.FC<TraderProfileViewProps> = ({
  profile,
  currentUser,
  wallPosts,
  articles,
  onToggleFriend,
  onOpenDirectChat,
  onLikePost,
  onAddComment,
  onOpenCreatePostOnWall,
  onSelectArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'wall' | 'articles' | 'stats' | 'friends'>('wall');

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown': return <Crown className="w-4 h-4 text-amber-400" />;
      case 'Target': return <Target className="w-4 h-4 text-rose-400" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Eye': return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-pink-400" />;
      default: return <Award className="w-4 h-4 text-cyan-400" />;
    }
  };

  const isMe = profile.id === currentUser.id;

  return (
    <div className="space-y-6">
      {/* Profile Header Banner & Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="h-40 sm:h-52 w-full relative bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 overflow-hidden">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Profile Cover"
              className="w-full h-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          
          {/* Status badge in banner */}
          <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-2 text-xs font-mono">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                profile.status === 'in_trade'
                  ? 'bg-cyan-400 animate-pulse'
                  : profile.status === 'online'
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-200">
              {profile.status === 'in_trade' ? '🟢 В угоді (Scalping)' : profile.status === 'online' ? 'В мережі' : 'Відійшов'}
            </span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-slate-900 shadow-2xl bg-slate-800"
                />
                {profile.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1.5 rounded-xl shadow-lg"
                    title="Верифікований трейдер біржі"
                  >
                    <ShieldCheck className="w-4 h-4 font-bold" />
                  </div>
                )}
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h1>
                  {profile.id === 'user_maks' && (
                    <span className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-cyan-500/30">
                      CREATOR h00k
                    </span>
                  )}
                </div>
                <p className="text-sm text-cyan-400 font-mono">@{profile.handle}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {profile.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    З нами з {profile.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Add friend / Message */}
            <div className="flex items-center gap-2.5">
              {!isMe && (
                <>
                  <button
                    onClick={() => onToggleFriend(profile.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      profile.isFriend
                        ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:opacity-90'
                    }`}
                  >
                    {profile.isFriend ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>У друзях</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Додати в друзі</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenDirectChat(profile)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Повідомлення</span>
                  </button>
                </>
              )}

              {isMe && (
                <button
                  onClick={() => onOpenCreatePostOnWall(profile)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Написати на своїй стіні</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio text */}
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl pt-2">
            {profile.bio}
          </p>

          {/* Current activity snippet */}
          {profile.currentTradeSnippet && (
            <div className="mt-3 inline-flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="text-cyan-400 font-bold">Активний фокус:</span>
              <span>{profile.currentTradeSnippet}</span>
            </div>
          )}

          {/* Follower counts */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
            <div>
              <strong className="text-white text-sm">{profile.friendsCount}</strong>
              <span className="text-slate-400 ml-1.5">Друзів</span>
            </div>
            <div>
              <strong className="text-white text-sm">{profile.followersCount}</strong>
              <span className="text-slate-400 ml-1.5">Підписників</span>
            </div>
            <div>
              <strong className="text-white text-sm">{profile.tradesCount}</strong>
              <span className="text-slate-400 ml-1.5">Угод</span>
            </div>
            <div>
              <strong className="text-white text-sm">{profile.articlesCount}</strong>
              <span className="text-slate-400 ml-1.5">Статей</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trader Stats Grid (PnL, WinRate, R:R, Style) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Трейдерська статистика & Результати (30 днів)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {profile.stats.primaryExchange} • {profile.stats.tradingStyle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Win Rate</span>
            <span className="text-xl font-black text-emerald-400">
              {profile.stats.winRate}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">З 428 угод</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">PnL (30d)</span>
            <span className="text-xl font-black text-emerald-400">
              +{profile.stats.pnl30dPercent}%
            </span>
            <span className="text-[10px] text-emerald-500/80 block mt-0.5">
              +${profile.stats.pnl30dUsd.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Середній R:R</span>
            <span className="text-xl font-black text-cyan-400">
              1:{profile.stats.avgRR}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Ризик/Прибуток</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Profit Factor</span>
            <span className="text-xl font-black text-purple-400">
              {profile.stats.profitFactor}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Індекс стабільності</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Топ трейд</span>
            <span className="text-xl font-black text-amber-400">
              +{profile.stats.bestTradePercent}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">SOLUSDT</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Улюблені пари</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.stats.favoritePairs.map((pair) => (
                <span
                  key={pair}
                  className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                >
                  {pair.replace('USDT', '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badges / Заслуги Showcase */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Заслуги & Нагороди трейдера ({profile.badges.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Спільнота h00k</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {profile.badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border transition relative overflow-hidden group ${
                b.rarity === 'legendary'
                  ? 'bg-gradient-to-br from-amber-950/40 to-slate-950 border-amber-500/40 hover:border-amber-400'
                  : b.rarity === 'epic'
                  ? 'bg-gradient-to-br from-purple-950/40 to-slate-950 border-purple-500/40 hover:border-purple-400'
                  : 'bg-gradient-to-br from-cyan-950/40 to-slate-950 border-cyan-500/40 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                  {getBadgeIcon(b.icon)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    {b.title}
                  </h3>
                  <span
                    className={`text-[9px] uppercase font-mono font-bold tracking-wider ${
                      b.rarity === 'legendary'
                        ? 'text-amber-400'
                        : b.rarity === 'epic'
                        ? 'text-purple-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {b.rarity}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs navigation for Wall / Articles / Trades */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('wall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'wall'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Стіна профілю ({wallPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Статті та Розбори ({articles.filter(a => a.authorId === profile.id).length})</span>
        </button>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'wall' && (
        <div className="space-y-4">
          {/* Post to wall action box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-500/40"
              />
              <span className="text-xs text-slate-400">
                Залиште запитання, відгук або поділіться своїм сетапом на стіні @{profile.handle}
              </span>
            </div>
            <button
              onClick={() => onOpenCreatePostOnWall(profile)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
            >
              Написати на стіну
            </button>
          </div>

          {/* Wall Posts list */}
          {wallPosts.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-8 text-center text-slate-400 text-xs">
              На стіні ще немає записів. Будьте першим, хто напише повідомлення або поділиться угодою!
            </div>
          ) : (
            wallPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUser.id}
                onLike={onLikePost}
                onAddComment={onAddComment}
                onOpenTraderProfile={() => {}}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles
            .filter((a) => a.authorId === profile.id)
            .map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 shadow-xl cursor-pointer transition group space-y-3"
              >
                <div className="h-36 rounded-xl overflow-hidden relative">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-950/80 text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded backdrop-blur">
                    {art.readTimeMinutes} хв читання
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-cyan-300 transition line-clamp-2 text-sm sm:text-base">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  <span>{art.publishedDate}</span>
                  <div className="flex items-center gap-3">
                    <span>👁️ {art.viewsCount}</span>
                    <span>❤️ {art.likesCount}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
