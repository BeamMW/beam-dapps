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
        this.rootElement.innerHTML = '';
        this.rootElement.append(new Canvas().element);
      });
  }
}
