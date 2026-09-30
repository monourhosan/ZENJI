process.env.NODE_ENV = 'test';

import { zenFlowService } from './zenFlowService';
import type { ZenClickEvent } from '../types/zenFlow';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧘 ZENJI: Zen Flow Challenge — Automated Verification');
  console.log('======================================================\n');

  // Test 1: Start Session
  console.log('Test 1: Start Session Initialization');
  const session = await zenFlowService.startSession();
  assert(Boolean(session.session_id), 'Session ID generated');
  assert(session.game_seed > 0, 'Cryptographic game seed created');
  assert(Boolean(session.server_date), 'Server date resolved');
  assert(Boolean(session.started_at), 'Start timestamp initialized');

  // Test 2: Standard Clean Game Scoring & Combo Multipliers
  console.log('\nTest 2: Standard Clean Gameplay Scoring & Combos');
  // Simulate 16 consecutive hits:
  // Hits 1-4: 1x multiplier. Let reaction = 500ms (fast bonus = +10) -> (10 + 10) * 1 = 20 pts each => 80 pts
  // Hits 5-9: 2x multiplier. Fast reaction -> (10 + 10) * 2 = 40 pts each (5 hits) => 200 pts
  // Hits 10-14: 3x multiplier. Fast reaction -> (10 + 10) * 3 = 60 pts each (5 hits) => 300 pts
  // Hit 15: 4x multiplier. Fast reaction -> (10 + 10) * 4 = 80 pts (1 hit) => 80 pts
  // Total expected score: 80 + 200 + 300 + 80 = 660 pts
  const cleanEvents: ZenClickEvent[] = [];
  for (let i = 0; i < 15; i++) {
    cleanEvents.push({
      event_id: `ev_${i}`,
      object_id: `obj_${i}`,
      object_type: 'lotus',
      event_type: 'hit',
      timestamp_ms: 1000 + i * 2000,
      spawn_timestamp_ms: 500 + i * 2000,
      reaction_ms: 500, // fast reaction bonus eligible
      x: 50,
      y: 50,
    });
  }

  const cleanResult = await zenFlowService.submitSession({
    session_id: session.session_id,
    game_seed: session.game_seed,
    duration_seconds: 60,
    events: cleanEvents,
    client_score: 660,
  });

  assert(cleanResult.audit_passed === true, 'Anti-cheat audit passed for legitimate game');
  assert(cleanResult.verified_score === 660, `Score accurately calculated server-side (Expected 660, got ${cleanResult.verified_score})`);
  assert(cleanResult.max_combo === 4, `Max combo scaled to x4 (Got x${cleanResult.max_combo})`);
  assert(cleanResult.hits_count === 15, 'Hits recorded accurately');
  assert(cleanResult.misses_count === 0, 'Zero misses recorded');

  // Test 3: Miss Tap Penalty & Combo Break
  console.log('\nTest 3: Miss Tap Penalty & Combo Reset');
  const session2 = await zenFlowService.startSession();
  const mixedEvents: ZenClickEvent[] = [
    // 5 hits (reach 2x combo)
    ...Array.from({ length: 5 }, (_, i) => ({
      event_id: `hit_${i}`,
      object_id: `obj_${i}`,
      object_type: 'water_drop' as const,
      event_type: 'hit' as const,
      timestamp_ms: 1000 + i * 1500,
      spawn_timestamp_ms: 500 + i * 1500,
      reaction_ms: 900, // normal tap, no fast bonus: +10 pts each. Hits 1-4 = 10*4 = 40. Hit 5 = 10*2 = 20. Total: 60 pts
      x: 40,
      y: 40,
    })),
    // 1 miss tap: -5 pts, breaks combo
    {
      event_id: 'miss_1',
      object_id: 'none',
      object_type: 'leaf' as const,
      event_type: 'miss' as const,
      timestamp_ms: 10000,
      spawn_timestamp_ms: 0,
      x: 10,
      y: 10,
    },
    // Next hit should be back to 1x multiplier! Normal tap = +10 pts
    {
      event_id: 'hit_after_miss',
      object_id: 'obj_after',
      object_type: 'crystal' as const,
      event_type: 'hit' as const,
      timestamp_ms: 12000,
      spawn_timestamp_ms: 11000,
      reaction_ms: 1000,
      x: 50,
      y: 50,
    },
  ];
  // Expected score: 60 - 5 + 10 = 65 pts
  const mixedResult = await zenFlowService.submitSession({
    session_id: session2.session_id,
    game_seed: session2.game_seed,
    duration_seconds: 60,
    events: mixedEvents,
  });
  assert(mixedResult.verified_score === 65, `Miss tap deducted 5 points and reset combo (Expected 65, got ${mixedResult.verified_score})`);
  assert(mixedResult.misses_count === 1, '1 miss registered');

  // Test 4: Anti-Cheat Inhuman Reflex Detection (< 140ms)
  console.log('\nTest 4: Anti-Cheat Inhuman Reflex Detection (< 140ms)');
  const session3 = await zenFlowService.startSession();
  const botEvents: ZenClickEvent[] = [
    {
      event_id: 'bot_hit_1',
      object_id: 'obj_bot',
      object_type: 'energy_circle',
      event_type: 'hit',
      timestamp_ms: 1050,
      spawn_timestamp_ms: 1000,
      reaction_ms: 50, // 50ms is physiologically impossible for human visual reaction
      x: 50,
      y: 50,
    },
  ];
  const botResult = await zenFlowService.submitSession({
    session_id: session3.session_id,
    game_seed: session3.game_seed,
    duration_seconds: 60,
    events: botEvents,
  });
  assert(botResult.audit_passed === false, 'Bot inhuman reflex flagged as fraud');
  assert(Boolean(botResult.validation_notes?.some(n => n.includes('Inhuman reaction speed'))), 'Validation note explicitly identifies inhuman reflex');

  // Test 5: Leaderboard & Daily Reset
  console.log('\nTest 5: Leaderboard Retrieval & Daily Reset');
  const lb = await zenFlowService.getLeaderboard();
  assert(lb.entries.length >= 5, 'Leaderboard contains top players');
  assert(lb.entries[0].rank === 1, '#1 player is at rank 1');
  assert(lb.time_until_reset_seconds >= 0 && lb.time_until_reset_seconds <= 86400, 'Time until midnight reset calculated');

  // Test 6: User Profile & Zen Level Progression
  console.log('\nTest 6: User Profile & Zen Level Progression');
  const profile = await zenFlowService.getProfile();
  assert(profile.games_played >= 1, 'Games played incremented');
  assert(profile.zen_level >= 1, 'Zen level calculated');
  assert(Boolean(profile.username), 'Username present');

  // Test 7: Scalable Rewards Architecture
  console.log('\nTest 7: Scalable Rewards System');
  const rewards = await zenFlowService.getRewards();
  assert(rewards.length >= 2, 'Available rewards retrieved');
  const couponReward = rewards.find(r => r.reward_type === 'coupons');
  assert(Boolean(couponReward?.metadata?.promo_code), 'Coupon reward contains promo code');

  console.log('\n======================================================');
  console.log('✅ ALL TEST SUITES PASSED! ZEN FLOW ENGINE READY');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test Run Error:\n', err);
  process.exit(1);
});
