import { BeamAmmount } from '../constants/app';

export const boardSchemeMaker = (
  length: number
): string => `${length}x${length}`;

export const toDOMParser = (str: string):HTMLElement => new DOMParser()
  .parseFromString(str, 'application/xml').documentElement;

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

export const parseToGroth = (beams: number):string => {
  const numb = Math.ceil(beams * BeamAmmount.GROTHS_IN_BEAM);
  return String(numb);
};

export const parseToBeam = (groth: number):string => {
  const numb = groth / BeamAmmount.GROTHS_IN_BEAM;
  return String(numb);
};

export const boxPozition = (numb: number): { x: number, y:number } | null => {
  switch (numb) {
    case 1:
      return { x: 0, y: 0 };
    case 2:
      return { x: 1, y: 0 };
    case 3:
      return { x: 2, y: 0 };
    case 4:
      return { x: 3, y: 0 };
    case 5:
      return { x: 0, y: 1 };
    case 6:
      return { x: 1, y: 1 };
    case 7:
      return { x: 2, y: 1 };
    case 8:
      return { x: 3, y: 1 };
    case 9:
      return { x: 0, y: 2 };
    case 10:
      return { x: 1, y: 2 };
    case 11:
      return { x: 2, y: 2 };
    case 12:
      return { x: 3, y: 2 };
    case 13:
      return { x: 0, y: 3 };
    case 14:
      return { x: 1, y: 3 };
    case 15:
      return { x: 2, y: 3 };
    default:
      return null;
  }
};
