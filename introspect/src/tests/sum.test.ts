/**
 * @jest-environment jsdom
 */
import { IActionParams } from 'beamApiProps';
import { Tags } from '../constants/html_elements';
import { AC } from '../logic/store/action-creators';
import { Form } from '../components/input/form.component';
import { ValueLabel } from '../components/shared/action/action_label.component';
import { BEAM } from '../controllers/beam.controller';
import { STORE } from '../controllers/store.controller';
import { BeamAPI } from '../logic/beam/BeamAPI';
import { Store } from '../logic/store/store.logic';
import BaseComponent from '../components/shared/base/base.component';

const obj = {
  roles: {
    manager: {
      cats: {
        cats_ammount: 'number',
        type_of_dogs: 'string'
      }
    },
    player: {
      dogs: {
        dogs_ammount: 'number',
        type_of_dogs: 'string'
      }
    }
  }
};

// const apiObj: APIResponse = {
//   id: 'dogs',
//   jsonrpc: '1',
//   result: {
//     output: '111',
//     txid: '111',
//     txId: '111',
//     raw_data: [1, 2, 3, 4],
//     comment: 'some comment',
//     status_string: 'in progress',
//     failure_reason: 'hz',
//     metadata_pairs: 'some metadata'
//   }
// };

let component: Form | ValueLabel | BaseComponent;

describe('test actions', () => {
  beforeEach(() => {
    const data = new BeamAPI();
    const store = new Store();
    STORE.setApiHandlers({
      subscribe: store.subscribe,
      dispatch: store.dispatch,
      getRole: store.getRole,
      isStoreObserver: store.isStoreObserver
    });
    BEAM.setApiHandlers({
      subscribe: data.subscribe,
      callApi: data.callApi,
      initShader: data.initShader,
      deleteObserver: data.subscribe
    });
    BEAM.initShader(new ArrayBuffer(20000));
  });

  it('Reducer check', () => {
    STORE.dispatch(AC.setRole('player'), 'sync');
    expect(STORE.getState().role).toBe('player');

    STORE.dispatch(AC.setFileName('app.wasm'), 'sync');
    expect(STORE.getState().fileName).toBe('app.wasm');

    STORE.dispatch(AC.setOnload('some action'), 'sync');
    expect(STORE.getState().onload.has('some action')).toBe(true);

    STORE.dispatch(AC.deleteOnload('some action'), 'sync');
    expect(STORE.getState().onload.has('some action')).toBe(false);

    STORE.dispatch(
      AC.setTxs({
        key: 'some action',
        value: 'trnsctn1234'
      }),
      'sync'
    );
    expect(STORE.getState().txs.has('some action')).toBe(true);

    STORE.dispatch(AC.removeTxs('some action'), 'sync');
    expect(STORE.getState().txs.has('some action')).toBe(false);
  });

  it('Checking UI synchronization with app state', () => {
    component = new Form(obj);
    expect(STORE.getState().role).toBe('manager');

    const playerBtn = component.querySelector('.role-player') as HTMLElement;
    expect(playerBtn).not.toBe(null);

    playerBtn.click();
    setTimeout(() => {
      expect(STORE.getState().role).toBe('player');
      expect((<Form>component).roleValue).toBe('player');
    });
  });

  it('Cats in onload list from common form', () => {
    component = new Form(obj);
    const button = component.element.querySelector('.submit') as HTMLElement;
    button.click();
    setTimeout(() => expect(STORE.getState().onload.has('cats')).toBe(true));
  });

  it('Cats in onload list from action form', () => {
    const action = Object.entries(obj.roles.manager)[0] as [
      string,
      IActionParams
    ];
    const currentAction = action[0];
    STORE.dispatch(AC.setRole('manager'), 'sync');
    component = new ValueLabel(action, 5);
    document.body.append(component.element);
    const button = component
      .element.querySelector(`.submit-${currentAction}`) as HTMLElement;
    const clear = component
      .element.querySelector(`.clear-${currentAction}`) as HTMLElement;
    const input = component.element.querySelector(
      '.params__input'
    ) as HTMLInputElement;

    input.value = '1';
    const event = new window.Event('input');
    input.dispatchEvent(event);
    expect((<ValueLabel>component)
      .getArgs()).toBe(`action=${currentAction},cats_ammount=1,role=manager`);

    clear.click();
    expect((<ValueLabel>component).getArgs())
      .toBe(`action=${currentAction},role=manager`);

    button.click();
    setTimeout(() => {
      expect(STORE.getState().onload.has(currentAction)).toBe(true);
    });
  });

  it('Remove component from observers list(store)', () => {
    component = new BaseComponent(Tags.DIV);
    document.body.append(component.element);
    STORE.subscribe(component);
    component.element.remove();
    setTimeout(() => {
      expect(STORE.isStoreObserver(component)).toBe(false);
    });
  });
});
