export const isJson = (str:unknown):boolean => {
  try {
    JSON.parse(str as string);
  } catch (e) {
    return false;
  }
  return true;
};
