export enum AppStateActions {
  SET_TIME = 'SET_TIME',
  SET_MODE = 'SET_MODE',
  SET_MOVE = 'SET_MOVE',
  SET_PIC = 'SET_PIC',
  SET_RATE = 'SET_RATE',
  SET_PKEY = "SET_PKEY"
}

export enum BeamAmmount {
  MIN_AMOUNT = 0,
  MAX_AMOUNT = 100,
  GROTHS_IN_BEAM = 100000000
}

export enum MenuBtn {
  NEW = 'NEW',
  CONTINUE = 'CONTINUE',
  OPTIONS = 'OPTIONS',
  CANCEL = 'CANCEL',
  VIEW_CONTRACTS = 'VIEW_CONTRACTS',
  DESTROY_CONTRACT = 'DESTROY_CONTRACT',
  RETURN = 'RETURN',
  BEST = 'BEST'
}

export enum RouterMode {
  HISTORY = 'history',
  HASH = 'hash'
}

export enum Routes {
  OPTIONS = 'options',
  RETURN = 'return',
  MAIN = '/',
  BEST = 'best'
}
