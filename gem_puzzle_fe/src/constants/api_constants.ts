export enum AppSpecs {
  CID = '596f78d9d2ef4d12b0387e9c191ee45f43ca328f2a17b91664884f4847071c6f',
  TITLE = 'PYATNASHKI'
}

export enum ReqID {
  CHECK = 'CHECK',
  INVOKE_DATA = 'INVOKE_DATA',
  START_GAME = 'START_GAME',
  VIEW_BOARD = 'VIEW_BOARD',
  EXIT_GAME = 'EXIT_GAME'
}

export enum ReqMethods {
  INVOKE_CONTRACT = 'invoke_contract',
  PROCESS_INVOKE_DATA = 'process_invoke_data'
}

export enum ReqActions {
  NEW_GAME = 'new_game',
  CHECK_SOLUTION = 'check_solution',
  VIEW_CURRENT_BOARD = 'view_current_game_board',
}
