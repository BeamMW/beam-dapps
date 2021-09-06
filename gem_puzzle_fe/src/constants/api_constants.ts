export enum AppSpecs {
  CID = '68940a43a84500500d75d05ff988feccd8b743819b79f7c11503a4da5e3dd109',
  TITLE = 'PYATNASHKI',
  TX_CHECK_INTERVAL = 3000
}

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
  INVOKE_DATA_SOLUTION = 'INVOKE_DATA_SOLUTION',
  TX_CHECK_SOLUTION = 'TX_CHECK_SOLUTION',
  VIEW_CHECK_RESULT = 'VIEW_CHECK_RESULT',
  GET_PKEY = 'GET_PKEY'
}

export enum ReqRoles {
  PLAYER = 'player',
  MANAGER = 'manager'
}

export enum ReqMethods {
  INVOKE_CONTRACT = 'invoke_contract',
  PROCESS_INVOKE_DATA = 'process_invoke_data',
  TX_STATUS = 'tx_status'
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
  GET_MY_PKEY = 'get_my_pkey'
}

export enum ResTXStatus {
  IN_PROGRESS = 'in progress',
  FAILED = 'Failed',
  COMPLETED = 'completed'
}
