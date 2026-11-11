import React, { useState } from 'react';
import { LiveCommunityFeed } from './integrations/community/LiveCommunityFeed';
import { Header, MainNavSection } from './components/Header';
import { LeftTraderSidebar, TradingSession } from './components/LeftTraderSidebar';
import { CentralCommunityFeed } from './components/CentralCommunityFeed';
import { RightSessionsAwardsSidebar, AwardItem } from './components/RightSessionsAwardsSidebar';
import { H00kScreenerPanel } from './components/H00kScreenerPanel';
import { MainFeed } from './components/MainFeed';
import { ChatMessengerPanel } from './components/ChatMessengerPanel';
import { ArticlesView } from './components/ArticlesView';
import { TraderProfileView } from './components/TraderProfileView';
import { VPSLoadReportView } from './components/VPSLoadReportView';
import { HookChartEmbed } from './components/HookChartEmbed';
import { PostComposerModal } from './components/PostComposerModal';
import { 
  INITIAL_SCREENER_COINS, 
  INITIAL_PROFILES, 
  INITIAL_POSTS, 
  INITIAL_ARTICLES, 
  INITIAL_CHAT_MESSAGES 
} from './data/mockData';
import { TraderProfile, Post, Article, ChatMessage, ScreenerCoin } from './types';
import { Flame, MessageSquare, PlusCircle, Search, Users, ArrowLeft } from 'lucide-react';

// Current active trader identity (matches the concept screenshot TradingAtlas)
const TRADING_ATLAS_PROFILE: TraderProfile = {
  id: 'user_atlas',
  handle: 'trading_atlas',
  name: 'TradingAtlas',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  bio: 'Скальпінг та внутрішньоденна торгівля (інтрадей). Працюю з ліквідністю, структурами та рівнями. Ділюся сценаріями, ідеями та спостереженнями.',
  location: 'Польща 🇵🇱',
  joinedDate: 'Жовтень 2024',
  status: 'in_trade',
  currentTradeSnippet: '🟢 LONG $SOL 142.16 (Висхідний канал, ціль 145.80)',
  isVerified: true,
  isFriend: false,
  isFollowing: true,
  friendsCount: 125,
  followersCount: 1420,
  articlesCount: 3,
  tradesCount: 312,
  stats: {
    winRate: 68.8,
    pnl30dPercent: 142.5,
    pnl30dUsd: 11400,
    avgRR: 2.6,
    totalTrades: 312,
    profitFactor: 2.3,
    bestTradePercent: 280.0,
    favoritePairs: ['SOLUSDT', 'BTCUSDT', 'ETHUSDT'],
    primaryExchange: 'Binance Futures',
    tradingStyle: 'Structure & Liquidity Scalper',
  },
  badges: [
    {
      id: 'b1',
      title: 'Активний учасник',
      description: 'Постійний аналітик та контрибʼютор h00k Community',
      icon: 'Award',
      rarity: 'epic',
      earnedDate: '2024-10-15',
    },
    {
      id: 'b2',
      title: 'Серійний трейдер',
      description: 'Більше 300 закритих угод за торговою стратегією',
      icon: 'Zap',
      rarity: 'rare',
      earnedDate: '2024-11-01',
    },
    {
      id: 'b3',
      title: 'Аналітик ринку',
      description: 'Автор популярних сетапів та графічних формацій',
      icon: 'Target',
      rarity: 'legendary',
      earnedDate: '2024-11-05',
    },
  ],
};

export default function App() {
  const [activeSection, setActiveSection] = useState<MainNavSection>('community');
  
  // Community gamification & reward points state
  const [userPoints, setUserPoints] = useState<number>(125);
  const [receivedAwardsCount, setReceivedAwardsCount] = useState<number>(8);
  const [giftedAwardsCount, setGiftedAwardsCount] = useState<number>(3);

  // Available trading sessions (Europe/Warsaw UTC+1 timezone)
  const availableSessions: TradingSession[] = [
    {
      id: 'sydney',
      name: 'Sydney',
      countryFlag: '🇦🇺',
      hours: '00:00 – 07:00',
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      countryFlag: '🇯🇵',
      hours: '02:00 – 09:00',
    },
    {
      id: 'london',
      name: 'London',
      countryFlag: '🇬🇧',
      hours: '09:00 – 18:00',
    },
    {
      id: 'new_york',
      name: 'New York',
      countryFlag: '🇺🇸',
      hours: '14:00 – 23:00',
    },
  ];

  // Selected sessions
  const [activeSessionIds, setActiveSessionIds] = useState<string[]>(['london', 'new_york']);

  // Dynamic social data state
  const [coins, setCoins] = useState<ScreenerCoin[]>(INITIAL_SCREENER_COINS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  
  // Profiles list including TradingAtlas
  const [profiles, setProfiles] = useState<TraderProfile[]>([
    TRADING_ATLAS_PROFILE,
    ...INITIAL_PROFILES
  ]);
  const [selectedTraderId, setSelectedTraderId] = useState<string>('user_atlas');
  const [selectedFriendForChat, setSelectedFriendForChat] = useState<TraderProfile | null>(null);

  // Search & Composer
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [composerInitialTicker, setComposerInitialTicker] = useState<string | undefined>(undefined);
  const [composerInitialDensity, setComposerInitialDensity] = useState<any>(undefined);

  // Mobile layout state
  const [mobileColumn, setMobileColumn] = useState<'profile' | 'feed' | 'sessions'>('feed');
  const [mobileSwipeMode, setMobileSwipeMode] = useState<boolean>(false);

  const currentUser = profiles.find((p) => p.id === 'user_atlas') || TRADING_ATLAS_PROFILE;
  const currentViewedProfile = profiles.find((p) => p.id === selectedTraderId) || currentUser;
  const activeSessions = availableSessions.filter((s) => activeSessionIds.includes(s.id));
  const friendsList = profiles.filter((p) => p.isFriend || p.id !== currentUser.id);

  // Session handlers
  const handleToggleSession = (sessionId: string) => {
    setActiveSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleRemoveSession = (sessionId: string) => {
    setActiveSessionIds((prev) => prev.filter((id) => id !== sessionId));
  };

  const handleGiftAward = (award: AwardItem) => {
    if (userPoints < award.cost) {
      alert(`Недостатньо балів для нагороди "${award.name}". Потрібно ${award.cost} балів.`);
      return;
    }
    setUserPoints((prev) => prev - award.cost);
    setGiftedAwardsCount((prev) => prev + 1);
  };

  const handleSelectMobileCol = (col: 'profile' | 'feed' | 'sessions') => {
    setMobileColumn(col);
    if (mobileSwipeMode) {
      document.getElementById(`mobile-col-${col}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  // Social feed handlers
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [
              ...post.comments,
              {
                id: `c_${Date.now()}`,
                authorId: currentUser.id,
                authorName: currentUser.name,
                authorHandle: currentUser.handle,
                authorAvatar: currentUser.avatar,
                content: text,
                createdAt: 'Щойно',
                likes: 0,
                isLiked: false,
              },
            ],
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.isVerified,
      content: postData.content || '',
      createdAt: 'Щойно',
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      isLiked: false,
      isSaved: false,
      tags: postData.tags || ['h00k', 'Скрінер'],
      tradeAttachment: postData.tradeAttachment,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setIsComposerOpen(false);
    setComposerInitialTicker(undefined);
    setComposerInitialDensity(undefined);
  };

  // Chat message sender
  const handleSendMessage = (
    text: string, 
    recipientId?: string, 
    channelId?: string, 
    coinSnippet?: any
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: recipientId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coinSnippet,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Open direct chat with friend
  const handleOpenDirectChat = (profile: TraderProfile) => {
    setSelectedFriendForChat(profile);
    setActiveSection('messages');
  };

  // Open profile of a trader
  const handleOpenTraderProfile = (traderId: string) => {
    setSelectedTraderId(traderId);
    setActiveSection('profile');
  };

  // Toggle friend
  const handleToggleFriend = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            isFriend: !p.isFriend,
            friendsCount: p.isFriend ? p.friendsCount - 1 : p.friendsCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Share coin from screener to chat
  const handleShareCoinToChat = (coin: ScreenerCoin) => {
    handleSendMessage(
      `Погляньте на плотність по $${coin.symbol}: ціна $${coin.price}, дисбаланс стакану!`,
      undefined,
      'signals',
      {
        symbol: coin.symbol,
        price: coin.price,
        change24h: coin.change24h,
      }
    );
    setActiveSection('messages');
  };

  // Share coin from screener to feed
  const handleShareCoinToFeed = (coin: ScreenerCoin) => {
    setComposerInitialTicker(coin.symbol);
    setComposerInitialDensity({
      symbol: coin.symbol,
      densityPrice: coin.bidDensity?.price || coin.price,
      amountUsd: coin.bidDensity?.amountUsd || 500000,
      distancePercent: coin.bidDensity?.distancePercent || 1.2,
      side: 'BID',
    });
    setIsComposerOpen(true);
  };

  // Like article
  const handleLikeArticle = (articleId: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === articleId) {
          const isLiked = !a.isLiked;
          return {
            ...a,
            isLiked,
            likesCount: isLiked ? a.likesCount + 1 : a.likesCount - 1,
          };
        }
        return a;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-100 flex flex-col selection:bg-[#00e5bf] selection:text-[#080d17]">
      {/* 1. Header with all sections (Community, Feed, Messages, Screener, HookChart, Articles, Profile, VPS) */}
      <Header
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        unreadNotifications={true}
        unreadMessagesCount={3}
      />

      {/* 2. Main Content Container */}
      <main className="max-w-[1720px] w-full mx-auto px-2.5 sm:px-4 md:px-5 lg:px-7 py-3 sm:py-4 md:py-5 flex-1">
        
        {/* ========================================================================= */}
        {/* PAGE 1: COMMUNITY HUB (Exact layout matching concept screenshot)          */}
        {/* ========================================================================= */}
        {activeSection === 'community' && (
          <LiveCommunityFeed />
        )}
        {false && activeSection === 'community' && (
          <div className="space-y-3">
            {/* Mobile Spatial Segmented Controller (< 768px) */}
            <div className="md:hidden bg-[#0c1322] border border-[#1b273d] p-1.5 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between px-2 pb-1.5 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-[#00e5bf]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5bf] animate-pulse" />
                  Платформа h00k Community
                </span>
                <button
                  onClick={() => setMobileSwipeMode(!mobileSwipeMode)}
                  className="text-slate-300 hover:text-white underline cursor-pointer"
                >
                  {mobileSwipeMode ? 'Режим вкладок' : 'Режим свайп-каруселі'}
                </button>
              </div>

              {/* 3-Position Spatial Switcher mirroring physical column arrangement */}
              <div className="grid grid-cols-3 gap-1 bg-[#070b14] p-1 rounded-xl">
                <button
                  onClick={() => handleSelectMobileCol('profile')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    mobileColumn === 'profile'
                      ? 'bg-[#00e5bf] text-[#080d17] shadow-[0_0_12px_rgba(0,229,191,0.4)]'
                      : 'text-slate-300 hover:text-white bg-[#0e1625]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>⬅️</span>
                    <span>Профіль</span>
                  </div>
                  <span className="text-[9px] font-normal opacity-80">(Ліворуч)</span>
                </button>

                <button
                  onClick={() => handleSelectMobileCol('feed')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    mobileColumn === 'feed'
                      ? 'bg-[#00e5bf] text-[#080d17] shadow-[0_0_12px_rgba(0,229,191,0.4)]'
                      : 'text-slate-300 hover:text-white bg-[#0e1625]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>🧱</span>
                    <span>Стіна</span>
                  </div>
                  <span className="text-[9px] font-normal opacity-80">(По центру)</span>
                </button>

                <button
                  onClick={() => handleSelectMobileCol('sessions')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    mobileColumn === 'sessions'
                      ? 'bg-[#00e5bf] text-[#080d17] shadow-[0_0_12px_rgba(0,229,191,0.4)]'
                      : 'text-slate-300 hover:text-white bg-[#0e1625]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>Сесії & Нагороди</span>
                    <span>➡️</span>
                  </div>
                  <span className="text-[9px] font-normal opacity-80">(Праворуч)</span>
                </button>
              </div>
            </div>

            {/* Layout for Tablet & Desktop (>= 768px): All 3 Columns side-by-side */}
            <div className="hidden md:flex md:flex-row gap-3.5 lg:gap-4 xl:gap-5 items-start">
              {/* Left Column: Trader Profile & Sessions & Stats (Strictly Left of the Wall) */}
              <LeftTraderSidebar
                activeSessions={activeSessions}
                onRemoveSession={handleRemoveSession}
                userPoints={userPoints}
                receivedAwardsCount={receivedAwardsCount}
                giftedAwardsCount={giftedAwardsCount}
                onOpenAwardHistory={() => setActiveSection('profile')}
              />

              {/* Central Column: Feed, Ideas, HookChart Post (Strictly in the Center) */}
              <CentralCommunityFeed />

              {/* Right Column: Sessions Selector & Award Gifting (Strictly Right of the Wall) */}
              <RightSessionsAwardsSidebar
                availableSessions={availableSessions}
                activeSessionIds={activeSessionIds}
                onToggleSession={handleToggleSession}
                userPoints={userPoints}
                onGiftAward={handleGiftAward}
              />
            </div>

            {/* Mobile Layout (< md) */}
            {mobileSwipeMode ? (
              <div className="md:hidden">
                <div className="text-center py-1 text-[11px] text-[#00e5bf] font-medium flex items-center justify-center gap-1.5">
                  <span>← Свайпайте вліво або вправо між 3 колонками →</span>
                </div>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 no-scrollbar scroll-smooth">
                  <div id="mobile-col-profile" className="w-[86vw] max-w-[340px] shrink-0 snap-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      <span>⬅️ Ліворуч: Блок профілю</span>
                    </div>
                    <LeftTraderSidebar
                      activeSessions={activeSessions}
                      onRemoveSession={handleRemoveSession}
                      userPoints={userPoints}
                      receivedAwardsCount={receivedAwardsCount}
                      giftedAwardsCount={giftedAwardsCount}
                      onOpenAwardHistory={() => setActiveSection('profile')}
                    />
                  </div>

                  <div id="mobile-col-feed" className="w-[92vw] max-w-[620px] shrink-0 snap-center">
                    <div className="text-[10px] uppercase font-bold text-[#00e5bf] mb-1.5 flex items-center gap-1">
                      <span>🧱 По центру: Стіна h00k</span>
                    </div>
                    <CentralCommunityFeed />
                  </div>

                  <div id="mobile-col-sessions" className="w-[86vw] max-w-[340px] shrink-0 snap-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      <span>➡️ Праворуч: Сесії та Нагороди</span>
                    </div>
                    <RightSessionsAwardsSidebar
                      availableSessions={availableSessions}
                      activeSessionIds={activeSessionIds}
                      onToggleSession={handleToggleSession}
                      userPoints={userPoints}
                      onGiftAward={handleGiftAward}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:hidden">
                {mobileColumn === 'profile' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-[#0e1625] border border-[#1b283d] px-3 py-2 rounded-xl text-xs">
                      <span className="font-bold text-[#00e5bf] flex items-center gap-1">
                        <span>⬅️</span> Блок профілю (Ліворуч стіни)
                      </span>
                      <button
                        onClick={() => setMobileColumn('feed')}
                        className="bg-[#00e5bf] text-[#080d17] font-bold text-xs px-2.5 py-1 rounded-lg"
                      >
                        До Стіни →
                      </button>
                    </div>
                    <LeftTraderSidebar
                      activeSessions={activeSessions}
                      onRemoveSession={handleRemoveSession}
                      userPoints={userPoints}
                      receivedAwardsCount={receivedAwardsCount}
                      giftedAwardsCount={giftedAwardsCount}
                      onOpenAwardHistory={() => setActiveSection('profile')}
                    />
                  </div>
                )}

                {mobileColumn === 'feed' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <button
                        onClick={() => setMobileColumn('profile')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#0e1625] hover:bg-[#152033] border border-[#1b283d] text-slate-300 py-1.5 px-2 rounded-xl transition cursor-pointer"
                      >
                        <span>‹ 👤</span>
                        <span className="font-semibold">Профіль (Зліва)</span>
                      </button>
                      <button
                        onClick={() => setMobileColumn('sessions')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#0e1625] hover:bg-[#152033] border border-[#1b283d] text-slate-300 py-1.5 px-2 rounded-xl transition cursor-pointer"
                      >
                        <span className="font-semibold">Сесії & Нагороди (Справа)</span>
                        <span>🏆 ›</span>
                      </button>
                    </div>

                    <CentralCommunityFeed />
                  </div>
                )}

                {mobileColumn === 'sessions' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-[#0e1625] border border-[#1b283d] px-3 py-2 rounded-xl text-xs">
                      <button
                        onClick={() => setMobileColumn('feed')}
                        className="bg-[#00e5bf] text-[#080d17] font-bold text-xs px-2.5 py-1 rounded-lg"
                      >
                        ← До Стіни
                      </button>
                      <span className="font-bold text-[#00e5bf] flex items-center gap-1">
                        Сесії та Нагороди (Праворуч стіни) <span>➡️</span>
                      </span>
                    </div>
                    <RightSessionsAwardsSidebar
                      availableSessions={availableSessions}
                      activeSessionIds={activeSessionIds}
                      onToggleSession={handleToggleSession}
                      userPoints={userPoints}
                      onGiftAward={handleGiftAward}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: СТРІЧКА ТРЕЙДЕРІВ (Social MainFeed with trades, posts, and setups) */}
        {/* ========================================================================= */}
        {activeSection === 'feed' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* Feed Page Header */}
            <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h1 className="text-lg sm:text-xl font-black text-white">Стрічка трейдерів h00k</h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Публікації, відкриті та закриті угоди, розбір формацій та обговорення ситуацій на ринку
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-2 bg-[#00e5bf] hover:bg-[#00ffd4] text-[#080d17] font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(0,229,191,0.3)]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Створити здєлку / пост</span>
                </button>
              </div>
            </div>

            {/* Social Feed Component */}
            <MainFeed
              posts={posts}
              currentUser={currentUser}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onOpenCreatePost={() => setIsComposerOpen(true)}
              onShareToChat={(post) => {
                handleSendMessage(`Погляньте на сетап від @${post.authorHandle}: "${post.content.slice(0, 80)}..."`);
                setActiveSection('messages');
              }}
              onOpenTraderProfile={handleOpenTraderProfile}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: ПОВІДОМЛЕННЯ ТА ЧАТИ (Direct messages, public rooms, signals)     */}
        {/* ========================================================================= */}
        {activeSection === 'messages' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#00e5bf]" />
                <div>
                  <h1 className="text-base sm:text-lg font-black text-white">Повідомлення & Торгові Чати</h1>
                  <p className="text-xs text-slate-400">Спілкування у реальному часі, кімнати сигналів та особисті повідомлення з друзями</p>
                </div>
              </div>

              <button
                onClick={() => setActiveSection('community')}
                className="bg-[#121c2d] hover:bg-[#182740] text-slate-200 text-xs px-3.5 py-1.5 rounded-xl border border-[#1d2d47] transition cursor-pointer"
              >
                ← До Community
              </button>
            </div>

            <ChatMessengerPanel
              currentUser={currentUser}
              friends={friendsList}
              messages={messages}
              onSendMessage={handleSendMessage}
              selectedFriendForChat={selectedFriendForChat}
              onSelectFriend={setSelectedFriendForChat}
              availableCoins={coins}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: СКРІНЕР ПЛОТНОСТЕЙ H00K                                          */}
        {/* ========================================================================= */}
        {activeSection === 'screener' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b283d]">
              <div>
                <h1 className="text-xl font-bold text-white">Скрінер плотностей h00k</h1>
                <p className="text-xs text-slate-400">
                  Моніторинг лімітних заявок, кластерів та дисбалансу стаканів на криптобіржах Binance/Bybit
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSection('feed')}
                  className="bg-[#121c2d] hover:bg-[#182740] text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-[#1d2d47] transition cursor-pointer"
                >
                  Стрічка трейдерів →
                </button>
                <button
                  onClick={() => setActiveSection('community')}
                  className="bg-[#00e5bf] text-[#080d17] font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
                >
                  ← Community
                </button>
              </div>
            </div>
            <H00kScreenerPanel
              coins={coins}
              onShareCoinToFeed={handleShareCoinToFeed}
              onShareCoinToChat={handleShareCoinToChat}
            />
            <div className="pt-4">
              <VPSLoadReportView />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: STANDALONE HOOKCHART STUDIO                                      */}
        {/* ========================================================================= */}
        {activeSection === 'hookchart' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b283d]">
              <div>
                <h1 className="text-xl font-bold text-white">HookChart — Технічний аналіз та інструменти</h1>
                <p className="text-xs text-slate-400">
                  Професійні інструменти розмітки рівнів, каналів, сітки Фібоначчі та проекції сценаріїв
                </p>
              </div>
              <button
                onClick={() => setActiveSection('community')}
                className="bg-[#00e5bf] text-[#080d17] font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                ← Назад у Community
              </button>
            </div>
            <div className="bg-[#0e1625] p-4 sm:p-5 rounded-2xl border border-[#1b273d]">
              <HookChartEmbed />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 6: СТАТТІ ТА ОСВІТА ТРЕЙДЕРІВ (ArticlesView)                         */}
        {/* ========================================================================= */}
        {activeSection === 'articles' && (
          <div className="space-y-5 max-w-5xl mx-auto">
            <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white">Статті та аналітика трейдерів</h1>
                <p className="text-xs text-slate-400 mt-1">Освітні гайди, розбір торгових стратегій, робота зі стаканом та ризик-менеджмент</p>
              </div>
              <button
                onClick={() => setActiveSection('community')}
                className="bg-[#00e5bf] text-[#080d17] font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                ← До Community
              </button>
            </div>

            <ArticlesView
              articles={articles}
              selectedArticle={selectedArticle}
              onSelectArticle={setSelectedArticle}
              onLikeArticle={handleLikeArticle}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 7: ДЕТАЛЬНИЙ ПРОФІЛЬ ТРЕЙДЕРА (TraderProfileView with switcher)      */}
        {/* ========================================================================= */}
        {activeSection === 'profile' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            {/* Quick Trader Switcher Bar */}
            <div className="bg-[#0e1625] border border-[#1b273d] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Перегляд профілю:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedTraderId(p.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                        selectedTraderId === p.id
                          ? 'bg-[#00e5bf] text-[#080d17] font-bold shadow-[0_0_12px_rgba(0,229,191,0.3)]'
                          : 'bg-[#121c2d] text-slate-300 hover:text-white border border-[#1d2d47]'
                      }`}
                    >
                      <span>{p.name.split(' ')[0]}</span>
                      {p.id === 'user_atlas' && <span className="text-[10px] opacity-75">(Ви)</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="bg-[#00e5bf] text-[#080d17] font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer shadow-[0_0_12px_rgba(0,229,191,0.25)]"
                >
                  + Написати на стіні
                </button>
                <button
                  onClick={() => setActiveSection('community')}
                  className="bg-[#121c2d] hover:bg-[#182740] text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-[#1d2d47] transition cursor-pointer"
                >
                  ← До Community
                </button>
              </div>
            </div>

            {/* Profile View Component */}
            <TraderProfileView
              profile={currentViewedProfile}
              currentUser={currentUser}
              wallPosts={posts.filter((p) => p.authorId === currentViewedProfile.id || p.authorName.includes(currentViewedProfile.name.split(' ')[0]))}
              articles={articles.filter((a) => a.authorId === currentViewedProfile.id)}
              onToggleFriend={handleToggleFriend}
              onOpenDirectChat={handleOpenDirectChat}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onOpenCreatePostOnWall={() => setIsComposerOpen(true)}
              onSelectArticle={(art) => {
                setSelectedArticle(art);
                setActiveSection('articles');
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 8: VPS LOAD REPORT VIEW                                              */}
        {/* ========================================================================= */}
        {activeSection === 'vps' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="bg-[#0e1625] border border-[#1a263d] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Розрахунок навантаження на VPS для h00k</h1>
                <p className="text-xs text-slate-400">Аналіз WebSocket підключень, обробки ордербуків та соціальних функцій</p>
              </div>
              <button
                onClick={() => setActiveSection('community')}
                className="bg-[#00e5bf] text-[#080d17] font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                ← Назад у Community
              </button>
            </div>
            <VPSLoadReportView />
          </div>
        )}

      </main>

      {/* Post Composer Modal (Accessible from anywhere) */}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setComposerInitialTicker(undefined);
          setComposerInitialDensity(undefined);
        }}
        currentUser={currentUser}
        onSubmitPost={handleCreatePost}
        initialTicker={composerInitialTicker}
        initialDensityData={composerInitialDensity}
      />
    </div>
  );
}
