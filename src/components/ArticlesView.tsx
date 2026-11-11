import React, { useState } from 'react';
import { 
  BookOpen, 
  Eye, 
  Heart, 
  Clock, 
  User, 
  ArrowLeft, 
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import { Article } from '../types';

interface ArticlesViewProps {
  articles: Article[];
  selectedArticle: Article | null;
  onSelectArticle: (article: Article | null) => void;
  onLikeArticle: (articleId: string) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  articles,
  selectedArticle,
  onSelectArticle,
  onLikeArticle,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (selectedArticle) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto">
        <button
          onClick={() => onSelectArticle(null)}
          className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад до списку статей</span>
        </button>

        {/* Cover */}
        <div className="h-64 sm:h-80 rounded-2xl overflow-hidden relative">
          <img
            src={selectedArticle.coverImage}
            alt={selectedArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {selectedArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-cyan-950/90 text-cyan-300 text-xs px-2.5 py-1 rounded-lg border border-cyan-800/80 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg font-mono">
              ⏱️ {selectedArticle.readTimeMinutes} хв читання
            </span>
          </div>
        </div>

        {/* Title & Author */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {selectedArticle.title}
          </h1>

          <div className="flex items-center justify-between py-3 border-y border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={selectedArticle.authorAvatar}
                alt={selectedArticle.authorName}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/40"
              />
              <div>
                <span className="font-bold text-slate-200 text-sm block">
                  {selectedArticle.authorName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  @{selectedArticle.authorHandle} • {selectedArticle.publishedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onLikeArticle(selectedArticle.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedArticle.isLiked
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-300 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${selectedArticle.isLiked ? 'fill-rose-400' : ''}`} />
                <span>{selectedArticle.likesCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                title="Поділитися"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="text-slate-300 leading-relaxed space-y-4 text-sm sm:text-base whitespace-pre-wrap font-sans">
          {selectedArticle.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0a1526] via-[#10203a] to-[#0a1526] border border-cyan-900/60 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-1">
          <BookOpen className="w-4 h-4" />
          <span>База знань & Досвід трейдерів</span>
        </div>
        <h1 className="text-2xl font-black text-white">
          Статті та практичні розбори від спільноти h00k
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Фундаментальні матеріали по скальпінгу стакана, поглинанню плотностей, кластерному аналізу та ризик-менеджменту.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {articles.map((art) => (
          <div
            key={art.id}
            onClick={() => onSelectArticle(art)}
            className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 shadow-xl cursor-pointer transition group space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-2xl overflow-hidden relative">
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
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {art.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-white group-hover:text-cyan-300 transition text-base leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <img
                  src={art.authorAvatar}
                  alt={art.authorName}
                  className="w-6 h-6 rounded-lg object-cover"
                />
                <span className="font-semibold text-slate-300 text-[11px]">
                  {art.authorName}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>👁️ {art.viewsCount}</span>
                <span className="text-rose-400">❤️ {art.likesCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
