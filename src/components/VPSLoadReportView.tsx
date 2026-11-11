import React, { useState, useMemo } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Database
} from 'lucide-react';
import { calculateVPSLoad } from '../utils/vpsEstimator';

export const VPSLoadReportView: React.FC = () => {
  // Simulator state
  const [usersCount, setUsersCount] = useState(150);
  const [symbolsCount, setSymbolsCount] = useState(100);
  const [refreshHz, setRefreshHz] = useState(1);
  const [chatActiveUsers, setChatActiveUsers] = useState(30);

  const stats = useMemo(() => {
    return calculateVPSLoad({
      usersCount,
      symbolsCount,
      screenerRefreshHz: refreshHz,
      chatActiveUsers,
    });
  }, [usersCount, symbolsCount, refreshHz, chatActiveUsers]);

  return (
    <div className="space-y-6">
      {/* Hero Executive Summary */}
      <div className="bg-gradient-to-r from-[#0d1627] via-[#111f38] to-[#0a1424] border border-cyan-900/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-cyan-950/80 text-cyan-400 text-xs font-mono font-bold px-3 py-1 rounded-xl border border-cyan-800/60">
            <Server className="w-3.5 h-3.5" />
            <span>Технічний аналіз: Чи витримає твій VPS?</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Оцінка навантаження на VPS при інтеграції соцмережі в h00k
          </h1>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-sm text-slate-200 leading-relaxed">
            <p className="font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Коротка відповідь: Навантаження НЕ буде надмірним, якщо не повторювати типову помилку зі стаканами!
            </p>
            <p className="text-xs text-slate-300">
              Скрінер h00k споживає ресурси на WebSocket-парсинг стаканів Binance/Bybit. Сама соцмережа (профілі, стіна, пости, друзі) — це звичайний легкий CRUD у базі даних (PostgreSQL/SQLite) з кешуванням. Навіть доступний VPS за <strong>€6–€12/міс (2–4 ядра, 4–8 ГБ RAM)</strong> легко витримає <strong>500+ трейдерів онлайн</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive VPS Load Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Інтерактивний симулятор навантаження сервера</span>
            </div>
            <p className="text-xs text-slate-400">
              Змінюйте параметри та спостерігайте, як масштабуються CPU, RAM, трафік і рекомендований тариф
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-xl font-mono uppercase ${
                stats.riskAssessment === 'LOW'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : stats.riskAssessment === 'OPTIMAL'
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  : stats.riskAssessment === 'ELEVATED'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              Стан системи: {stats.riskAssessment}
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          {/* Active Users */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-sans font-semibold">Трейдерів онлайн (Одночасно):</span>
              <span className="font-bold text-cyan-400 text-sm">{usersCount} чол.</span>
            </div>
            <input
              type="range"
              min={20}
              max={2500}
              step={10}
              value={usersCount}
              onChange={(e) => setUsersCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 (Старт)</span>
              <span>500 (Комʼюніті)</span>
              <span>2,500 (Масштаб)</span>
            </div>
          </div>

          {/* Screener Symbols */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-sans font-semibold">Кількість пар у скрінері h00k:</span>
              <span className="font-bold text-cyan-400 text-sm">{symbolsCount} пар</span>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={5}
              value={symbolsCount}
              onChange={(e) => setSymbolsCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 (Топ волатильні)</span>
              <span>100 (Стандарт)</span>
              <span>250 (Усі фʼючерси)</span>
            </div>
          </div>

          {/* Update frequency */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-sans font-semibold">Частота пушу оновлень скрінера:</span>
              <span className="font-bold text-cyan-400 text-sm">{refreshHz} Гц ({1000 / refreshHz}мс)</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.5}
              value={refreshHz}
              onChange={(e) => setRefreshHz(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5 Гц (Економ)</span>
              <span>1 Гц (Оптимально)</span>
              <span>3 Гц (Турбо)</span>
            </div>
          </div>

          {/* Chat active typers */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-sans font-semibold">Активних у чаті та повідомленнях:</span>
              <span className="font-bold text-cyan-400 text-sm">{chatActiveUsers} трейдерів</span>
            </div>
            <input
              type="range"
              min={5}
              max={Math.min(usersCount, 500)}
              step={5}
              value={Math.min(chatActiveUsers, usersCount)}
              onChange={(e) => setChatActiveUsers(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5</span>
              <span>100</span>
              <span>500</span>
            </div>
          </div>
        </div>

        {/* Calculated Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {/* CPU Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Навантаження CPU</span>
              </div>
              <span className="text-[10px] text-cyan-300">{stats.recommendedCores} ядра</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {stats.totalCpuPercent}%
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-800/80">
              <div>Скрінер (парсинг): {stats.screenerCpuPercent}%</div>
              <div>Соцмережа (чат/API): {stats.socialCpuPercent}%</div>
            </div>
          </div>

          {/* RAM Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Споживання RAM</span>
              </div>
              <span className="text-[10px] text-emerald-300">Реком: {stats.recommendedRamGb} GB</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              {stats.totalRamMb} MB
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-800/80">
              <div>Стакани h00k: {stats.screenerRamMb} MB</div>
              <div>Соцмережа + сокети: {stats.socialRamMb} MB</div>
            </div>
          </div>

          {/* Network Bandwidth */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-purple-400" />
                <span>Мережевий трафік</span>
              </div>
              <span className="text-[10px] text-purple-300">In / Out</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-400">
              {stats.networkOutMbps} <span className="text-xs">Mbps Out</span>
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-800/80">
              <div>Вхідний від бірж: {stats.networkInMbps} Mbps</div>
              <div>Вихідний до юзерів: {stats.networkOutMbps} Mbps</div>
            </div>
          </div>

          {/* Price / Tier */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Бюджет сервера</span>
              </div>
              <span className="text-[10px] text-amber-300">в місяць</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              ~${stats.approxMonthlyCostUsd} / міс
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-sans line-clamp-1">
              {stats.recommendedTier}
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Blueprint: Why and How it works efficiently */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Правильна архітектура: Як скрінер + соцмережа уживаються на 1 VPS</span>
        </h2>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-mono font-bold text-[11px] block">
              1. Біржовий Ingestor
            </span>
            <p className="text-slate-300">
              Фоновий демон (наприклад, Go або Node.js Worker) тримає 1 підключення до Binance/Bybit. Він приймає стакани, рахує плотності і не чіпає веб-юзерів.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-mono font-bold text-[11px] block">
              2. Redis In-Memory Cache
            </span>
            <p className="text-slate-300">
              Знайдені плотності записуються в Redis. Клієнти беруть дані з памʼяті за 0.2мс, база даних на диску не перевантажується.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-purple-400 font-mono font-bold text-[11px] block">
              3. Соцмережа & Чат (uWebSockets)
            </span>
            <p className="text-slate-300">
              uWebSockets.js споживає лише 20-30 КБ памʼяті на 1 клієнта. 500 активних зʼєднань чату та стрічки вимагають всього ~15 МБ RAM.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-amber-400 font-mono font-bold text-[11px] block">
              4. База даних (PostgreSQL)
            </span>
            <p className="text-slate-300">
              Зберігає тільки користувачів, пости, беджі та статті. Пости кешуються, тому навантаження на диск майже нульове.
            </p>
          </div>
        </div>

        {/* 5 Golden Rules Checklist */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-200">
            5 правил оптимізації від senior-інженера для h00k:
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {stats.architectureAdvice.map((advice, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-800/80 text-[10px]">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
