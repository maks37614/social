import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Target, 
  Share2, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Radio, 
  Layers, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { ScreenerCoin } from '../types';
import { formatCryptoPrice } from '../utils/formatters';

interface H00kScreenerPanelProps {
  coins: ScreenerCoin[];
  onShareCoinToFeed: (coin: ScreenerCoin, densitySide: 'BID' | 'ASK') => void;
  onShareCoinToChat: (coin: ScreenerCoin) => void;
}

export const H00kScreenerPanel: React.FC<H00kScreenerPanelProps> = ({
  coins,
  onShareCoinToFeed,
  onShareCoinToChat,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'DENSITY' | 'PUMP' | 'OI'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<ScreenerCoin>(coins[0] || null);

  const filteredCoins = coins.filter((c) => {
    const matchesSearch = c.symbol.toLowerCase().includes(search.toLowerCase()) ||
                          c.baseAsset.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'DENSITY') return !!(c.bidDensity || c.askDensity);
    if (filterType === 'PUMP') return c.change1h > 2 || c.change24h > 8;
    if (filterType === 'OI') return c.oiChange1h > 3;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner explaining h00k integration */}
      <div className="bg-gradient-to-r from-[#09152a] via-[#0b1c36] to-[#09152a] border border-cyan-900/60 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                h00k Orderbook Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Скрінер плотностей та каскадів ліквідності
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Усі плотності зі стаканів бірж у реальному часі. Ви можете в один клік поділитися будь-яким сетапом у стрічку трейдерів або відправити в чат друзям для спільного скальпінгу.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-slate-900/90 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700/80 font-mono">
              🟢 WebSocket: <span className="text-emerald-400">Підключено (100ms)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            Всі ринки ({coins.length})
          </button>
          <button
            onClick={() => setFilterType('DENSITY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'DENSITY'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Великі плотності (&gt;$500k)
          </button>
          <button
            onClick={() => setFilterType('PUMP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'PUMP'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Сплески волатильності
          </button>
          <button
            onClick={() => setFilterType('OI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'OI'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Приріст Open Interest (OI)
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук монети (SOL, BTC)..."
            className="w-full bg-slate-950 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Screener Table & Selected Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Screener Coins Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Монета</th>
                  <th className="p-3.5">Ціна ($)</th>
                  <th className="p-3.5">5м / 24г %</th>
                  <th className="p-3.5">Плотність BID (Покупці)</th>
                  <th className="p-3.5">Плотність ASK (Продавці)</th>
                  <th className="p-3.5 text-right">Дія</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredCoins.map((coin) => {
                  const isSelected = selectedCoin?.symbol === coin.symbol;
                  return (
                    <tr
                      key={coin.symbol}
                      onClick={() => setSelectedCoin(coin)}
                      className={`hover:bg-slate-800/50 transition cursor-pointer ${
                        isSelected ? 'bg-cyan-950/30 border-l-4 border-cyan-400' : ''
                      }`}
                    >
                      {/* Ticker & Signal */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">
                            {coin.baseAsset}
                          </span>
                          <span className="text-[10px] text-slate-500">USDT</span>
                          {coin.signal && (
                            <span className="bg-cyan-950 text-cyan-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-800/60">
                              {coin.signal === 'HIGH_DENSITY'
                                ? 'СТІНА'
                                : coin.signal === 'PUMP_ALERT'
                                ? 'PUMP'
                                : 'BREAKOUT'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 font-bold text-slate-200">
                        ${formatCryptoPrice(coin.price)}
                      </td>

                      {/* Changes */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={coin.change5m >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}
                          >
                            5m: {coin.change5m >= 0 ? '+' : ''}{coin.change5m}%
                          </span>
                          <span
                            className={`text-[10px] ${
                              coin.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            24h: {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                          </span>
                        </div>
                      </td>

                      {/* Bid Density */}
                      <td className="p-3.5">
                        {coin.bidDensity ? (
                          <div className="bg-emerald-950/40 border border-emerald-800/60 p-1.5 rounded-lg">
                            <div className="flex items-center justify-between text-emerald-300 font-bold">
                              <span>${(coin.bidDensity.amountUsd / 1000).toFixed(0)}k</span>
                              <span className="text-[10px] text-emerald-400">-{coin.bidDensity.distancePercent}%</span>
                            </div>
                            <div className="text-[9px] text-slate-400">
                              @{coin.bidDensity.price} • {coin.bidDensity.lifeTimeMinutes}хв
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Ask Density */}
                      <td className="p-3.5">
                        {coin.askDensity ? (
                          <div className="bg-rose-950/40 border border-rose-800/60 p-1.5 rounded-lg">
                            <div className="flex items-center justify-between text-rose-300 font-bold">
                              <span>${(coin.askDensity.amountUsd / 1000).toFixed(0)}k</span>
                              <span className="text-[10px] text-rose-400">+{coin.askDensity.distancePercent}%</span>
                            </div>
                            <div className="text-[9px] text-slate-400">
                              @{coin.askDensity.price} • {coin.askDensity.lifeTimeMinutes}хв
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShareCoinToFeed(coin, coin.bidDensity ? 'BID' : 'ASK');
                          }}
                          className="bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold px-2.5 py-1 rounded-lg border border-cyan-500/30 transition text-[11px] cursor-pointer"
                          title="Поділитися плотністю на стіні"
                        >
                          Шерити
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Coin Inspector & Social Actions */}
        {selectedCoin && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white">{selectedCoin.baseAsset}</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    USDT Perpetual
                  </span>
                </div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                  ${formatCryptoPrice(selectedCoin.price)}
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">24h Обʼєм</span>
                <span className="font-bold text-slate-200">
                  ${(selectedCoin.volume24hUsd / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>

            {/* Sparkline Visual Simulation */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono block mb-2 uppercase">
                Тренд динаміки (1h Candle Wave)
              </span>
              <div className="h-16 flex items-end gap-1.5">
                {selectedCoin.sparkline.map((val, idx) => {
                  const min = Math.min(...selectedCoin.sparkline);
                  const max = Math.max(...selectedCoin.sparkline);
                  const heightPercent = max === min ? 50 : Math.round(((val - min) / (max - min)) * 80 + 20);
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-cyan-500/30 to-emerald-400 rounded-t-sm"
                      style={{ height: `${heightPercent}%` }}
                      title={`Ціна: $${val}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Orderbook Depth Density Details */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Аналіз стакану ордерів:
              </span>

              {selectedCoin.bidDensity && (
                <div className="bg-emerald-950/30 border border-emerald-800/50 p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">🟢 Стіна покупця (BID)</span>
                    <span className="font-mono text-emerald-300 font-bold">
                      ${(selectedCoin.bidDensity.amountUsd / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono flex items-center justify-between text-[11px]">
                    <span>Рівень: ${selectedCoin.bidDensity.price}</span>
                    <span>Відстань: -{selectedCoin.bidDensity.distancePercent}%</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Живе у стакані {selectedCoin.bidDensity.lifeTimeMinutes} хв • {selectedCoin.bidDensity.touchesCount} торкання
                  </div>
                </div>
              )}

              {selectedCoin.askDensity && (
                <div className="bg-rose-950/30 border border-rose-800/50 p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold">🔴 Стіна продавця (ASK)</span>
                    <span className="font-mono text-rose-300 font-bold">
                      ${(selectedCoin.askDensity.amountUsd / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono flex items-center justify-between text-[11px]">
                    <span>Рівень: ${selectedCoin.askDensity.price}</span>
                    <span>Відстань: +{selectedCoin.askDensity.distancePercent}%</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Живе у стакані {selectedCoin.askDensity.lifeTimeMinutes} хв • {selectedCoin.askDensity.touchesCount} торкання
                  </div>
                </div>
              )}
            </div>

            {/* Direct Social actions for this Coin */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onShareCoinToFeed(selectedCoin, selectedCoin.bidDensity ? 'BID' : 'ASK')}
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold p-3 rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Опублікувати розбір ${selectedCoin.baseAsset} у стрічку</span>
              </button>

              <button
                onClick={() => onShareCoinToChat(selectedCoin)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold p-3 rounded-2xl text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Обговорити ${selectedCoin.baseAsset} у чаті скальперів</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
