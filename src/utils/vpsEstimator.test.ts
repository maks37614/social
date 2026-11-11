import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateVPSLoad } from './vpsEstimator';

test('calculates reasonable baseline VPS load for small community', () => {
  const result = calculateVPSLoad({
    usersCount: 50,
    symbolsCount: 50,
    screenerRefreshHz: 1,
    chatActiveUsers: 10,
  });

  assert.ok(result.totalCpuPercent > 0 && result.totalCpuPercent < 100);
  assert.ok(result.totalRamMb > 300 && result.totalRamMb < 4000);
  assert.equal(result.recommendedCores, 2);
  assert.ok(result.architectureAdvice.length >= 3);
});

test('scales resource metrics when community grows to 1000 users', () => {
  const small = calculateVPSLoad({
    usersCount: 50,
    symbolsCount: 100,
    screenerRefreshHz: 1,
    chatActiveUsers: 10,
  });

  const large = calculateVPSLoad({
    usersCount: 1000,
    symbolsCount: 100,
    screenerRefreshHz: 1,
    chatActiveUsers: 250,
  });

  assert.ok(large.socialCpuPercent > small.socialCpuPercent);
  assert.ok(large.totalRamMb > small.totalRamMb);
  assert.ok(large.recommendedCores >= 4);
  assert.ok(large.networkOutMbps > small.networkOutMbps);
});
