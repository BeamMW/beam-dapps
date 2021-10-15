export enum ShaderProps {
  MAX_FILE_SIZE = 5000000,
  TX_CHECK_INTERVAL = 3000,
  MAX_TX_COUNT = 3
}

export enum ReqID {
  FORM_GENERATOR = 'FORM_GENERATOR',
  SUBMIT_RESULT = 'SUBMIT_RESULT',
  INVOKE_DATA = 'INVOKE_DATA',
  TX_STATUS = 'TX_STATUS'
}

export enum ReqMethods {
  INVOKE_CONTRACT = 'invoke_contract',
  PROCESS_INVOKE_DATA = 'process_invoke_data',
  TX_STATUS = 'tx_status'
}

export enum ResTXStatus {
  IN_PROGRESS = 'in progress',
  FAILED = 'failed',
  COMPLETED = 'completed'
}

export enum FormActions {
  SET_ROLE = 'SET_ROLE',
  SET_ACTION = 'SET_ACTION',
  SET_PARAM_VALUE = 'SET_PARAM_VALUE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  SET_ONLOAD = 'SET_ONLOAD',
  DELETE_ONLOAD = 'DELETE_ONLOAD',
  SET_FILENAME = 'SET_FILENAME',
  SET_TXS = 'SET_TXS',
  REMOVE_TXS = 'REMOVE_TXS'
}

export enum ErrorResponses {
  REJECTED = 'Call is rejected by user',
  CALL_FAILED = 'Contract call failed'
}
