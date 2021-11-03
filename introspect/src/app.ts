import { BeamAPI } from './logic/beam/beam.logic';
import './scss/main.scss';
import Main from './components/pages/main/main.component';
import Loader from './components/shared/loader/loader.component';
import { Store } from './logic/store/store.logic';
import { BEAM, STORE } from './controllers';

export class App {
  constructor(rootElement: HTMLElement) {
    const loader = new Loader();
    rootElement.append(loader.element);

    new BeamAPI().loadAPI().then((data:BeamAPI) => {
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
      loader.replace(new Main());
    });
  }
}
