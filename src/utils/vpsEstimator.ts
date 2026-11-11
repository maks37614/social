import { VPSLoadCalculation } from '../types';

export interface VPSInputParams {
  usersCount: number; // Simultaneous online users
  symbolsCount: number; // Monitored crypto pairs in screener (e.g. 50-250)
  screenerRefreshHz: number; // Screener update frequency (0.5 to 4 Hz)
  chatActiveUsers: number; // Users actively typing in chats
}

/**
 * Calculates realistic VPS resource footprint for h00k crypto screener + social network.
 */
export function calculateVPSLoad(params: VPSInputParams): VPSLoadCalculation {
  const {
    usersCount = 100,
    symbolsCount = 100,
    screenerRefreshHz = 1,
    chatActiveUsers = 20,
  } = params;

  // 1. Screener CPU calculation:
  // Ingesting WebSocket diffs + computing orderbook densities
  // Base 5% for Node.js event loop + 0.18% per symbol * refresh rate
  const screenerCpuPercent = Math.min(
    180,
    Math.round((5 + symbolsCount * 0.16 * Math.sqrt(screenerRefreshHz)) * 10) / 10
  );

  // 2. Social Network CPU calculation:
  // REST API, JWT auth, database reads/writes, WebSocket connection pooling
  // ~0.08% CPU per active concurrent browsing user + ~0.3% per active chatting user
  const socialCpuPercent = Math.min(
    250,
    Math.round((3 + usersCount * 0.08 + chatActiveUsers * 0.28) * 10) / 10
  );

  const totalCpuPercent = Math.round((screenerCpuPercent + socialCpuPercent) * 10) / 10;
  
  // Recommended Cores: target < 65% total utilization
  const rawCores = totalCpuPercent / 65;
  const recommendedCores = rawCores <= 1.2 ? 2 : rawCores <= 2.5 ? 4 : rawCores <= 4.5 ? 8 : 16;

  // 3. RAM Calculations (in MB)
  // Screener: Base Node runtime (80MB) + 1.2MB per symbol orderbook cache + buffer
  const screenerRamMb = Math.round(85 + symbolsCount * 1.35);

  // Social Network: Session store, socket handlers (~25KB per user connection), image cache
  const socialRamMb = Math.round(110 + usersCount * 0.45 + chatActiveUsers * 0.8);

  // Database (PostgreSQL or SQLite + Redis for pub/sub)
  // Base 120MB + user buffers
  const dbRamMb = Math.round(130 + usersCount * 0.25);

  const totalRamMb = screenerRamMb + socialRamMb + dbRamMb + 300; // 300MB OS/system headroom
  const recommendedRamGb = totalRamMb <= 1800 ? 2 : totalRamMb <= 3600 ? 4 : totalRamMb <= 7200 ? 8 : 16;

  // 4. Network Bandwidth (in Mbps)
  // Inbound: Exchange orderbook streams (Binance/Bybit ~18 KB/s per high-volume symbol)
  const networkInMbps = Math.round((symbolsCount * 0.12 * Math.sqrt(screenerRefreshHz)) * 10) / 10;

  // Outbound: Pushing screener deltas to connected clients + social feed updates
  // If throttled to 1 sec intervals: ~4 KB per client per second
  const networkOutMbps = Math.round(((usersCount * 0.038 * screenerRefreshHz) + (chatActiveUsers * 0.015)) * 10) / 10;

  // 5. Tier & Cost Assessment
  let recommendedTier = 'VPS Стартовий (2 vCPU / 4 GB RAM)';
  let approxMonthlyCostUsd = 6;
  let riskAssessment: 'LOW' | 'OPTIMAL' | 'ELEVATED' | 'HIGH_LOAD' = 'OPTIMAL';

  if (usersCount < 50 && symbolsCount <= 60) {
    recommendedTier = 'VPS Економ (1-2 vCPU / 2-4 GB RAM)';
    approxMonthlyCostUsd = 4.5;
    riskAssessment = 'LOW';
  } else if (usersCount <= 300 && symbolsCount <= 120) {
    recommendedTier = 'VPS Оптимальний (2-4 vCPU / 4-8 GB RAM - e.g. Hetzner CX22/CX32)';
    approxMonthlyCostUsd = 8.5;
    riskAssessment = 'OPTIMAL';
  } else if (usersCount <= 1200) {
    recommendedTier = 'VPS Продуктивний (4 vCPU / 8-16 GB RAM)';
    approxMonthlyCostUsd = 16;
    riskAssessment = 'ELEVATED';
  } else {
    recommendedTier = 'Кластер / Dedicated (8+ vCPU / 32 GB RAM + Redis Server)';
    approxMonthlyCostUsd = 45;
    riskAssessment = 'HIGH_LOAD';
  }

  // 6. Actionable Architectural advice
  const architectureAdvice: string[] = [
    'Відокремте Screener Daemon від Web API: фоновий процес на Go або Node.js парсить стакани бірж і записує плотності в Redis / спільну памʼять.',
    'Не надсилайте повний стакан кожному юзеру: клієнту потрібні лише зміни (delta) та знайдені плотності (наприклад, > $150k на відстані до 2%).',
    'Кешуйте стрічку соцмережі: список постів, коментарі та профілі кешуються в Redis на 3-5 секунд, що знімає 85% навантаження з PostgreSQL.',
    'Зображення (скріншоти графіків): зберігайте в S3/Cloudflare R2, а не на диску VPS, щоб уникнути забиття I/O та памʼяті.',
    'Використовуйте uWebSockets.js або Socket.io з Redis Adapter: споживає лише ~20 KB RAM на 1 активне зʼєднання.'
  ];

  return {
    usersCount,
    symbolsCount,
    screenerRefreshHz,
    chatActiveUsers,
    screenerCpuPercent,
    socialCpuPercent,
    totalCpuPercent,
    recommendedCores,
    screenerRamMb,
    socialRamMb,
    dbRamMb,
    totalRamMb,
    recommendedRamGb,
    networkInMbps,
    networkOutMbps,
    recommendedTier,
    approxMonthlyCostUsd,
    riskAssessment,
    architectureAdvice,
  };
}
