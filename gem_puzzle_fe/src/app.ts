import BaseComponent from './components/base/base.component';
import Canvas from './components/canvas/canvas.component';
import Loader from './components/loader/loader.component';
import { BeamAPI } from './utils/beamAPI';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.API = new BeamAPI();
    this.rootElement.append(new Loader().element);
    this.API.loadAPI()
      .then(() => {
        BaseComponent.apiHandler = {
          callApi: this.API.callApi,
          addObservers: this.API.addObservers
        };
        this.rootElement.innerHTML = '';
        this.rootElement.append(new Canvas().element);
      });
  }
}
