export enum AppSpecs {
  CID = 'a731ca3feab1049f77e55bc49542a5ce15e8b93aac7f4b2469a242ac6aa745aa',
  TITLE = 'PYATNASHKI',
  TX_CHECK_INTERVAL = 3000
}

export enum ReqID {
  CHECK = 'CHECK',
  INVOKE_DATA = 'INVOKE_DATA',
  START_GAME = 'START_GAME',
  VIEW_BOARD = 'VIEW_BOARD',
  CANCEL_GAME = 'CANCEL_GAME',
  TX_STATUS = 'TX_STATUS',
  VIEW_CONTRACTS = 'VIEW_CONTRACTS',
  DESTROY = 'DESTROY'
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
  VIEW_CONTRACTS = 'view_contracts',
  NEW_GAME = 'new_game',
  CHECK_SOLUTION = 'check_solution',
  VIEW_CURRENT_BOARD = 'view_current_game_board',
  END_CURRENT_GAME = 'end_current_game',
  DESTROY_CONTRACT = 'destroy_contract'
}

export enum ResTXStatus {
  IN_PROGRESS = 'in progress',
  FAILED = 'Failed',
  COMPLETED = 'completed'
}
