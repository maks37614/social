import React, { useState } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Target, 
  Users, 
  Sparkles, 
  PlusCircle, 
  Search,
  Filter
} from 'lucide-react';
import { Post, TraderProfile } from '../types';
import { PostCard } from './PostCard';

interface MainFeedProps {
  posts: Post[];
  currentUser: TraderProfile;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenCreatePost: () => void;
  onShareToChat?: (post: Post) => void;
  onOpenTraderProfile: (traderId: string) => void;
  searchQuery: string;
}

export const MainFeed: React.FC<MainFeedProps> = ({
  posts,
  currentUser,
  onLikePost,
  onAddComment,
  onOpenCreatePost,
  onShareToChat,
  onOpenTraderProfile,
  searchQuery,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'trades' | 'formations' | 'friends'>('all');

  const filteredPosts = posts.filter((post) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q) || post.authorHandle.toLowerCase().includes(q);
      const matchTicker = post.tradeAttachment?.ticker.toLowerCase().includes(q);
      const matchTag = post.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchContent && !matchAuthor && !matchTicker && !matchTag) return false;
    }

    if (activeFilter === 'trades') {
      return !!post.tradeAttachment;
    }
    if (activeFilter === 'formations') {
      return post.tradeAttachment?.chartFormation || post.screenerDensityRef;
    }
    if (activeFilter === 'friends') {
      return post.authorId === 'user_maks' || post.authorId === 'user_olena';
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Quick Composer Card at the top of feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/40"
          />
          <button
            onClick={onOpenCreatePost}
            className="flex-1 text-left bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs sm:text-sm transition cursor-pointer"
          >
            Що зараз бачите у стакані h00k? Поділіться угодою чи сетапом...
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="hidden sm:inline">Швидкі теги:</span>
            <button
              onClick={onOpenCreatePost}
              className="bg-slate-800/80 hover:bg-slate-800 hover:text-cyan-400 px-2 py-0.5 rounded cursor-pointer transition"
            >
              $SOL
            </button>
            <button
              onClick={onOpenCreatePost}
              className="bg-slate-800/80 hover:bg-slate-800 hover:text-cyan-400 px-2 py-0.5 rounded cursor-pointer transition"
            >
              $BTC
            </button>
            <button
              onClick={onOpenCreatePost}
              className="bg-slate-800/80 hover:bg-slate-800 hover:text-emerald-400 px-2 py-0.5 rounded cursor-pointer transition"
            >
              #Плотність
            </button>
          </div>

          <button
            onClick={onOpenCreatePost}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Опублікувати</span>
          </button>
        </div>
      </div>

      {/* Feed Filters Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Вся стрічка ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('trades')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeFilter === 'trades'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Тільки угоди & PnL</span>
        </button>

        <button
          onClick={() => setActiveFilter('formations')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeFilter === 'formations'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Формації & Стакани</span>
        </button>

        <button
          onClick={() => setActiveFilter('friends')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeFilter === 'friends'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Від друзів</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              Не знайдено постів за вибраним фільтром
            </p>
            <p className="text-xs text-slate-500">
              Спробуйте скинути фільтр або створіть перший розбір ситуації на ринку!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUser.id}
              onLike={onLikePost}
              onAddComment={onAddComment}
              onShareToChat={onShareToChat}
              onOpenTraderProfile={onOpenTraderProfile}
            />
          ))
        )}
      </div>
    </div>
  );
};
