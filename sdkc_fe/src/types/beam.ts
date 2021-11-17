export type PropertiesType<T> = T extends { [key: string]: infer U }
  ? U
  : never;

export interface IAssetMeta {
  N: string;
  OPT_COLOR: string;
}

export interface BeamApiRes {
  id: string;
  jsonrpc: string;
  result: {
    output?: string;
    txid: string;
    txId: string;
    raw_data: number[];
    comment: string;
    status_string: string;
    failure_reason: string;
    metadata_pairs: IAssetMeta;
  };
  error?: {
    code:number;
    message: string;
  }
}
