export const RC = {
  getMyPKey: () => ({
    id: 'get_my_pkey',
    method: 'invoke_contract',
    params: {
      args: {
        role: 'artist',
        action: 'get_key',
      },
      create_tx: false,
    },
  }),
  uploadFile: (pkArtist, data) => ({
    id: 'upload',
    method: 'invoke_contract',
    params: {
      args: {
        role: 'manager',
        action: 'upload',
        pkArtist,
        data 
      }
    },
  }),
  checkTxStatus: (txId) => ({
		id: 'tx_status',
		method: 'tx_status',
		params: {
			txId
		}
	}),
	getUTXO: () => ({
		id: 'get_utxo',
		method: 'get_utxo',
		params: {
			skip: 0,
			sort: {
					field: 'amount',
					direction: 'asc'
			}
	}
	}),
	splitUTXO: () => ({
			id: 'tx_split',
			method:'tx_split', 
			params:
			{
					coins : [11, 12, 13, 50000000],
					fee : 100000,
					asset_id: 0
			}
	})
};
