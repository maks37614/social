/**
 * Formats crypto prices accurately:
 * Large prices (BTC, ETH, SOL) with commas or 2 decimals
 * Meme coins (PEPE, SHIB) with full decimals (up to 8 decimal places)
 */
export function formatCryptoPrice(price: number): string {
  if (price === 0) return '0.00';
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return price.toFixed(2);
  }
  if (price >= 0.01) {
    return price.toFixed(4);
  }
  // Sub-cent meme coins (e.g. PEPE 0.00001925)
  return price.toFixed(8).replace(/0+$/, '');
}
