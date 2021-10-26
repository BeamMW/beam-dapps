export const isJson = (str:unknown):boolean => {
  try {
    const parsed = JSON.parse(str as string);
    return typeof parsed === 'object';
  } catch (e) {
    return false;
  }
};

export const toDOMParser = (str: string): HTMLElement => new DOMParser()
  .parseFromString(str, 'application/xml').documentElement;
