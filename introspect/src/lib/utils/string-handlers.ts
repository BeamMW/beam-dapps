export const isJson = (str:unknown):boolean => {
  try {
    const parsed = JSON.parse(str as string);
    return typeof parsed === 'object';
  } catch (e) {
    return false;
  }
};

export const beforeLoadMessage = (appname: string):string => `
To use ${
  appname
} you should have BEAM Web Wallet installed and allow connection.`;

export const toDOMParser = (str: string): HTMLElement => new DOMParser()
  .parseFromString(str, 'application/xml').documentElement;

export const argsStringify = (
  args: { [key: string]: string }
): string => Object.entries(args)
  .filter((arg) => arg[1].length)
  .map((arg) => arg.join('='))
  .join(',');

export const makeDotted = (str: string):string => {
  if (str.length > 23) {
    const left = str.split('').splice(0, 10).join('');
    const right = str.split('').splice(str.length - 10, 10).join('');
    return `${left}...${right}`;
  } return str;
};
