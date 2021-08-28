export const isJson = (str:string):boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

type ReqArgsType = {
  [key:string] : string
};

export const argsStringify = (args: ReqArgsType):string => Object.entries(args)
  .map((arg) => arg.join('='))
  .join(',');
