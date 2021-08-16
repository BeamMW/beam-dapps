import { BeamAPI } from './beamAPI/BeamAPI';
import loader from './assets/loader.svg';
import BaseComponent from './components/BaseComponent/BaseComponent';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly loader: BaseComponent;

  private readonly API: BeamAPI;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.API = new BeamAPI();
    this.loader = new BaseComponent('img', ['loader']);
    this.loader.element.setAttribute('src', loader);
    this.rootElement.append(this.loader.element);
    this.API.loadAPI()
      .then(() => {
        // this.rootElement.innerHTML = 'hello!';
      });
  }
}
