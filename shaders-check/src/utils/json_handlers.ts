import { IActionParams } from 'beamApiProps';

export const isJson = (str:unknown):boolean => {
  try {
    JSON.parse(str as string);
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

export const paramsObjectCreator = (params: IActionParams):IActionParams => {
  const obj = {};
  Object.keys(params).forEach((param) => {
    Object.defineProperty(obj, param, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ''
    });
  });
  return obj;
};
