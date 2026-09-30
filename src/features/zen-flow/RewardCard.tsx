import React, { useState } from 'react';
import { Gift, Award, Tag, Sparkles, Check, Copy, Clock, ShieldCheck } from 'lucide-react';
import type { ZenReward, ZenRewardType } from '../../types/zenFlow';
import { zenFlowService } from '../../services/zenFlowService';

interface RewardCardProps {
  reward: ZenReward;
  onClaimSuccess?: (reward: ZenReward) => void;
}

const getRewardIcon = (type: ZenRewardType) => {
  switch (type) {
    case 'badge':
      return <Award className="w-5 h-5 text-[#ccff00]" />;
    case 'coupons':
      return <Tag className="w-5 h-5 text-amber-400" />;
    case 'premium_days':
      return <Sparkles className="w-5 h-5 text-cyan-400" />;
    case 'coins':
      return <Gift className="w-5 h-5 text-emerald-400" />;
    case 'nft':
      return <ShieldCheck className="w-5 h-5 text-purple-400" />;
    default:
      return <Gift className="w-5 h-5 text-[#ccff00]" />;
  }
};

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onClaimSuccess }) => {
  const [claiming, setClaiming] = useState(false);
  const [copied, setCopied] = useState(false);
  const isClaimed = Boolean(reward.claimed_at);

  const handleClaim = async () => {
    if (isClaimed || claiming) return;
    setClaiming(true);
    try {
      const updated = await zenFlowService.claimReward(reward.id);
      if (updated && onClaimSuccess) {
        onClaimSuccess(updated);
      }
    } finally {
      setClaiming(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
        isClaimed
          ? 'bg-white/60 dark:bg-[#121216]/60 border-neutral-200 dark:border-white/10 opacity-90'
          : 'bg-gradient-to-br from-white to-neutral-50 dark:from-[#18181f] dark:to-[#121216] border-[#ccff00]/40 dark:border-[#ccff00]/30 shadow-md'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-white/10 flex items-center justify-center">
              {getRewardIcon(reward.reward_type)}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400">
              {reward.reward_type.toUpperCase()}
            </span>
          </div>

          {isClaimed ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              <Check className="w-3 h-3" />
              Claimed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-[#ccff00] font-bold uppercase tracking-wider animate-pulse">
              <Clock className="w-3 h-3" />
              Ready to Claim
            </span>
          )}
        </div>

        <h4 className="font-heading font-bold text-base text-neutral-950 dark:text-white mb-1">
          {reward.title}
        </h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
          {reward.description}
        </p>

        {/* Promo code copy box if coupon */}
        {reward.metadata?.promo_code && (
          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Promo Code
              </span>
              <span className="font-mono font-black text-sm text-neutral-950 dark:text-[#ccff00]">
                {reward.metadata.promo_code}
              </span>
            </div>
            <button
              onClick={() => handleCopyCode(reward.metadata.promo_code)}
              className="p-1.5 rounded-lg bg-white dark:bg-white/10 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Copy code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-mono font-bold text-emerald-500">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">COPY</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
          Earned: {reward.date}
        </span>

        {!isClaimed && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="px-4 py-1.5 rounded-full bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-transform active:scale-95 cursor-pointer shadow-sm"
          >
            {claiming ? 'Claiming...' : 'Claim Reward'}
          </button>
        )}
      </div>
    </div>
  );
};
