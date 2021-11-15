import { BaseComponent, Button, FlexContainer } from '@components/shared';
import { Tags } from '@constants/html-elements';
import { beforeLoadMessage } from '@utils/string-handlers';
import { ShaderProps } from '../../../lib/constants/app-shader';
import './before-load.scss';

export default class BeforLoad extends BaseComponent {
  constructor(appname:string, selector = 'beforeLoad') {
    super(Tags.DIV, [selector]);

    const loadContainer = new BaseComponent(
      Tags.DIV, [`${selector}_loadContainer`]
    ).setAttributes({ id: 'dapp-loading' });

    const titleElem = new BaseComponent(Tags.H3);
    titleElem.textContent = 'Connecting to BEAM Web Wallet.';

    const subtitle = new BaseComponent(Tags.P);
    subtitle.textContent = beforeLoadMessage(appname);

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
      window.open(ShaderProps.EXT_URL, '_blank');
    });

    this.append(
      loadContainer.append(
        titleElem, subtitle, new FlexContainer(reconnectBtn, installBtn)
          .setJustify('space-between').setAlign('center').flexWrap('wrap')
      )
    );
  }
}
