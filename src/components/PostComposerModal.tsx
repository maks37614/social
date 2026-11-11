import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  Sparkles, 
  Tag, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Post, TradeAttachment, TradeSide, TraderProfile } from '../types';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TraderProfile;
  targetWallProfile?: TraderProfile;
  onSubmitPost: (postData: Partial<Post>) => void;
  initialTicker?: string;
  initialDensityData?: {
    symbol: string;
    densityPrice: number;
    amountUsd: number;
    distancePercent: number;
    side: 'BID' | 'ASK';
  };
}

export const PostComposerModal: React.FC<PostComposerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetWallProfile,
  onSubmitPost,
  initialTicker,
  initialDensityData,
}) => {
  const [content, setContent] = useState('');
  const [includeTrade, setIncludeTrade] = useState(!!initialTicker || !!initialDensityData);
  const [ticker, setTicker] = useState(initialTicker || initialDensityData?.symbol || 'SOLUSDT');
  const [side, setSide] = useState<TradeSide>('LONG');
  const [leverage, setLeverage] = useState(20);
  const [entryPrice, setEntryPrice] = useState('184.50');
  const [exitPrice, setExitPrice] = useState('188.20');
  const [pnlPercent, setPnlPercent] = useState('40.1');
  const [pnlUsd, setPnlUsd] = useState('802');
  const [tradeStatus, setTradeStatus] = useState<'OPEN' | 'CLOSED'>('CLOSED');
  const [setupReason, setSetupReason] = useState(
    initialDensityData
      ? `Розʼїдання плотності $${(initialDensityData.amountUsd / 1000).toFixed(0)}k на $${initialDensityData.densityPrice} у скрінері h00k`
      : 'Пробій денного рівня опору на обʼємі'
  );
  const [formation, setFormation] = useState('Ascending Triangle');
  const [tags, setTags] = useState('SOL, Scalping, h00k');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !includeTrade) return;

    let tradeAttachment: TradeAttachment | undefined = undefined;

    if (includeTrade) {
      tradeAttachment = {
        ticker: ticker.toUpperCase(),
        side,
        entryPrice: parseFloat(entryPrice) || 0,
        exitPrice: tradeStatus === 'CLOSED' ? parseFloat(exitPrice) || undefined : undefined,
        currentPrice: parseFloat(exitPrice) || parseFloat(entryPrice) || 0,
        leverage,
        pnlPercent: parseFloat(pnlPercent) || 0,
        pnlUsd: parseFloat(pnlUsd) || 0,
        status: tradeStatus,
        setupReason,
        chartFormation: formation,
        timeframe: '5m',
      };
    }

    onSubmitPost({
      content: content.trim(),
      tags: tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
      tradeAttachment,
      screenerDensityRef: initialDensityData,
      wallProfileId: targetWallProfile ? targetWallProfile.id : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b101c] border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-cyan-500/50"
          />
          <div>
            <h3 className="font-extrabold text-lg text-white">
              {targetWallProfile && targetWallProfile.id !== currentUser.id
                ? `Пост на стіні @${targetWallProfile.handle}`
                : 'Створити пост або розбір угоди'}
            </h3>
            <p className="text-xs text-slate-400">
              Поділіться формацією, думкою про ринок або карткою PnL
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main textarea */}
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Опишіть ситуацію на ринку... Наприклад: помітив велику плотність у скрінері h00k по $SOL, планую лонг на розʼїданні..."
              className="w-full bg-slate-950 text-sm text-slate-100 p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 resize-none placeholder:text-slate-500"
            />
          </div>

          {/* Toggle Trade Attachment */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                <input
                  type="checkbox"
                  checked={includeTrade}
                  onChange={(e) => setIncludeTrade(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500/40 border-slate-700 bg-slate-950 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <TrendingUp className="w-4 h-4" />
                  Прикріпити картку угоди (PnL Card & Сетап)
                </span>
              </label>

              {includeTrade && (
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSide('LONG')}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold cursor-pointer transition ${
                      side === 'LONG'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide('SHORT')}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold cursor-pointer transition ${
                      side === 'SHORT'
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SHORT
                  </button>
                </div>
              )}
            </div>

            {includeTrade && (
              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Тикер</label>
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value)}
                      placeholder="SOLUSDT"
                      className="w-full bg-slate-950 font-mono text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Плече</label>
                    <input
                      type="number"
                      value={leverage}
                      onChange={(e) => setLeverage(Number(e.target.value))}
                      className="w-full bg-slate-950 font-mono text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">PnL (%)</label>
                    <input
                      type="text"
                      value={pnlPercent}
                      onChange={(e) => setPnlPercent(e.target.value)}
                      placeholder="+42.5"
                      className="w-full bg-slate-950 font-mono text-emerald-400 font-bold px-2.5 py-1.5 rounded-lg border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">PnL ($)</label>
                    <input
                      type="text"
                      value={pnlUsd}
                      onChange={(e) => setPnlUsd(e.target.value)}
                      placeholder="850"
                      className="w-full bg-slate-950 font-mono text-emerald-400 font-bold px-2.5 py-1.5 rounded-lg border border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Ціна входу</label>
                    <input
                      type="text"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      className="w-full bg-slate-950 font-mono text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Ціна виходу / поточна</label>
                    <input
                      type="text"
                      value={exitPrice}
                      onChange={(e) => setExitPrice(e.target.value)}
                      className="w-full bg-slate-950 font-mono text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Причина / Формація</label>
                  <input
                    type="text"
                    value={setupReason}
                    onChange={(e) => setSetupReason(e.target.value)}
                    placeholder="Наприклад: Пробій рівня з розʼїданням стіни 1.5M$"
                    className="w-full bg-slate-950 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Теги через кому: SOL, Scalping, h00k, PnL"
              className="flex-1 bg-slate-950 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              Опублікувати на стіні
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
