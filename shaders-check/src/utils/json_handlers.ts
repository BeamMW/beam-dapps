export const isJson = (str:unknown):boolean => {
  try {
    JSON.parse(str as string);
  } catch (e) {
    return false;
  }
  return true;
};

export const toDOMParser = (str: string): HTMLElement => new DOMParser()
  .parseFromString(str, 'application/xml').documentElement;
