import { BeamAmmount } from '../constants/app_constants';

export const boardSchemeMaker = (
  length: number
): string => `${length}x${length}`;

export const handleString = (next:string):boolean => {
  let result = true;
  const regex = new RegExp(/^-?\d+(\.\d*)?$/g);
  const floatValue = parseFloat(next);
  const afterDot = next.indexOf('.') > 0
    ? next.substring(next.indexOf('.') + 1)
    : '0';
  if (
    (next && !String(next).match(regex))
    || (String(next).length > 1
    && String(next)[0] === '0'
    && next.indexOf('.') < 0)
    || (parseInt(afterDot, 10) === 0 && afterDot.length > 7)
    || afterDot.length > 8
    || (floatValue === 0 && next.length > 1 && next[1] !== '.')
    || (floatValue < 1 && next.length > 10)
    || (floatValue > 0 && (
      floatValue < BeamAmmount.MIN_AMOUNT || floatValue > BeamAmmount.MAX_AMOUNT
    ))
  ) {
    result = false;
  }
  return result;
};

export const parseToGroth = (beams: number):string => (
  (<string>(beams * (10 ** (-8))).toPrecision(10).split('e')[0])
    .split('.').join('').slice(0, -1)
);
