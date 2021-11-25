export const parseToBeam = (groth) => {
  const numb = groth / 100000000;
  return String(numb.toFixed(8).replace(/\.?0+$/, ''));
};
export const parseToGroth = (beams) => {
  const numb = Math.ceil(beams * 100000000);
  return String(numb);
};
