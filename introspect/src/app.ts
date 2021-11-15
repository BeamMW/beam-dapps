import { Main, BeforLoad } from '@components/page';
import { Loader } from '@components/shared';
import { BEAM, STORE } from '@logic/controllers';
import { BeamObserver, StoreObserver } from '@logic/observers';
import './styles/main.scss';

export class App {
  constructor(rootElement: HTMLElement) {
    const ua = navigator.userAgent;
    const beforeLoad = /QtWebEngine/i.test(ua)
      ? new Loader() : new BeforLoad('Introspect');
    rootElement.append(beforeLoad.element);

    new BeamObserver().loadAPI(ua).then((data:BeamObserver) => {
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
      beforeLoad.replace(new Main());
    });
  }
}
