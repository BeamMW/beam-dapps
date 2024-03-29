import { IFormState } from '@alltypes';
import { BaseComponent } from '@components/shared';
import { AC } from '@logic/action-creators';
import { STORE } from '@logic/controllers';
import { makeDotted } from '@utils/string-handlers';

export default [
  {
    title: 'Connect to contract status',
    data: 'connected',
    callback(state: IFormState, component: BaseComponent):void {
      if (state.error.msg !== '') {
        setTimeout(() => {
          component.textContent = 'connected';
          STORE.dispatch(AC.setError({ msg: '', code: null, data: '' }));
        }, 5000);
        component.textContent = !state.error.data
          ? state.error.msg
          : state.error.data;
      }
    }
  },
  {
    title: 'Active transactions:',
    data: '0',
    callback: (state: IFormState, component: BaseComponent):void => {
      const txCount = state.txs.size;
      component.innerText(`${txCount}`);
    }
  },
  {
    title: 'Default CID:',
    data: 'not assigned',
    callback: (state: IFormState, component: BaseComponent):void => {
      if (state.defaultCid !== null
      && component.textContent !== state.defaultCid) {
        component.textContent = makeDotted(state.defaultCid);
      }
    }
  }
];
