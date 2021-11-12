/**
 * @jest-environment jsdom
 */
// import 'jasmine';
import Action from '@components/page/main/form/action/action.component';
import Form from '@components/page/main/form/form.component';
import { BaseComponent } from '@components/shared';
import { Tags } from '@constants/html-elements';
import { AC } from '@logic/action-creators';
import { STORE, BEAM } from '@logic/controllers';
import BeamAPI from '@logic/observers/beam.logic';
import Store from '@logic/observers/store.logic';

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

let component: Form | Action | BaseComponent;

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
