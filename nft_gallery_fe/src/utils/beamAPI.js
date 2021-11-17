import Utils from '../utils/utils';
// import { nextTick } from "vue";
import store from '../store/index.js';
import { shader } from './shader';
import drawing from './nft-generator/app.js';

export default function start() {
  Utils.invokeContract(
    'role=manager,action=view',
    (...args) => onCheckCID(...args),
    shader
  );
}

const onCheckCID = (err, res) => {
  console.log(1);
  if (err) {
    return store.dispatch('GET_ERR', 'Failed to verify cid');
  }
  if (!res.contracts.some((el) => el.cid == store.state.cid)) {
    throw `CID not found '${store.getters.CID}'`;
  }
  Utils.invokeContract(
    `role=manager,action=seeds,cid=${store.getters.CID}`,
    (...args) => LoadSeeds(...args)
  );
};
// const getSeed = () => {
//   const seedNum = Date.parse(new Date());
//   Utils.invokeContract(
//     `role=user,action=generate,cid=${store.state.cid},seed=${seedNum}`,
//     (...args) => makeTx(...args)
//   );
// };

//   load all seeds
const LoadSeeds = (err, res) => {
  if (err) return store.dispatch('GET_ERR', err);
  const items = res.seeds.map((el, idx) => ({
    ...el,
    id: idx,
    price: el.amount,
    owned: false,
    in_tx: false,
    bytes: drawing(el.seed),
  }));
  Utils.invokeContract(
    `role=user,action=get_user_seeds,cid=${store.state.cid}`,
    (...args) => LoadYourSeeds(items, ...args)
  );
  store.dispatch('GET_ITEMS', items);
};
// load your seeds & update seed owned

const LoadYourSeeds = (items, err, { seeds }) => {
  if (err) return store.dispatch('GET_ERR', err);
  const mapedOwnerSeeds = seeds.map((seed) => seed.holder);
  const updated = items.map((seed) => ({
    ...seed,
    owned: mapedOwnerSeeds.includes(seed.holder),
  }));
  const mySeeds = seeds.map((el, idx) => ({
    ...el,
    id: idx,
    price: el.amount,
    owned: true,
    in_tx: false,
    bytes: drawing(el.seed),
  }));

  store.state.myItems = mySeeds;
  store.dispatch('GET_ITEMS', updated);
  changeLoading();
};

//   transaction

// const makeTx = (err, sres, full) => {
//   if (err) {
//     return store.dispatch('GET_ERR', err);
//   }

//   Utils.ensureField(full.result, 'raw_data', 'array');
//   Utils.callApi(
//     'process_invoke_data',
//     { data: full.result.raw_data },
//     (...args) => onSendToChain(...args)
//   );
//   // console.log(full.result.txid);
//   // getInfoTx(full.result.txid)
// };

// const getInfoTx = (err, full) => {
//   if (err) {
//     return store.dispatch('GET_ERR', err);
//   }
// };

// const onSendToChain = (err, res) => {
//   if (err) {
//     if (Utils.isUserCancelled(err)) return;
//     return store.dispatch('GET_ERR', err);
//   }
//   Utils.ensureField(res, 'txid', 'string');
//   Utils.callApi(
//     'tx_status',
//     {
//       txId: res.txid,
//     },
//     (...args) => checkStatus(...args)
//   );
// };

// const checkStatus = (err, full) => {
//   // console.log(full.status_string);
//   if (err) {
//     console.log(err);
//   }
//   if (full.status_string === 'in progress') {
//     setTimeout(() => {
//       Utils.callApi(
//         'tx_status',
//         {
//           txId: full.txId,
//         },
//         (...args) => checkStatus(...args)
//       );
//     }, 5000);
//   } else if (full.status_string === 'completed') {
//     console.log(full.status_string);
//     Utils.invokeContract(
//       `role=manager,action=seeds,cid=${store.state.cid}`,
//       (...args) => LoadSeeds(...args)
//     );
//   }
// };

//   reload() {
//       Utils.invokeContract(
//           `role=manager,action=seeds,cid=${state.cid}`,
//           (...args) => LoadSeeds(...args)
//         )
// },

//   viewTxStatus(txId) {
//     Utils.callApi("tx_status",{
//         txId
//       },
//       () => reload()
//   );
//     },

//  Buy & sell seeds

// const buyAsset = (id, seed)  =>{
//   Utils.invokeContract(
//     `role=user,action=buy,cid=${store.state.cid},seed=${seed},price=${store.state.items[id].amount}`,
//     (...args) => makeTx(...args),
//   );
// }

// const sellAsset = (seed, id) => {
//   let price = prompt("Enter the price in BEAM");
//   if (price == null) return;
//   price = parseToGroth(price);
//   Utils.invokeContract(
//     `role=user,action=set_price,cid=${store.state.cid},aid=0,seed=${seed},price=${price}`,
//     (...args) => makeTx(...args),
//   );
// }

const changeLoading = () => {
  store.state.loading = false;
};