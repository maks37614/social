export type TradeSide = 'LONG' | 'SHORT';
export type TradeStatus = 'OPEN' | 'CLOSED';
export type TraderStatus = 'online' | 'in_trade' | 'away' | 'offline';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'legendary' | 'epic' | 'rare' | 'common';
  earnedDate: string;
}

export interface TraderStats {
  winRate: number; // e.g. 68.4%
  pnl30dPercent: number; // e.g. +142.5%
  pnl30dUsd: number; // e.g. +$18,450
  avgRR: number; // e.g. 2.4
  totalTrades: number; // e.g. 342
  profitFactor: number; // e.g. 2.15
  bestTradePercent: number; // e.g. +340%
  favoritePairs: string[]; // e.g. ['BTCUSDT', 'SOLUSDT', 'PEPEUSDT']
  primaryExchange: string; // e.g. 'Binance Futures'
  tradingStyle: string; // 'Orderflow Scalper' | 'Breakout Trader' | 'Cluster Analyst'
}

export interface TraderProfile {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  joinedDate: string;
  status: TraderStatus;
  currentTradeSnippet?: string;
  isVerified: boolean;
  isFriend: boolean;
  isFollowing: boolean;
  stats: TraderStats;
  badges: Badge[];
  friendsCount: number;
  followersCount: number;
  articlesCount: number;
  tradesCount: number;
}

export interface TradeAttachment {
  ticker: string;
  side: TradeSide;
  entryPrice: number;
  exitPrice?: number;
  currentPrice: number;
  leverage: number;
  pnlPercent: number;
  pnlUsd?: number;
  status: TradeStatus;
  setupReason: string; // e.g. 'Пробій каскаду плотностей на h00k'
  chartFormation?: string; // 'Ascending Triangle' | 'Orderbook Wall Absorption'
  timeframe: string; // '1m' | '5m' | '15m'
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorVerified?: boolean;
  authorBadges?: string[];
  createdAt: string;
  content: string;
  tags: string[];
  tradeAttachment?: TradeAttachment;
  screenerDensityRef?: {
    symbol: string;
    densityPrice: number;
    amountUsd: number;
    distancePercent: number;
    side: 'BID' | 'ASK';
  };
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  wallProfileId?: string; // if posted on someone's wall
}

export interface Article {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTimeMinutes: number;
  publishedDate: string;
  coverImage: string;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  isLiked?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string; // undefined if channel/room message
  channelId?: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  tradeSnippet?: TradeAttachment;
  coinSnippet?: {
    symbol: string;
    price: number;
    change24h: number;
  };
}

export interface ScreenerDensity {
  price: number;
  amountUsd: number;
  volumeCoins: number;
  distancePercent: number;
  lifeTimeMinutes: number;
  touchesCount: number;
}

export interface ScreenerCoin {
  symbol: string;
  baseAsset: string;
  price: number;
  change5m: number;
  change1h: number;
  change24h: number;
  volume24hUsd: number;
  oiChange1h: number;
  volatility: number;
  bidDensity?: ScreenerDensity;
  askDensity?: ScreenerDensity;
  signal?: 'HIGH_DENSITY' | 'PUMP_ALERT' | 'BREAKOUT' | 'WHALE_ACCUMULATION';
  sparkline: number[];
}

export interface VPSLoadCalculation {
  usersCount: number;
  symbolsCount: number;
  screenerRefreshHz: number;
  chatActiveUsers: number;
  
  // Computed metrics
  screenerCpuPercent: number;
  socialCpuPercent: number;
  totalCpuPercent: number;
  recommendedCores: number;
  
  screenerRamMb: number;
  socialRamMb: number;
  dbRamMb: number;
  totalRamMb: number;
  recommendedRamGb: number;
  
  networkInMbps: number;
  networkOutMbps: number;
  
  recommendedTier: string;
  approxMonthlyCostUsd: number;
  riskAssessment: 'LOW' | 'OPTIMAL' | 'ELEVATED' | 'HIGH_LOAD';
  architectureAdvice: string[];
}
