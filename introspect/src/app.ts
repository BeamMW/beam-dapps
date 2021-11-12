import { Main } from '@components/page';
import { Loader } from '@components/shared';
import { BEAM, STORE } from '@logic/controllers';
import { BeamObserver, StoreObserver } from '@logic/observers';
import './styles/main.scss';

export class App {
  constructor(rootElement: HTMLElement) {
    const loader = new Loader();
    rootElement.append(loader.element);

    new BeamObserver().loadAPI().then((data:BeamObserver) => {
      const store = new StoreObserver();
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
      loader.replace(new Main());
    });
  }
}
