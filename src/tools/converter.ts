import BigNumber from 'bignumber.js';
import { ZERO } from '@/config/const';

export function timesDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.times(decimals);
  return bigA.times(`1e${decimals}`);
}

export function divDecimals(val?: BigNumber.Value, decimals: string | number = 18) {
  if (!val) return ZERO;
  const bigA = ZERO.plus(val);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.div(decimals);
  return bigA.div(`1e${decimals}`);
}