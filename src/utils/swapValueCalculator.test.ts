import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSwapValue,
  compareSwapItems,
  CONDITION_MULTIPLIERS,
} from './swapValueCalculator.ts';

test('calculateSwapValue calculates correct value for new with tags item', () => {
  const result = calculateSwapValue({
    originalPrice: 100,
    category: 'Dresses',
    condition: 'New with tags',
  });

  // 100 * 0.70 = 70
  assert.equal(result.indicativeValue, 70);
  assert.equal(result.conditionMultiplier, CONDITION_MULTIPLIERS['New with tags']);
  assert.equal(result.swapCredits, 70);
  assert.ok(result.explanation.length >= 2);
});

test('calculateSwapValue applies era and material premiums', () => {
  const result = calculateSwapValue({
    originalPrice: 200,
    category: 'Jackets & Coats',
    condition: 'Like new', // 0.55 -> 110
    ageEra: 'Vintage (15+ years)', // 1.25 -> 137.5
    material: 'Noble Natural (Linen, Silk, Cashmere, Merino)', // 1.15 -> 158.125
    brandTier: 'Artisanal / Luxury', // 1.15 -> 181.84
  });

  assert.equal(result.indicativeValue, 182);
  assert.equal(result.ageMultiplier, 1.25);
  assert.equal(result.materialMultiplier, 1.15);
  assert.equal(result.brandMultiplier, 1.15);
});

test('calculateSwapValue respects minimum floor of $10', () => {
  const result = calculateSwapValue({
    originalPrice: 15,
    category: 'Accessories',
    condition: 'Good', // 0.25 -> 3.75 -> floored to 10
  });

  assert.equal(result.indicativeValue, 10);
});

test('compareSwapItems evaluates fair vs disparate swaps', () => {
  const fair = compareSwapItems(80, 85);
  assert.equal(fair.verdict, 'Fair exchange');
  assert.equal(fair.difference, -5);

  const disparate = compareSwapItems(30, 150);
  assert.equal(disparate.verdict, 'Significant difference');
  assert.ok(disparate.ratio < 0.6);
});
