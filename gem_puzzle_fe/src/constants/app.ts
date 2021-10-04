export enum StoreActions {
  SET_TIME = 'SET_TIME',
  SET_MODE = 'SET_MODE',
  SET_MOVE = 'SET_MOVE',
  SET_PIC = 'SET_PIC',
  SET_RATE = 'SET_RATE',
  SET_PKEY = 'SET_PKEY',
  SET_PIC_OPT = 'SET_PIC_OPT',
  SET_ACTIVE = 'SET_ACTIVE',
  SET_AUTOPLAY = 'SET_AUTOPLAY',
  SET_REWARD = 'SET_REWARD',
  SET_TX = 'SET_TX',
  SET_MY_INFO = 'SET_MY_INFO',
  SET_POPUP = 'SET_POPUP',
  SET_PRIZE_FUND = 'SET_PRIZE_FUND',
  SET_ASSET_NAME = 'SET_ASSET_NAME'
}

export enum CidActions {
  SET_CID_PARAMS = 'SET_CID_PARAMS'
}

export enum GridActions {
  SET_GRID = 'SET_GRID',
  SET_STATUS = 'SET_STATUS',
  SET_SOLUTION = 'SET_SOLUTION',
  SET_GAME = 'SET_GAME'
}

export enum PopupKeys {
  WIN = 'WIN',
  LOSE = 'LOSE',
  TIME_OUT = 'TIME_OUT',
  LIMIT = 'LIMIT',
  DONATE = 'DONATE'
}

export const BOARD_EXAMPLE = JSON.stringify(
  [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ]
);

export enum BeamAmmount {
  MIN_AMOUNT = 0,
  MAX_AMOUNT = 10,
  GROTHS_IN_BEAM = 100000000
}

export enum MenuBtn {
  NEW = 'NEW',
  CONTINUE = 'CONTINUE',
  OPTIONS = 'OPTIONS',
  RETURN = 'RETURN',
  BEST = 'BEST',
  CLAIM_REWARD = 'CLAIM_REWARD',
  DONATE = 'DONATE',
  SET_ACTIVE = 'SET_ACTIVE'
}

export enum RouterMode {
  HISTORY = 'history',
  HASH = 'hash'
}

export enum Routes {
  OPTIONS = 'options',
  RETURN = 'return',
  MAIN = '/',
  BEST = 'best',
  PLAY = 'play'
}

// export enum Routes {
//   OPTIONS = 'beam-dapps/options',
//   RETURN = 'beam-dapps/return',
//   MAIN = '/beam-dapps',
//   BEST = 'beam-dapps/best',
//   PLAY = 'beam-dapps/play'
// }
