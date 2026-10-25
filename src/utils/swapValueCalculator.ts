/**
 * Transparent rule-based swap value calculator for ReWear
 * Determines fair indicative exchange value based on garment parameters
 */

export type GarmentCondition = 'New with tags' | 'Like new' | 'Gently worn' | 'Good';

export type GarmentCategory =
  | 'Tops'
  | 'Shirts'
  | 'Jeans & Pants'
  | 'Dresses'
  | 'Jackets & Coats'
  | 'Ethnic Wear'
  | 'Shoes'
  | 'Bags'
  | 'Accessories';

export type AgeEra = 'Current season' | '1-3 years' | '4-7 years' | 'Vintage (15+ years)';

export type MaterialTier =
  | 'Noble Natural (Linen, Silk, Cashmere, Merino)'
  | 'Sustainable Natural (Organic Cotton, Hemp, Tencel)'
  | 'Standard Natural (Cotton, Wool blend)'
  | 'Synthetic or Blend';

export type BrandTier =
  | 'Artisanal / Luxury'
  | 'Sustainable Premium'
  | 'Contemporary Classic'
  | 'High-Street';

export interface SwapValueInput {
  originalPrice: number;
  category: GarmentCategory;
  condition: GarmentCondition;
  ageEra?: AgeEra;
  material?: MaterialTier;
  brandTier?: BrandTier;
}

export interface SwapValueResult {
  indicativeValue: number;
  swapCredits: number;
  conditionMultiplier: number;
  ageMultiplier: number;
  materialMultiplier: number;
  brandMultiplier: number;
  formulaSummary: string;
  explanation: string[];
}

export const CONDITION_MULTIPLIERS: Record<GarmentCondition, number> = {
  'New with tags': 0.70,
  'Like new': 0.55,
  'Gently worn': 0.40,
  'Good': 0.25,
};

export const AGE_MULTIPLIERS: Record<AgeEra, number> = {
  'Current season': 1.05,
  '1-3 years': 1.00,
  '4-7 years': 0.85,
  'Vintage (15+ years)': 1.25,
};

export const MATERIAL_MULTIPLIERS: Record<MaterialTier, number> = {
  'Noble Natural (Linen, Silk, Cashmere, Merino)': 1.15,
  'Sustainable Natural (Organic Cotton, Hemp, Tencel)': 1.08,
  'Standard Natural (Cotton, Wool blend)': 1.00,
  'Synthetic or Blend': 0.85,
};

export const BRAND_MULTIPLIERS: Record<BrandTier, number> = {
  'Artisanal / Luxury': 1.15,
  'Sustainable Premium': 1.08,
  'Contemporary Classic': 1.00,
  'High-Street': 0.88,
};

export function calculateSwapValue(input: SwapValueInput): SwapValueResult {
  const basePrice = Math.max(10, input.originalPrice || 50);
  const conditionMult = CONDITION_MULTIPLIERS[input.condition] ?? 0.40;
  const ageMult = input.ageEra ? (AGE_MULTIPLIERS[input.ageEra] ?? 1.0) : 1.0;
  const materialMult = input.material ? (MATERIAL_MULTIPLIERS[input.material] ?? 1.0) : 1.0;
  const brandMult = input.brandTier ? (BRAND_MULTIPLIERS[input.brandTier] ?? 1.0) : 1.0;

  // Compute total value
  const rawValue = basePrice * conditionMult * ageMult * materialMult * brandMult;
  // Floor at $10 minimum for any swappable item
  const indicativeValue = Math.max(10, Math.round(rawValue));
  const swapCredits = indicativeValue;

  const explanation: string[] = [
    `Original price baseline: $${basePrice.toFixed(0)}`,
    `Condition factor (${input.condition}): ${(conditionMult * 100).toFixed(0)}% retention`,
  ];

  if (input.ageEra) {
    explanation.push(`Era factor (${input.ageEra}): x${ageMult.toFixed(2)}`);
  }
  if (input.material) {
    explanation.push(`Material profile (${input.material}): x${materialMult.toFixed(2)}`);
  }
  if (input.brandTier) {
    explanation.push(`Brand category (${input.brandTier}): x${brandMult.toFixed(2)}`);
  }

  const formulaSummary = `$${basePrice} × ${conditionMult} × ${ageMult} × ${materialMult} × ${brandMult} = $${indicativeValue}`;

  return {
    indicativeValue,
    swapCredits,
    conditionMultiplier: conditionMult,
    ageMultiplier: ageMult,
    materialMultiplier: materialMult,
    brandMultiplier: brandMult,
    formulaSummary,
    explanation,
  };
}

export interface SwapComparisonResult {
  offeredValue: number;
  requestedValue: number;
  difference: number;
  ratio: number;
  verdict: 'Fair exchange' | 'Slight value variance' | 'Significant difference';
  guidance: string;
}

export function compareSwapItems(offeredValue: number, requestedValue: number): SwapComparisonResult {
  const diff = offeredValue - requestedValue;
  const higher = Math.max(offeredValue, requestedValue, 1);
  const lower = Math.min(offeredValue, requestedValue);
  const ratio = lower / higher;

  let verdict: 'Fair exchange' | 'Slight value variance' | 'Significant difference';
  let guidance: string;

  if (ratio >= 0.80) {
    verdict = 'Fair exchange';
    guidance = 'Both items have comparable estimated values. A direct 1-to-1 swap is highly balanced.';
  } else if (ratio >= 0.60) {
    verdict = 'Slight value variance';
    guidance = Math.abs(diff) < 30
      ? 'A minor difference in estimated values. Consider bundling a small accessory or negotiating in chat.'
      : 'Moderate variance. The sender may offer an additional item to balance the exchange.';
  } else {
    verdict = 'Significant difference';
    guidance = 'A noticeable value gap exists. We recommend offering a second item or discussing in messages.';
  }

  return {
    offeredValue,
    requestedValue,
    difference: diff,
    ratio: Number(ratio.toFixed(2)),
    verdict,
    guidance,
  };
}
