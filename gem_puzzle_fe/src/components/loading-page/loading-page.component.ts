import { Tags } from '../../constants/html';
import BaseComponent from '../base/base.component';
import FlexContainer from '../shared/flex-container/flex-container.component';
import Button from '../shared/simple-button/simple-button.component';
import './loading-page.scss';

export default class LoadingPage extends BaseComponent {
  constructor(appname:string, url:string, selector = 'beforeLoad') {
    super(Tags.DIV, [selector]);

    const loadContainer = new BaseComponent(
      Tags.DIV, [`${selector}_loadContainer`]
    ).setAttributes({ id: 'dapp-loading' });

    const titleElem = new BaseComponent(Tags.H3);
    titleElem.innerHTML = 'Connecting to BEAM Web Wallet.';

    const subtitle = new BaseComponent(Tags.P);
    subtitle.innerHTML = this.beforeLoadMessage(appname);

    const reconnectBtn = new Button({
      name: 'Try to connect again',
      action: 'reconnect'
    });

    reconnectBtn.addEventListener('click', () => window.location.reload());

    const installBtn = new Button({
      name: 'Install BEAM Web Wallet',
      action: 'install'
    });

    installBtn.addEventListener('click', () => {
      window.open(url, '_blank');
    });

    this.append(
      loadContainer.append(
        titleElem, subtitle, new FlexContainer(
          `${selector}_container`, reconnectBtn, installBtn
        )
          .setJustify('space-between').setAlign('center').flexWrap('wrap')
      )
    );
  }

  beforeLoadMessage = (appname: string):string => `
To use ${
  appname
} you should have BEAM Web Wallet installed and allow connection.`;
}
