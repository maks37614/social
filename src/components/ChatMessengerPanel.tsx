import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Users, 
  Hash, 
  Sparkles, 
  Paperclip, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Target
} from 'lucide-react';
import { ChatMessage, TraderProfile, ScreenerCoin } from '../types';

interface ChatMessengerPanelProps {
  currentUser: TraderProfile;
  friends: TraderProfile[];
  messages: ChatMessage[];
  onSendMessage: (text: string, recipientId?: string, channelId?: string, coinSnippet?: any) => void;
  selectedFriendForChat?: TraderProfile | null;
  onSelectFriend: (profile: TraderProfile | null) => void;
  availableCoins: ScreenerCoin[];
}

export const ChatMessengerPanel: React.FC<ChatMessengerPanelProps> = ({
  currentUser,
  friends,
  messages,
  onSendMessage,
  selectedFriendForChat,
  onSelectFriend,
  availableCoins,
}) => {
  const [activeChannel, setActiveChannel] = useState<'public' | 'signals'>('public');
  const [inputText, setInputText] = useState('');

  const isDirect = !!selectedFriendForChat;

  const filteredMessages = messages.filter((m) => {
    if (isDirect) {
      return (
        (m.senderId === currentUser.id && m.receiverId === selectedFriendForChat.id) ||
        (m.senderId === selectedFriendForChat.id && m.receiverId === currentUser.id)
      );
    }
    // Room message
    return !m.receiverId;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(
      inputText.trim(),
      isDirect ? selectedFriendForChat.id : undefined,
      !isDirect ? activeChannel : undefined
    );
    setInputText('');
  };

  const handleQuickShareCoin = (coin: ScreenerCoin) => {
    const text = `Подивіться на ${coin.baseAsset}! Зараз ціна $${coin.price}, 24h зміна: ${coin.change24h}%. Є плотність у стакані h00k!`;
    onSendMessage(
      text,
      isDirect ? selectedFriendForChat?.id : undefined,
      !isDirect ? activeChannel : undefined,
      {
        symbol: coin.symbol,
        price: coin.price,
        change24h: coin.change24h,
      }
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[700px] flex flex-col md:flex-row">
      {/* Left Chat Sidebar (Channels & Friends) */}
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          {/* Public Rooms */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
              <span>Кімнати трейдерів</span>
              <span className="text-cyan-400 font-mono">LIVE</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectFriend(null);
                  setActiveChannel('public');
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  !isDirect && activeChannel === 'public'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>#загальний-скальпер-чат</span>
              </button>

              <button
                onClick={() => {
                  onSelectFriend(null);
                  setActiveChannel('signals');
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  !isDirect && activeChannel === 'signals'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>#алерти-плотностей-h00k</span>
              </button>
            </div>
          </div>

          {/* Friends / Direct Messages */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
              <span>Особисті листування</span>
              <Users className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="space-y-1">
              {friends.map((friend) => {
                const isSelected = selectedFriendForChat?.id === friend.id;
                return (
                  <button
                    key={friend.id}
                    onClick={() => onSelectFriend(friend)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 border border-cyan-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-slate-900 ${
                            friend.status === 'online'
                              ? 'bg-emerald-400'
                              : friend.status === 'in_trade'
                              ? 'bg-cyan-400 animate-pulse'
                              : 'bg-amber-400'
                          }`}
                        />
                      </div>
                      <div className="max-w-[130px] truncate">
                        <div className="text-xs font-bold leading-tight truncate">
                          {friend.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          @{friend.handle}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      +{friend.stats.pnl30dPercent}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick share coin pill */}
        <div className="pt-3 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase">
            Швидкий шеринг у чат:
          </span>
          <div className="flex flex-wrap gap-1">
            {availableCoins.slice(0, 3).map((c) => (
              <button
                key={c.symbol}
                onClick={() => handleQuickShareCoin(c)}
                className="text-[10px] bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-mono font-bold px-2 py-1 rounded-lg border border-slate-800 transition cursor-pointer"
              >
                + ${c.baseAsset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Chat Main Area */}
      <div className="flex-1 flex flex-col justify-between bg-slate-900/60 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDirect ? (
              <>
                <img
                  src={selectedFriendForChat.avatar}
                  alt={selectedFriendForChat.name}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">
                      {selectedFriendForChat.name}
                    </span>
                    {selectedFriendForChat.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {selectedFriendForChat.status === 'in_trade'
                      ? '🟢 Скальпить на ринку прямо зараз'
                      : '🟢 Онлайн'}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-cyan-400" />
                  <span className="text-base font-bold text-white">
                    Загальний чат трейдерів h00k
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Обмін ситуаціями, скріншотами, розʼїданням плотностей у стаканах
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
              Поки що немає повідомлень у цьому діалозі. Напишіть привітання або поділіться ситуацією по монеті!
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMine ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5"
                  />
                  <div
                    className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-slate-950 font-medium'
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}
                  >
                    {!isMine && (
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="font-bold text-cyan-400 text-[11px]">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Attached Coin Snippet */}
                    {msg.coinSnippet && (
                      <div className="mt-2 bg-slate-900/90 text-white p-2 rounded-xl border border-slate-700/80 font-mono flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-black text-cyan-300 mr-2">
                            {msg.coinSnippet.symbol}
                          </span>
                          <span>${msg.coinSnippet.price}</span>
                        </div>
                        <span
                          className={
                            msg.coinSnippet.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }
                        >
                          {msg.coinSnippet.change24h >= 0 ? '+' : ''}{msg.coinSnippet.change24h}%
                        </span>
                      </div>
                    )}

                    {isMine && (
                      <div className="text-[9px] text-slate-950/70 font-mono text-right mt-1">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/80 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isDirect
                ? `Повідомлення для @${selectedFriendForChat?.handle}...`
                : 'Повідомлення у загальний чат скальперів...'
            }
            className="flex-1 bg-slate-900 text-xs text-slate-100 px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
