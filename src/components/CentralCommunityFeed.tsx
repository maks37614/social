import React, { useState } from 'react';
import { 
  Layers, 
  Lightbulb, 
  BarChart2, 
  BookOpen, 
  ChevronDown, 
  Image as ImageIcon, 
  Globe, 
  MoreHorizontal, 
  ThumbsUp, 
  Flame, 
  Target, 
  MessageCircle, 
  Repeat, 
  Share2, 
  Bookmark,
  Send,
  Check
} from 'lucide-react';
import { HookChartEmbed } from './HookChartEmbed';

export type FeedTab = 'feed' | 'ideas' | 'analysis' | 'education';

interface CommentItem {
  id: string;
  author: string;
  time: string;
  text: string;
}

export const CentralCommunityFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>('feed');
  const [sortOption, setSortOption] = useState<'Найновіші' | 'Популярні' | 'Топ PnL'>('Найновіші');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Post composer state
  const [composerText, setComposerText] = useState('');

  // Reactions state for main TradingAtlas post
  const [thumbsCount, setThumbsCount] = useState(58);
  const [hasThumbs, setHasThumbs] = useState(true);

  const [flameCount, setFlameCount] = useState(12);
  const [hasFlame, setHasFlame] = useState(false);

  const [targetCount, setTargetCount] = useState(6);
  const [hasTarget, setHasTarget] = useState(false);

  // Social actions
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [commentsList, setCommentsList] = useState<CommentItem[]>([
    {
      id: 'c1',
      author: 'OrderFlow_Pro',
      time: '42 хв тому',
      text: 'Повністю згоден з 0.618 Fib. У стакані на 142.10$ якраз бачу підтримку айсберга на 45,000 SOL. Гарний сетап!',
    },
    {
      id: 'c2',
      author: 'ScalpMaster_UA',
      time: '35 хв тому',
      text: 'Чи плануєш фіксувати 50% обʼєму на 1.000 (144.20), чи триматимеш до 1.272?',
    },
    {
      id: 'c3',
      author: 'TradingAtlas (Автор)',
      time: '28 хв тому',
      text: 'Так, перше часткове закриття на 144.20$ з переводом стопа в безубиток, залишок до 145.80$.',
    },
  ]);

  const toggleThumbs = () => {
    setThumbsCount(hasThumbs ? thumbsCount - 1 : thumbsCount + 1);
    setHasThumbs(!hasThumbs);
  };

  const toggleFlame = () => {
    setFlameCount(hasFlame ? flameCount - 1 : flameCount + 1);
    setHasFlame(!hasFlame);
  };

  const toggleTarget = () => {
    setTargetCount(hasTarget ? targetCount - 1 : targetCount + 1);
    setHasTarget(!hasTarget);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentsList([
      ...commentsList,
      {
        id: `c_${Date.now()}`,
        author: 'Трейдер (Ви)',
        time: 'Щойно',
        text: newComment.trim(),
      },
    ]);
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="flex-1 min-w-0 space-y-3.5">
      {/* 1. Header Filter Bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_14px_rgba(0,229,191,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-[#121c2c]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Стіна (Стрічка)</span>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ideas'
                ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_14px_rgba(0,229,191,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-[#121c2c]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Ідеї</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'analysis'
                ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_14px_rgba(0,229,191,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-[#121c2c]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Аналіз</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'education'
                ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_14px_rgba(0,229,191,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-[#121c2c]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Навчання</span>
          </button>
        </div>

        {/* Sort Filter Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 bg-[#0e1625] hover:bg-[#142033] border border-[#1b283d] px-3 py-1.5 rounded-xl text-xs text-slate-300 font-medium transition cursor-pointer"
          >
            <span>{sortOption}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#0d1626] border border-[#22334f] rounded-xl shadow-2xl p-1 z-30 text-xs space-y-0.5">
              {(['Найновіші', 'Популярні', 'Топ PnL'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSortOption(opt);
                    setSortDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#16243b] text-slate-200 transition cursor-pointer text-[11px]"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Post Composer Box */}
      <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-3 sm:p-3.5 shadow-xl flex items-center gap-3">
        {/* User mini hoodie avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#162740] to-[#0a111c] border border-[#00e5bf]/50 p-0.5 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <path d="M14 58 C16 42 22 36 32 36 C42 36 48 42 50 58 Z" fill="#132035" />
            <path d="M22 28 C22 17 26 12 32 12 C38 12 42 17 42 28 Z" fill="#182740" />
            <path d="M12 48 L26 36 L34 42 L48 24" stroke="#00e5bf" strokeWidth="3" fill="none" />
          </svg>
        </div>

        <input
          type="text"
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          placeholder="Поділитися ідеєю, аналізом або результатом..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />

        <div className="flex items-center gap-2 shrink-0">
          <button 
            className="p-1.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Прикріпити зображення / графік"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (composerText.trim()) {
                alert(`Ідею успішно опубліковано у стрічці!`);
                setComposerText('');
              }
            }}
            className="bg-[#00e5bf] hover:bg-[#00ffd4] text-[#080d17] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-[0_0_12px_rgba(0,229,191,0.25)] transition cursor-pointer"
          >
            Опублікувати
          </button>
        </div>
      </div>

      {/* 3. Primary TradingAtlas SOLUSDT Post Card */}
      <article className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        {/* Post Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#162740] to-[#0a111c] border border-[#00e5bf]/60 p-0.5 shadow-[0_0_12px_rgba(0,229,191,0.2)] shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path d="M14 58 C16 42 22 36 32 36 C42 36 48 42 50 58 Z" fill="#132035" />
                <path d="M22 28 C22 17 26 12 32 12 C38 12 42 17 42 28 Z" fill="#182740" />
                <path d="M12 48 L26 36 L34 42 L48 24" stroke="#00e5bf" strokeWidth="3" fill="none" />
                <polygon points="48,20 44,28 52,26" fill="#00e5bf" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">TradingAtlas</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>52 хв тому</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Category badge */}
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a2228] border border-[#00e5bf]/40 text-[#00e5bf] text-[11px] font-semibold">
              <Lightbulb className="w-3 h-3" />
              <span>Ідея</span>
            </span>

            <button className="text-slate-400 hover:text-white p-1 cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post Title & Text */}
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
            SOLUSDT — сценарій на продовження руху в межах висхідного каналу
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans">
            Після корекції до трендової та зони 0.618 очікую продовження зростання. План: вхід від зони підтримки, цілі — 1.272, стоп — за локальний мінімум.
          </p>
        </div>

        {/* Post Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Solana tag with logo icon */}
          <span className="flex items-center gap-1.5 bg-[#0a101b] border border-[#1d2b42] px-2.5 py-1 rounded-lg text-slate-200 font-mono text-[11px]">
            <span className="text-[#a855f7] font-bold">≡</span>
            <span className="font-bold">SOLUSDT</span>
          </span>

          <span className="bg-[#0a101b] border border-[#1d2b42] px-2.5 py-1 rounded-lg text-slate-300 font-mono text-[11px]">
            5m
          </span>

          <span className="flex items-center gap-1.5 bg-[#0a101b] border border-[#1d2b42] px-2.5 py-1 rounded-lg text-slate-300 text-[11px]">
            <span>🇬🇧</span>
            <span>London</span>
          </span>

          <span className="flex items-center gap-1.5 bg-[#0a101b] border border-[#1d2b42] px-2.5 py-1 rounded-lg text-slate-300 text-[11px]">
            <span>🇺🇸</span>
            <span>New York</span>
          </span>
        </div>

        {/* Embedded Interactive HookChart */}
        <HookChartEmbed />

        {/* Reactions Row (thumbs, flame, target) */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={toggleThumbs}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              hasThumbs
                ? 'bg-[#00e5bf]/15 text-[#00e5bf] border border-[#00e5bf]/40'
                : 'bg-[#0a101b] text-slate-400 border border-[#1c2a41] hover:text-white'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 fill-current" />
            <span>{thumbsCount}</span>
          </button>

          <button
            onClick={toggleFlame}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              hasFlame
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-[#0a101b] text-slate-400 border border-[#1c2a41] hover:text-white'
            }`}
          >
            <span className="text-xs">🔥</span>
            <span>{flameCount}</span>
          </button>

          <button
            onClick={toggleTarget}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              hasTarget
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'bg-[#0a101b] text-slate-400 border border-[#1c2a41] hover:text-white'
            }`}
          >
            <span className="text-xs">🎯</span>
            <span>{targetCount}</span>
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#18253b] text-xs text-slate-400">
          <button
            onClick={() => setCommentsOpen(!commentsOpen)}
            className={`flex items-center gap-1.5 hover:text-white transition cursor-pointer ${
              commentsOpen ? 'text-[#00e5bf]' : ''
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Коментарі ({commentsList.length})</span>
          </button>

          <button className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
            <Repeat className="w-4 h-4" />
            <span>Репост (5)</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            {copiedShare ? <Check className="w-4 h-4 text-[#00e5bf]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Скопійовано' : 'Поділитися'}</span>
          </button>

          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-1.5 hover:text-white transition cursor-pointer ${
              isSaved ? 'text-amber-400' : ''
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            <span>Зберегти</span>
          </button>
        </div>

        {/* Expandable Comments Drawer */}
        {commentsOpen && (
          <div className="pt-3 border-t border-[#18253b] space-y-3">
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {commentsList.map((c) => (
                <div key={c.id} className="bg-[#090f1a] p-2.5 rounded-xl border border-[#19273f] text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                    <span className="text-[#00e5bf]">{c.author}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Залишити коментар або розбір точки входу..."
                className="flex-1 bg-[#090f1a] text-xs text-slate-200 px-3 py-2 rounded-xl border border-[#1c2c47] focus:outline-none focus:border-[#00e5bf]"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-[#00e5bf] hover:bg-[#00ffd4] disabled:opacity-40 text-[#080d17] font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </article>
    </div>
  );
};
