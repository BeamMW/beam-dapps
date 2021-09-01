export enum ShaderProps {
  MAX_FILE_SIZE = 5000000,
  TX_CHECK_INTERVAL = 3000
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
  UNSUBSCRIBE = 'UNSUBSCRIBE'
}
