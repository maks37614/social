import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat, 
  Bookmark, 
  Share2, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Send,
  Target,
  Sparkles,
  Check
} from 'lucide-react';
import { Post, Comment } from '../types';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onShareToChat?: (post: Post) => void;
  onOpenTraderProfile?: (traderId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onAddComment,
  onShareToChat,
  onOpenTraderProfile,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(post.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trade = post.tradeAttachment;

  return (
    <article className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg transition-all space-y-4">
      {/* Header: Author Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenTraderProfile?.(post.authorId)}
            className="relative cursor-pointer group shrink-0"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-11 h-11 rounded-xl object-cover ring-1 ring-cyan-500/30 group-hover:ring-cyan-400 transition"
            />
          </button>
          <div>
            <div className="flex items-center flex-wrap gap-1.5">
              <button
                onClick={() => onOpenTraderProfile?.(post.authorId)}
                className="font-bold text-slate-100 hover:text-cyan-400 transition cursor-pointer text-sm sm:text-base"
              >
                {post.authorName}
              </button>
              {post.authorVerified && (
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              {post.authorBadges?.map((b) => (
                <span
                  key={b}
                  className="text-[10px] bg-cyan-950/80 text-cyan-300 font-semibold px-1.5 py-0.5 rounded border border-cyan-800/60"
                >
                  {b}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono">@{post.authorHandle}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Screener Tag */}
        {post.screenerDensityRef && (
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-mono">
            <Target className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Плотність h00k: ${(post.screenerDensityRef.amountUsd / 1000).toFixed(0)}k</span>
          </div>
        )}
      </div>

      {/* Main Post Content */}
      <div className="text-slate-200 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line">
        {post.content.split(' ').map((word, i) => {
          if (word.startsWith('$')) {
            return (
              <span key={i} className="font-bold text-cyan-400 bg-cyan-950/40 px-1 py-0.5 rounded mr-1">
                {word}
              </span>
            );
          }
          if (word.startsWith('#')) {
            return (
              <span key={i} className="text-emerald-400 font-medium mr-1">
                {word}
              </span>
            );
          }
          return word + ' ';
        })}
      </div>

      {/* Attached Trade Card (PnL & Setup Breakdown) */}
      {trade && (
        <div className="bg-gradient-to-br from-[#0c1424] to-[#070b14] border border-cyan-950/80 rounded-2xl p-4 shadow-xl space-y-3 relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none ${
              trade.pnlPercent >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />

          {/* Trade Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg tracking-wider ${
                  trade.side === 'LONG'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                }`}
              >
                {trade.side === 'LONG' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {trade.side}
              </span>
              <span className="text-base font-extrabold text-white font-mono tracking-tight">
                {trade.ticker}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded font-mono">
                {trade.leverage}x
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {trade.timeframe}
              </span>
            </div>

            {/* Status pill */}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                trade.status === 'CLOSED'
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800 animate-pulse'
              }`}
            >
              {trade.status === 'CLOSED' ? 'ЗАКРИТО' : 'У ПОЗИЦІЇ'}
            </span>
          </div>

          {/* PnL Display & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">PnL (%)</span>
              <span
                className={`text-lg sm:text-xl font-black ${
                  trade.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent}%
              </span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">PnL ($)</span>
              <span
                className={`text-lg sm:text-xl font-bold ${
                  (trade.pnlUsd || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {(trade.pnlUsd || 0) >= 0 ? '+' : ''}${trade.pnlUsd?.toLocaleString() || '0'}
              </span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Вхід</span>
              <span className="text-sm sm:text-base font-semibold text-slate-200">
                ${trade.entryPrice}
              </span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">
                {trade.status === 'CLOSED' ? 'Вихід' : 'Поточна'}
              </span>
              <span className="text-sm sm:text-base font-semibold text-slate-200">
                ${trade.exitPrice || trade.currentPrice}
              </span>
            </div>
          </div>

          {/* Setup reasoning / formation */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
            <div>
              <span className="text-slate-500 font-semibold mr-1.5">Причина входу:</span>
              <span>{trade.setupReason}</span>
            </div>
            {trade.chartFormation && (
              <span className="bg-cyan-950 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-800/60 shrink-0">
                📐 {trade.chartFormation}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tags row */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-xs text-slate-400 bg-slate-800/50 hover:bg-slate-800 hover:text-cyan-400 px-2.5 py-0.5 rounded-lg transition cursor-pointer"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Social Actions Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-slate-400 text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
              post.isLiked
                ? 'text-rose-400 bg-rose-500/10'
                : 'hover:text-rose-400 hover:bg-slate-800/60'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${post.isLiked ? 'fill-rose-400' : ''}`}
            />
            <span className="font-mono text-xs">{post.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
              showComments
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'hover:text-cyan-400 hover:bg-slate-800/60'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-mono text-xs">{post.commentsCount}</span>
          </button>

          {/* Repost */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:text-emerald-400 hover:bg-slate-800/60 transition cursor-pointer">
            <Repeat className="w-4 h-4" />
            <span className="font-mono text-xs">{post.repostsCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Share to chat */}
          {onShareToChat && (
            <button
              onClick={() => onShareToChat(post)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:text-cyan-400 hover:bg-slate-800/60 transition text-xs cursor-pointer"
              title="Поділитися в чат трейдерів"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">В чат</span>
            </button>
          )}

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
            title="Скопіювати посилання"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            className={`p-2 rounded-xl transition cursor-pointer ${
              post.isSaved ? 'text-amber-400' : 'hover:text-amber-400 hover:bg-slate-800/60'
            }`}
            title="Зберегти в закладки"
          >
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="pt-3 border-t border-slate-800 space-y-3">
          {/* Existing comments */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-1">
                Поки що коментарів немає. Будьте першим, хто розбере цей сетап!
              </p>
            ) : (
              post.comments.map((c) => (
                <div key={c.id} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 flex items-start gap-2.5">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{c.authorName}</span>
                      <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New comment input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Напишіть вашу думку або коментар до угоди..."
              className="flex-1 bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500/60"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
            >
              Надіслати
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
