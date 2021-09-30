export enum AppSpecs {
  CID = 'fe36e8eafa7657975951c7d1c85e10121949a06860e460471fec5d87a444e03c',
  TITLE = 'GEM-PUZZLE',
  TX_CHECK_INTERVAL = 3000,
  MAX_MOVES = 400
}
// 8bc7e10eb2b17e72540b7217d80b23c2eff80450f49c3f6518f6a77a6ff4acaf - w/o bet
// fe36e8eafa7657975951c7d1c85e10121949a06860e460471fec5d87a444e03c -bet aid!==0

export enum ReqID {
  CHECK = 'CHECK',
  CHECK_SOLUTION = 'CHECK_SOLUTION',
  INVOKE_DATA = 'INVOKE_DATA',
  START_GAME = 'START_GAME',
  VIEW_BOARD = 'VIEW_BOARD',
  CANCEL_GAME = 'CANCEL_GAME',
  TX_STATUS = 'TX_STATUS',
  VIEW_CONTRACTS = 'VIEW_CONTRACTS',
  DESTROY = 'DESTROY',
  VIEW_CHECK_RESULT = 'VIEW_CHECK_RESULT',
  GET_PKEY = 'GET_PKEY',
  VIEW_TOPS = 'VIEW_TOPS',
  TAKE_PENDING_REWARDS = 'TAKE_PENDING_REWARDS',
  VIEW_MY_PENDING_REWARDS = 'VIEW_MY_PENDING_REWARDS',
  HAS_ACTIVE_GAME = 'HAS_ACTIVE_GAME',
  VIEW_MY_INFO = 'VIEW_MY_INFO',
  DONATE = 'DONATE',
  VIEW_CONTRACT_PARAMS = 'VIEW_CONTRACT_PARAMS',
  VIEW_ASSET_INFO = 'VIEW_ASSET_INFO',
  VIEW_PRIZE_FUND = 'VIEW_PRIZE_FUND'
}

export enum ReqRoles {
  PLAYER = 'player',
  MANAGER = 'manager'
}

export enum ReqMethods {
  INVOKE_CONTRACT = 'invoke_contract',
  PROCESS_INVOKE_DATA = 'process_invoke_data',
  TX_STATUS = 'tx_status',
  GET_ASSET_INFO = 'get_asset_info'
}

export enum ReqActions {
  CREATE_CONTRACT = 'create_contract',
  VIEW_CONTRACTS = 'view_contracts',
  NEW_GAME = 'new_game',
  CHECK_SOLUTION = 'check_solution',
  VIEW_CURRENT_BOARD = 'view_current_game_board',
  END_CURRENT_GAME = 'end_current_game',
  DESTROY_CONTRACT = 'destroy_contract',
  VIEW_CHECK_RESULT = 'view_check_result',
  VIEW_TOPS = 'view_tops',
  TAKE_PENDING_REWARDS = 'take_pending_rewards',
  GET_MY_INFO = 'get_my_info',
  DONATE = 'donate',
  VIEW_CONTRACT_PARAMS = 'view_contract_params',
  VIEW_PRIZE_FUND = 'view_prize_fund'
}

export enum ResTXStatus {
  IN_PROGRESS = 'in progress',
  FAILED = 'failed',
  COMPLETED = 'completed'
}

export enum ResTXComment{
  CREATE_NEW_GAME = 'Taking your bet...',
  ENDING_EXISTING_GAME = 'Ending existing game',
  CHECKIN_SOLUTION = 'Checking your solution...',
  TAKING_PENDING_REWARS = 'Taking pending rewards'
}
